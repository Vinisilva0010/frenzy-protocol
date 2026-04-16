use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

// Seu ID da Devnet (Não mude!)
declare_id!("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e"); 

#[program]
pub mod frenzy_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, max_loss_bps: u16) -> Result<()> {
        let mut vault = ctx.accounts.vault_state.load_init()?;
        
        vault.authority = ctx.accounts.authority.key();
        vault.safety_balance = 0;
        vault.chaos_balance = 0;
        vault.max_daily_loss_bps = max_loss_bps; 
        vault.kill_switch = 0; 
        
        msg!("FRENZY Protocol: Cofre Inicializado.");
        Ok(())
    }

    pub fn split_deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        {
            let vault = ctx.accounts.vault_state.load()?;
            require!(vault.kill_switch == 0, FrenzyError::KillSwitchActive);
        }

        invoke(
            &system_instruction::transfer(
                &ctx.accounts.user.key(),
                &ctx.accounts.vault_state.key(),
                amount,
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault_state.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let mut vault = ctx.accounts.vault_state.load_mut()?;
        
        let safe_allocation = amount / 2;
        let chaos_allocation = amount - safe_allocation;

        vault.safety_balance = vault.safety_balance.checked_add(safe_allocation).unwrap();
        vault.chaos_balance = vault.chaos_balance.checked_add(chaos_allocation).unwrap();

        msg!("FRENZY: Depósito processado. {} para Segurança, {} para Caos.", safe_allocation, chaos_allocation);
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        {
            let mut vault = ctx.accounts.vault_state.load_mut()?;
            
            let total_balance = vault.safety_balance.checked_add(vault.chaos_balance).unwrap();
            require!(amount <= total_balance, FrenzyError::InsufficientFunds);

            let safe_deduction = (amount as u128 * vault.safety_balance as u128 / total_balance as u128) as u64;
            let chaos_deduction = amount - safe_deduction;

            vault.safety_balance = vault.safety_balance.checked_sub(safe_deduction).unwrap();
            vault.chaos_balance = vault.chaos_balance.checked_sub(chaos_deduction).unwrap();
        }

        let vault_info = ctx.accounts.vault_state.to_account_info();
        let user_info = ctx.accounts.user.to_account_info();
        
        let rent = Rent::get()?;
        let min_rent = rent.minimum_balance(vault_info.data_len());
        let available_lamports = vault_info.lamports().saturating_sub(min_rent);

        require!(amount <= available_lamports, FrenzyError::InsufficientFunds);

        **vault_info.try_borrow_mut_lamports()? -= amount;
        **user_info.try_borrow_mut_lamports()? += amount;

        msg!("FRENZY: Saque de {} lamports liberado com sucesso.", amount);
        Ok(())
    }

    // =================================================================
    // A NOVA MÁGICA: O Oráculo Injetando Lucro (Mock Yield)
    // =================================================================
    pub fn inject_mock_yield(ctx: Context<InjectYield>, safe_yield: u64, chaos_yield: u64) -> Result<()> {
        let total_yield = safe_yield.checked_add(chaos_yield).unwrap();

        // O Admin transfere fisicamente o SOL para o cofre do usuário
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.admin.key(),
                &ctx.accounts.vault_state.key(),
                total_yield,
            ),
            &[
                ctx.accounts.admin.to_account_info(),
                ctx.accounts.vault_state.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Registramos na matemática do cofre que ele ficou mais rico
        let mut vault = ctx.accounts.vault_state.load_mut()?;
        vault.safety_balance = vault.safety_balance.checked_add(safe_yield).unwrap();
        vault.chaos_balance = vault.chaos_balance.checked_add(chaos_yield).unwrap();

        msg!("FRENZY ORACLE: Rendimento injetado! Safe: +{}, Chaos: +{}", safe_yield, chaos_yield);
        Ok(())
    }

    pub fn trigger_kill_switch(ctx: Context<TriggerKillSwitch>) -> Result<()> {
        let mut vault = ctx.accounts.vault_state.load_mut()?;
        vault.kill_switch = 1;
        msg!("FRENZY ALERTA CRÍTICO: Kill-Switch Ativado.");
        Ok(())
    }
}

// ==========================================
// ESTRUTURAS DE CONTEXTO
// ==========================================

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
    #[account(
        mut,
        seeds = [b"frenzy_state", user.key().as_ref()],
        bump
    )]
    pub vault_state: AccountLoader<'info, VaultState>,
}

// NOVA ROTA: Rota de injeção de rendimento
#[derive(Accounts)]
pub struct InjectYield<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, // Você, injetando os fundos de teste
    
    #[account(mut)]
    pub vault_state: AccountLoader<'info, VaultState>, // O cofre do usuário que vai receber o lucro
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TriggerKillSwitch<'info> {
    pub authority: Signer<'info>, 
    #[account(mut, has_one = authority)]
    pub vault_state: AccountLoader<'info, VaultState>,
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
}

#[error_code]
pub enum FrenzyError {
    #[msg("Acesso Negado: O Kill-Switch foi ativado.")]
    KillSwitchActive,
    #[msg("Saldo Insuficiente: Você tentou sacar mais do que possui no cofre.")]
    InsufficientFunds,
}