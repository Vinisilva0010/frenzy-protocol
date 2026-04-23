use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use crate::state::{ProtocolConfig, VaultState};
use crate::errors::FrenzyError;
use crate::MASTER_ADMIN;

pub fn devnet_yield_simulator(
    ctx: Context<InjectYield>,
    total_payment: u64,
) -> Result<()> {
    require!(ctx.accounts.protocol_config.simulation_mode, FrenzyError::SimulationDisabled);
    require!(!ctx.accounts.protocol_config.kill_switch, FrenzyError::KillSwitchActive);
    require!(total_payment > 0, FrenzyError::InvalidAmount);

    let caller = ctx.accounts.admin.key();
    let config = &ctx.accounts.protocol_config;
    require!(
        caller == config.yield_admin || caller == MASTER_ADMIN,
        FrenzyError::Unauthorized
    );

    invoke(
        &system_instruction::transfer(
            &ctx.accounts.admin.key(),
            &ctx.accounts.vault_state.key(),
            total_payment,
        ),
        &[
            ctx.accounts.admin.to_account_info(),
            ctx.accounts.vault_state.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    let vault = &mut ctx.accounts.vault_state;
    let senior_target = vault.compute_senior_target(total_payment);

    if total_payment >= senior_target {
        let junior_alpha = total_payment
            .checked_sub(senior_target)
            .ok_or(FrenzyError::MathOverflow)?;

        vault.senior_tranche = vault.senior_tranche
            .checked_add(senior_target)
            .ok_or(FrenzyError::MathOverflow)?;
        vault.junior_tranche = vault.junior_tranche
            .checked_add(junior_alpha)
            .ok_or(FrenzyError::MathOverflow)?;
        vault.accumulated_profits = vault.accumulated_profits
            .checked_add(junior_alpha)
            .ok_or(FrenzyError::MathOverflow)?;

        msg!("LUCRO: senior={} | alpha={}", senior_target, junior_alpha);
    } else {
        let loss = senior_target
            .checked_sub(total_payment)
            .ok_or(FrenzyError::MathOverflow)?;

        vault.senior_tranche = vault.senior_tranche
            .checked_add(total_payment)
            .ok_or(FrenzyError::MathOverflow)?;
        vault.accumulated_losses = vault.accumulated_losses
            .checked_add(loss)
            .ok_or(FrenzyError::MathOverflow)?;

        msg!("CALOTE: payment={} | loss_absorvido={}", total_payment, loss);
    }

    msg!("TVL pós-simulação: {}", vault.total_tvl());
    Ok(())
}

#[derive(Accounts)]
pub struct InjectYield<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        seeds = [b"protocol_config"],
        bump
    )]
    pub protocol_config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
        seeds = [b"frenzy_state", vault_state.authority.as_ref()],
        bump
    )]
    pub vault_state: Account<'info, VaultState>,

    pub system_program: Program<'info, System>,
}