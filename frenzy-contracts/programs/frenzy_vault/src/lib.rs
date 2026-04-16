use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

// ID temporário (mantenha o seu da Devnet)
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
        let mut vault = ctx.accounts.vault_state.load_mut()?;
        
        require!(vault.kill_switch == 0, FrenzyError::KillSwitchActive);

        // =================================================================
        // A MÁGICA REAL (Nativa): Transferindo o SOL direto na veia da rede
        // =================================================================
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

        // A Matemática Imutável
        let safe_allocation = amount / 2;
        let chaos_allocation = amount - safe_allocation;

        vault.safety_balance = vault.safety_balance.checked_add(safe_allocation).unwrap();
        vault.chaos_balance = vault.chaos_balance.checked_add(chaos_allocation).unwrap();

        msg!("FRENZY: Depósito real processado. {} para Segurança, {} para Caos.", safe_allocation, chaos_allocation);
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
// ESTRUTURAS DE CONTEXTO (AS ROTAS)
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
    
    // O contrato exige o System Program para poder transferir o dinheiro
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TriggerKillSwitch<'info> {
    pub authority: Signer<'info>, 
    #[account(mut, has_one = authority)]
    pub vault_state: AccountLoader<'info, VaultState>,
}

// ==========================================
// O ESTADO DO COFRE (ZERO COPY)
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

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

#[error_code]
pub enum FrenzyError {
    #[msg("Acesso Negado: O Kill-Switch foi ativado. Operações suspensas para proteção de patrimônio.")]
    KillSwitchActive,
}