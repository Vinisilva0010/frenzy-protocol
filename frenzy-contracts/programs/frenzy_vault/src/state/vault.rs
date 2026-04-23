use anchor_lang::prelude::*;

// Kill switch agora é GLOBAL aqui, não por vault individual
#[account]
#[derive(Default)]
pub struct ProtocolConfig {
    pub master_admin: Pubkey,
    pub yield_admin: Pubkey,
    pub emergency_admin: Pubkey,
    pub global_withdrawal_quota_24h: u64,
    pub global_withdrawn_last_24h: u64,
    pub global_quota_reset_ts: i64,
    pub simulation_mode: bool,
    pub kill_switch: bool,
}

impl ProtocolConfig {
    pub const LEN: usize = 8   // discriminator
        + 32 + 32 + 32         // 3x Pubkey
        + 8 + 8 + 8            // 2x u64 + i64
        + 1 + 1;               // simulation_mode + kill_switch
    // TOTAL = 130 bytes
}

// SEM zero_copy — Borsh normal, sem bytemuck, sem dor de cabeça
#[account]
#[derive(Default)]
pub struct VaultState {
    pub authority: Pubkey,
    pub senior_tranche: u64,
    pub junior_tranche: u64,
    pub subordination_ratio_bps: u16,
    pub last_withdrawal_timestamp: i64,
    pub accumulated_losses: u64,
    pub accumulated_profits: u64,
}

impl VaultState {
    pub const LEN: usize = 8   // discriminator
        + 32                   // authority
        + 8 + 8                // senior + junior
        + 2                    // subordination_ratio_bps
        + 8                    // last_withdrawal_timestamp
        + 8 + 8;               // losses + profits
    // TOTAL = 82 bytes

    pub fn total_tvl(&self) -> u64 {
        self.senior_tranche.saturating_add(self.junior_tranche)
    }

    // Calcula quanto o sênior deve receber de um pagamento
    // senior_target = total - (total * ratio / 10000)
    pub fn compute_senior_target(&self, total_payment: u64) -> u64 {
        let junior_floor = (total_payment as u128)
            .saturating_mul(self.subordination_ratio_bps as u128)
            .checked_div(10_000)
            .unwrap_or(0) as u64;
        total_payment.saturating_sub(junior_floor)
    }
}