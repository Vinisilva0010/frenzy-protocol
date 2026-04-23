use anchor_lang::prelude::*;
use crate::MASTER_ADMIN;
use crate::errors::FrenzyError;

#[cfg(feature = "devnet-simulation")]
pub fn close_corrupted_vault(ctx: Context<CloseCorruptedVault>) -> Result<()> {
    require!(ctx.accounts.user.key() == MASTER_ADMIN, FrenzyError::UnauthorizedMaster);

    let vault_info = &ctx.accounts.vault_state;
    let user_info = &ctx.accounts.user;

    let (expected_pda, _) = Pubkey::find_program_address(
        &[b"frenzy_state", user_info.key.as_ref()],
        ctx.program_id,
    );
    require_keys_eq!(vault_info.key(), expected_pda, FrenzyError::Unauthorized);

    let lamports = vault_info.lamports();
    **vault_info.try_borrow_mut_lamports()? -= lamports;
    **user_info.try_borrow_mut_lamports()? += lamports;

    let mut data = vault_info.try_borrow_mut_data()?;
    data.fill(0);

    msg!("PDA corrompido fechado. {} lamports devolvidos.", lamports);
    Ok(())
}

#[cfg(feature = "devnet-simulation")]
#[derive(Accounts)]
pub struct CloseCorruptedVault<'info> {
    #[account(mut)]
    /// CHECK: validado via find_program_address acima
    pub user: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK: PDA corrompido — bypassa deserializador intencionalmente
    pub vault_state: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}