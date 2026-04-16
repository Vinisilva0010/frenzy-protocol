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

        // Transfere o SOL da carteira pro Cofre
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

    // =================================================================
    // A NOVA FUNÇÃO: O Saque (Withdraw)
    // =================================================================
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let mut vault = ctx.accounts.vault_state.load_mut()?;
        
        // Calcula o total que o cara tem (Segurança + Caos)
        let total_balance = vault.safety_balance.checked_add(vault.chaos_balance).unwrap();
        require!(amount <= total_balance, FrenzyError::InsufficientFunds);

        // Desconta matematicamente 50/50 para manter o balanço
        let safe_deduction = (amount as u128 * vault.safety_balance as u128 / total_balance as u128) as u64;
        let chaos_deduction = amount - safe_deduction;

        vault.safety_balance = vault.safety_balance.checked_sub(safe_deduction).unwrap();
        vault.chaos_balance = vault.chaos_balance.checked_sub(chaos_deduction).unwrap();

        // Checa se o cofre tem SOL suficiente descontando a taxa de aluguel da Solana
        let vault_info = ctx.accounts.vault_state.to_account_info();
        let rent = Rent::get()?;
        let min_rent = rent.minimum_balance(vault_info.data_len());
        let available_lamports = vault_info.lamports().saturating_sub(min_rent);

        require!(amount <= available_lamports, FrenzyError::InsufficientFunds);

        // A Mágica: Tira os Lamports do cofre e joga na mão do usuário (modificação direta de memória)
        **ctx.accounts.vault_state.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += amount;

        msg!("FRENZY: Saque de {} lamports liberado com sucesso.", amount);
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

// ==========================================
// NOVA ROTA: Autorização de Saque
// ==========================================
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    // O cofre dele tem que bater com a carteira, e nós passamos o "bump" para validar a assinatura da PDA
    #[account(
        mut,
        seeds = [b"frenzy_state", user.key().as_ref()],
        bump
    )]
    pub vault_state: AccountLoader<'info, VaultState>,
}

#[derive(Accounts)]
pub struct TriggerKillSwitch<'info> {
    pub authority: Signer<'info>, 
    #[account(mut, has_one = authority)]
    pub vault_state: AccountLoader<'info, VaultState>,
}

// ==========================================
// ESTADO E ERROS
// ==========================================

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
    #[msg("Saldo Insuficiente: Você tentou sacar mais do que possui no cofre.")] // NOVO ERRO AQUI
    InsufficientFunds,
}