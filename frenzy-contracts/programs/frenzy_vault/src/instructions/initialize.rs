use anchor_lang::prelude::*;
use crate::state::{ProtocolConfig, VaultState};
use crate::errors::FrenzyError;
use crate::MASTER_ADMIN;

pub fn initialize_protocol(
    ctx: Context<InitProtocol>,
    yield_admin: Pubkey,
    emergency_admin: Pubkey,
    global_daily_limit: u64,
) -> Result<()> {
    require!(
        ctx.accounts.admin.key() == MASTER_ADMIN,
        FrenzyError::UnauthorizedMaster
    );

    let config = &mut ctx.accounts.protocol_config;
    config.master_admin = MASTER_ADMIN;
    config.yield_admin = yield_admin;
    config.emergency_admin = emergency_admin;
    config.global_withdrawal_quota_24h = global_daily_limit;
    config.global_withdrawn_last_24h = 0;
    config.global_quota_reset_ts = Clock::get()?.unix_timestamp;
    config.simulation_mode = true;
    config.kill_switch = false;

    msg!("FIDC-X Protocol initialized. quota={}", global_daily_limit);
    Ok(())
}

pub fn initialize(
    ctx: Context<Initialize>,
    subordination_ratio_bps: u16,
) -> Result<()> {
    require!(subordination_ratio_bps >= 500, FrenzyError::RatioTooLow);
    require!(subordination_ratio_bps <= 5000, FrenzyError::InvalidRatio);

    let vault = &mut ctx.accounts.vault_state;
    vault.authority = ctx.accounts.authority.key();
    vault.senior_tranche = 0;
    vault.junior_tranche = 0;
    vault.subordination_ratio_bps = subordination_ratio_bps;
    vault.last_withdrawal_timestamp = 0;
    vault.accumulated_losses = 0;
    vault.accumulated_profits = 0;

    msg!(
        "FIDC-X Vault initialized. authority={} | ratio={}bps",
        ctx.accounts.authority.key(),
        subordination_ratio_bps
    );
    Ok(())
}

#[derive(Accounts)]
pub struct InitProtocol<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = ProtocolConfig::LEN,
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = VaultState::LEN,
        seeds = [b"frenzy_state", authority.key().as_ref()],
        bump
    )]
    pub vault_state: Account<'info, VaultState>,

    pub system_program: Program<'info, System>,
}