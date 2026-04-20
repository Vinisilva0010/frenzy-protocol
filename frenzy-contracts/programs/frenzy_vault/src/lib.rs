use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction, pubkey};

// Seu ID da Devnet (Não mude!)
declare_id!("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e"); 

// =================================================================
//  CONSTANTES GLOBAIS (RBAC - MASTER ADMIN)
// =================================================================
// Apenas esta carteira pode trocar os outros administradores.
pub const MASTER_ADMIN: Pubkey = pubkey!("7aSDp11gPbCCew7yMSQKuBLr6pcKfgwRPtp2QgAE89f3");
pub const COOLDOWN_PERIOD: i64 = 86400; // 24 horas em segundos (Trava Anti-Bank Run)

#[program]
pub mod frenzy_vault {
    use super::*;

    // =================================================================
    //  MÓDULO 0: ADMINISTRAÇÃO GLOBAL (RBAC)
    // =================================================================
    pub fn initialize_protocol(ctx: Context<InitProtocol>, yield_admin: Pubkey, emergency_admin: Pubkey) -> Result<()> {
        require!(ctx.accounts.admin.key() == MASTER_ADMIN, FrenzyError::UnauthorizedMaster);
        
        let config = &mut ctx.accounts.protocol_config;
        config.master_admin = MASTER_ADMIN;
        config.yield_admin = yield_admin;
        config.emergency_admin = emergency_admin;
        
        msg!("FRENZY Protocol: Controle de Acesso Global (RBAC) Inicializado.");
        Ok(())
    }

    pub fn update_admins(ctx: Context<UpdateAdmins>, new_yield: Pubkey, new_emergency: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.protocol_config;
        require!(ctx.accounts.admin.key() == config.master_admin, FrenzyError::UnauthorizedMaster);
        
        config.yield_admin = new_yield;
        config.emergency_admin = new_emergency;
        
        msg!("FRENZY Protocol: Permissões de Administradores Atualizadas com Sucesso.");
        Ok(())
    }

    // =================================================================
    //  MÓDULO 1: INSTRUÇÕES DO COFRE DO USUÁRIO
    // =================================================================
    pub fn initialize(ctx: Context<Initialize>, max_loss_bps: u16) -> Result<()> {
        let mut vault = ctx.accounts.vault_state.load_init()?;
        vault.authority = ctx.accounts.authority.key();
        vault.safety_balance = 0;
        vault.chaos_balance = 0;
        vault.max_daily_loss_bps = max_loss_bps; 
        vault.kill_switch = 0; 
        vault.last_withdrawal_timestamp = 0;
        msg!("FRENZY Protocol: Cofre Individual Inicializado.");
        Ok(())
    }

    pub fn split_deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        {
            let vault = ctx.accounts.vault_state.load()?;
            require!(vault.kill_switch == 0, FrenzyError::KillSwitchActive);
        }

        invoke(
            &system_instruction::transfer(&ctx.accounts.user.key(), &ctx.accounts.vault_state.key(), amount),
            &[ctx.accounts.user.to_account_info(), ctx.accounts.vault_state.to_account_info(), ctx.accounts.system_program.to_account_info()],
        )?;

        let mut vault = ctx.accounts.vault_state.load_mut()?;
        let safe_allocation = amount.checked_div(2).unwrap();
        let chaos_allocation = amount.checked_sub(safe_allocation).unwrap();

        vault.safety_balance = vault.safety_balance.checked_add(safe_allocation).unwrap();
        vault.chaos_balance = vault.chaos_balance.checked_add(chaos_allocation).unwrap();

        msg!("FRENZY: Depósito Seguro. {} Segurança, {} Caos.", safe_allocation, chaos_allocation);
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        {
            let mut vault = ctx.accounts.vault_state.load_mut()?;
            require!(vault.authority == ctx.accounts.user.key(), FrenzyError::UnauthorizedAccess);
            // SEGURANÇA ADEVAR: Trava de Cooldown (Anti-Bank Run)
            let clock = Clock::get()?;
            require!(
                clock.unix_timestamp >= vault.last_withdrawal_timestamp + COOLDOWN_PERIOD,
                FrenzyError::WithdrawalCooldownActive
            );

            let total_balance = vault.safety_balance.checked_add(vault.chaos_balance).unwrap();
            require!(amount <= total_balance, FrenzyError::InsufficientFunds);

            let safe_deduction = (amount as u128).checked_mul(vault.safety_balance as u128).unwrap().checked_div(total_balance as u128).unwrap() as u64;
            let chaos_deduction = amount.checked_sub(safe_deduction).unwrap();

            vault.safety_balance = vault.safety_balance.checked_sub(safe_deduction).unwrap();
            vault.chaos_balance = vault.chaos_balance.checked_sub(chaos_deduction).unwrap();
            vault.last_withdrawal_timestamp = clock.unix_timestamp;
        }

        let vault_info = ctx.accounts.vault_state.to_account_info();
        let user_info = ctx.accounts.user.to_account_info();
        let rent = Rent::get()?;
        let min_rent = rent.minimum_balance(vault_info.data_len());
        let available_lamports = vault_info.lamports().saturating_sub(min_rent);

        require!(amount <= available_lamports, FrenzyError::InsufficientFunds);

        **vault_info.try_borrow_mut_lamports()? -= amount;
        **user_info.try_borrow_mut_lamports()? += amount;
        Ok(())
    }

    // =================================================================
    //  MÓDULO 2: EXECUÇÃO DE FUNÇÕES ADMINISTRATIVAS
    // =================================================================
    pub fn inject_mock_yield(ctx: Context<InjectYield>, safe_yield: u64, chaos_yield: u64) -> Result<()> {
        // SEGURANÇA RBAC: Apenas o Yield_Admin registrado no estado global pode executar
        require!(ctx.accounts.admin.key() == ctx.accounts.protocol_config.yield_admin, FrenzyError::UnauthorizedYieldAdmin);

        let total_yield = safe_yield.checked_add(chaos_yield).unwrap();

        invoke(
            &system_instruction::transfer(&ctx.accounts.admin.key(), &ctx.accounts.vault_state.key(), total_yield),
            &[ctx.accounts.admin.to_account_info(), ctx.accounts.vault_state.to_account_info(), ctx.accounts.system_program.to_account_info()],
        )?;

        let mut vault = ctx.accounts.vault_state.load_mut()?;
        vault.safety_balance = vault.safety_balance.checked_add(safe_yield).unwrap();
        vault.chaos_balance = vault.chaos_balance.checked_add(chaos_yield).unwrap();
        Ok(())
    }

    pub fn trigger_kill_switch(ctx: Context<TriggerKillSwitch>) -> Result<()> {
        // SEGURANÇA RBAC: Apenas o Emergency_Admin registrado no estado global pode executar
        require!(ctx.accounts.admin.key() == ctx.accounts.protocol_config.emergency_admin, FrenzyError::UnauthorizedEmergencyAdmin);

        let mut vault = ctx.accounts.vault_state.load_mut()?;
        vault.kill_switch = 1;
        msg!("FRENZY ALERTA: Kill-Switch ativado remotamente pelo Emergency Admin!");
        Ok(())
    }
}

// =================================================================
//  MÓDULO 3: ESTADOS (As Estruturas de Dados On-Chain)
// =================================================================

#[derive(Accounts)]
pub struct InitProtocol<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = 8 + std::mem::size_of::<ProtocolConfig>(),
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAdmins<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<VaultState>(),
        seeds = [b"frenzy_state", authority.key().as_ref()],
        bump
    )]
    pub vault_state: AccountLoader<'info, VaultState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub vault_state: AccountLoader<'info, VaultState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"frenzy_state", user.key().as_ref()], bump)]
    pub vault_state: AccountLoader<'info, VaultState>,
}

#[derive(Accounts)]
pub struct InjectYield<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, 
    #[account(seeds = [b"protocol_config"], bump)]
    pub protocol_config: Account<'info, ProtocolConfig>,
    #[account(mut)]
    pub vault_state: AccountLoader<'info, VaultState>, 
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TriggerKillSwitch<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, 
    #[account(seeds = [b"protocol_config"], bump)]
    pub protocol_config: Account<'info, ProtocolConfig>,
    #[account(mut)]
    pub vault_state: AccountLoader<'info, VaultState>,
}

#[account]
pub struct ProtocolConfig {
    pub master_admin: Pubkey,
    pub yield_admin: Pubkey,
    pub emergency_admin: Pubkey,
}

#[account(zero_copy)]
#[repr(C)]
pub struct VaultState {
    pub authority: Pubkey,
    pub safety_balance: u64,
    pub chaos_balance: u64,
    pub max_daily_loss_bps: u16, 
    pub kill_switch: u8, 
    pub _padding: [u8; 5], 
    pub last_withdrawal_timestamp: i64,
}

// =================================================================
//  MÓDULO 4: TRATAMENTO DE ERROS
// =================================================================

#[error_code]
pub enum FrenzyError {
    #[msg("Acesso Negado: O Kill-Switch foi ativado e o protocolo está trancado.")]
    KillSwitchActive,
    #[msg("Saldo Insuficiente: Tentativa de saque maior que o saldo disponível.")]
    InsufficientFunds,
    #[msg("Violação de Segurança: A assinatura não corresponde ao dono do cofre.")]
    UnauthorizedAccess,
    #[msg("RBAC Falhou: Apenas o Master Admin pode executar esta ação.")]
    UnauthorizedMaster,
    #[msg("RBAC Falhou: Apenas o bot Yield Admin possui permissão de injeção.")]
    UnauthorizedYieldAdmin,
    #[msg("RBAC Falhou: Apenas o Emergency Admin pode travar o protocolo.")]
    UnauthorizedEmergencyAdmin,
    #[msg("Anti-Bank Run: O cofre está em Cooldown. Aguarde 24h entre os saques.")]
    WithdrawalCooldownActive,
}