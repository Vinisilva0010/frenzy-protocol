use anchor_lang::prelude::*;
use crate::state::{ProtocolConfig, VaultState};
use crate::errors::FrenzyError;

pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    require!(amount > 0, FrenzyError::InvalidAmount);

    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    // ── TRAVA GLOBAL ANTI-SYBIL ───────────────────────────────────
    let config = &mut ctx.accounts.protocol_config;

    if current_time >= config.global_quota_reset_ts + crate::COOLDOWN_PERIOD {
        config.global_withdrawn_last_24h = 0;
        config.global_quota_reset_ts = current_time;
    }

    let new_global_total = config.global_withdrawn_last_24h
        .checked_add(amount)
        .ok_or(FrenzyError::MathOverflow)?;

    require!(
        new_global_total <= config.global_withdrawal_quota_24h,
        FrenzyError::GlobalWithdrawalQuotaExceeded
    );
    config.global_withdrawn_last_24h = new_global_total;

    // ── TRAVA INDIVIDUAL ──────────────────────────────────────────
    let vault = &mut ctx.accounts.vault_state;

    require!(vault.authority == ctx.accounts.user.key(), FrenzyError::UnauthorizedAccess);
    require!(
        current_time >= vault.last_withdrawal_timestamp + crate::COOLDOWN_PERIOD,
        FrenzyError::WithdrawalCooldownActive
    );

    let total_balance = vault.total_tvl();
    require!(total_balance > 0, FrenzyError::InsufficientFunds);
    require!(amount <= total_balance, FrenzyError::InsufficientFunds);

    // ── DEDUÇÃO PROPORCIONAL ──────────────────────────────────────
    let senior_deduction = (amount as u128)
        .checked_mul(vault.senior_tranche as u128)
        .ok_or(FrenzyError::MathOverflow)?
        .checked_div(total_balance as u128)
        .ok_or(FrenzyError::MathOverflow)? as u64;

    let junior_deduction = amount
        .checked_sub(senior_deduction)
        .ok_or(FrenzyError::MathOverflow)?;

    vault.senior_tranche = vault.senior_tranche
        .checked_sub(senior_deduction)
        .ok_or(FrenzyError::MathOverflow)?;
    vault.junior_tranche = vault.junior_tranche
        .checked_sub(junior_deduction)
        .ok_or(FrenzyError::MathOverflow)?;
    vault.last_withdrawal_timestamp = current_time;

    // ── INVARIANTE ────────────────────────────────────────────────
    let expected = total_balance.checked_sub(amount).ok_or(FrenzyError::MathOverflow)?;
    require!(vault.total_tvl() == expected, FrenzyError::InvariantViolation);

    // ── TRANSFERÊNCIA FÍSICA ──────────────────────────────────────
    let vault_info = ctx.accounts.vault_state.to_account_info();
    let user_info = ctx.accounts.user.to_account_info();

    let min_rent = Rent::get()?.minimum_balance(vault_info.data_len());
    let available = vault_info.lamports().saturating_sub(min_rent);
    require!(amount <= available, FrenzyError::InsufficientFunds);

    **vault_info.try_borrow_mut_lamports()? -= amount;
    **user_info.try_borrow_mut_lamports()? += amount;

    msg!("WITHDRAW: {} lamports → {}", amount, ctx.accounts.user.key());
    Ok(())
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
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
}