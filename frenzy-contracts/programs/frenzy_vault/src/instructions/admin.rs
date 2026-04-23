use anchor_lang::prelude::*;
use crate::state::{ProtocolConfig, VaultState};
use crate::errors::FrenzyError;
use crate::MASTER_ADMIN;

pub fn update_admins(
    ctx: Context<UpdateAdmins>,
    new_yield: Pubkey,
    new_emergency: Pubkey,
) -> Result<()> {
    require!(ctx.accounts.admin.key() == MASTER_ADMIN, FrenzyError::UnauthorizedMaster);

    let config = &mut ctx.accounts.protocol_config;
    config.yield_admin = new_yield;
    config.emergency_admin = new_emergency;

    msg!("Admins atualizados: yield={} | emergency={}", new_yield, new_emergency);
    Ok(())
}

pub fn trigger_kill_switch(ctx: Context<TriggerKillSwitch>) -> Result<()> {
    require!(
        ctx.accounts.admin.key() == ctx.accounts.protocol_config.emergency_admin,
        FrenzyError::UnauthorizedEmergencyAdmin
    );

    ctx.accounts.protocol_config.kill_switch = true;
    msg!("🚨 Kill Switch GLOBAL ativado por {}", ctx.accounts.admin.key());
    Ok(())
}

pub fn restore_protocol(ctx: Context<RestoreProtocol>) -> Result<()> {
    require!(ctx.accounts.admin.key() == MASTER_ADMIN, FrenzyError::UnauthorizedMaster);

    ctx.accounts.protocol_config.kill_switch = false;
    msg!("✅ Protocolo restaurado pelo Master Admin.");
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateAdmins<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(mut, seeds = [b"protocol_config"], bump)]
    pub protocol_config: Account<'info, ProtocolConfig>,
}

#[derive(Accounts)]
pub struct TriggerKillSwitch<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(mut, seeds = [b"protocol_config"], bump)]
    pub protocol_config: Account<'info, ProtocolConfig>,
}

#[derive(Accounts)]
pub struct RestoreProtocol<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(mut, seeds = [b"protocol_config"], bump)]
    pub protocol_config: Account<'info, ProtocolConfig>,
}