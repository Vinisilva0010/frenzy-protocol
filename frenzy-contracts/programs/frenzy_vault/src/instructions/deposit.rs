use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use crate::state::{ProtocolConfig, VaultState};
use crate::errors::FrenzyError;

pub fn split_deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    require!(amount > 0, FrenzyError::InvalidAmount);
    require!(!ctx.accounts.protocol_config.kill_switch, FrenzyError::KillSwitchActive);
    require!(
        ctx.accounts.vault_state.authority == ctx.accounts.user.key(),
        FrenzyError::UnauthorizedAccess
    );

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

    let ratio = ctx.accounts.vault_state.subordination_ratio_bps;

    let junior_allocation = (amount as u128)
        .checked_mul(ratio as u128)
        .ok_or(FrenzyError::MathOverflow)?
        .checked_div(10_000)
        .ok_or(FrenzyError::MathOverflow)? as u64;

    let senior_allocation = amount
        .checked_sub(junior_allocation)
        .ok_or(FrenzyError::MathOverflow)?;

    let vault = &mut ctx.accounts.vault_state;
    vault.senior_tranche = vault.senior_tranche
        .checked_add(senior_allocation)
        .ok_or(FrenzyError::MathOverflow)?;
    vault.junior_tranche = vault.junior_tranche
        .checked_add(junior_allocation)
        .ok_or(FrenzyError::MathOverflow)?;

    msg!(
        "DEPOSIT: total={} | senior={} | junior={} | tvl={}",
        amount, senior_allocation, junior_allocation, vault.total_tvl()
    );
    Ok(())
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
        seeds = [b"frenzy_state", user.key().as_ref()],
        bump
    )]
    pub vault_state: Account<'info, VaultState>,

    pub system_program: Program<'info, System>,
}