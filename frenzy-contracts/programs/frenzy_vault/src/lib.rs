#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("BLafEMNRKAimMcisFEpUg8oZuCKSSNaujdQf7moNpFyx");

pub const MASTER_ADMIN: Pubkey = pubkey!("7aSDp11gPbCCew7yMSQKuBLr6pcKfgwRPtp2QgAE89f3");
pub const COOLDOWN_PERIOD: i64 = 86400;

#[program]
pub mod frenzy_vault {
    use super::*;

    pub fn initialize_protocol(ctx: Context<InitProtocol>, yield_admin: Pubkey, emergency_admin: Pubkey, global_daily_limit: u64) -> Result<()> {
        instructions::initialize::initialize_protocol(ctx, yield_admin, emergency_admin, global_daily_limit)
    }

    pub fn initialize(ctx: Context<Initialize>, subordination_ratio_bps: u16) -> Result<()> {
        instructions::initialize::initialize(ctx, subordination_ratio_bps)
    }

    pub fn split_deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::split_deposit(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw::withdraw(ctx, amount)
    }

    pub fn update_admins(ctx: Context<UpdateAdmins>, new_yield: Pubkey, new_emergency: Pubkey) -> Result<()> {
        instructions::admin::update_admins(ctx, new_yield, new_emergency)
    }

    pub fn trigger_kill_switch(ctx: Context<TriggerKillSwitch>) -> Result<()> {
        instructions::admin::trigger_kill_switch(ctx)
    }

    pub fn restore_protocol(ctx: Context<RestoreProtocol>) -> Result<()> {
        instructions::admin::restore_protocol(ctx)
    }

    #[cfg(feature = "devnet-simulation")]
    pub fn devnet_yield_simulator(ctx: Context<InjectYield>, total_payment: u64) -> Result<()> {
        instructions::inject_yield::devnet_yield_simulator(ctx, total_payment)
    }

    #[cfg(feature = "devnet-simulation")]
    pub fn close_corrupted_vault(ctx: Context<CloseCorruptedVault>) -> Result<()> {
        instructions::close_corrupted::close_corrupted_vault(ctx)
    }
}