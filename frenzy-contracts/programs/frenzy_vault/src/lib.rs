use anchor_lang::prelude::*;

// ID temporário até rodarmos o primeiro build e pegarmos a pubkey real
declare_id!("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e"); 

#[program]
pub mod frenzy_vault {
    use super::*;

    /// Inicializa o cofre principal da operação
    pub fn initialize(ctx: Context<Initialize>, max_loss_bps: u16) -> Result<()> {
        // Usamos load_init() porque a conta é zero_copy (AccountLoader)
        let mut vault = ctx.accounts.vault_state.load_init()?;
        
        vault.authority = ctx.accounts.authority.key();
        vault.safety_balance = 0;
        vault.chaos_balance = 0;
        vault.max_daily_loss_bps = max_loss_bps; // 1000 = 10%
        vault.kill_switch = 0; // 0 = Operacional, 1 = Lockdown
        
        msg!("FRENZY Protocol: Cofre Inicializado. Preparado para o caos controlado.");
        Ok(())
    }

    /// O usuário deposita USDC. O contrato corta brutalmente em 50/50.
    pub fn split_deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let mut vault = ctx.accounts.vault_state.load_mut()?;
        
        // Disjuntor de Segurança: Se a IA ou o Admin ativou o kill switch, trava tudo.
        require!(vault.kill_switch == 0, FrenzyError::KillSwitchActive);

        // A Matemática Imutável (A nossa narrativa pro Copiloto)
        let safe_allocation = amount / 2;
        let chaos_allocation = amount - safe_allocation;

        vault.safety_balance = vault.safety_balance.checked_add(safe_allocation).unwrap();
        vault.chaos_balance = vault.chaos_balance.checked_add(chaos_allocation).unwrap();

        // NOTA DE ARQUITETURA: Aqui vai entrar a instrução (CPI) de transferência real 
        // de tokens SPL da carteira do usuário para a nossa PDA. Por enquanto, 
        // estamos validando a matemática de estado.

        msg!("FRENZY: Depósito processado. {} para Segurança, {} para Caos.", safe_allocation, chaos_allocation);
        Ok(())
    }

    /// O botão de pânico. Pode ser chamado pelo Backend (PDA) se o mercado derreter.
    pub fn trigger_kill_switch(ctx: Context<TriggerKillSwitch>) -> Result<()> {
        let mut vault = ctx.accounts.vault_state.load_mut()?;
        vault.kill_switch = 1;
        msg!("FRENZY ALERTA CRÍTICO: Kill-Switch Ativado. O fundo está em lockdown de defesa.");
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
    
    // Alocação de memória na unha. 8 bytes de discriminador + tamanho da struct.
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
}

#[derive(Accounts)]
pub struct TriggerKillSwitch<'info> {
    pub authority: Signer<'info>, // Só a nossa PDA autorizada pode acionar
    #[account(mut, has_one = authority)]
    pub vault_state: AccountLoader<'info, VaultState>,
}

// ==========================================
// O ESTADO DO COFRE (ZERO COPY)
// ==========================================

#[account(zero_copy)]
#[repr(C)] // Garante o alinhamento de memória padrão do C (obrigatório para zero_copy)
pub struct VaultState {
    pub authority: Pubkey,
    pub safety_balance: u64,
    pub chaos_balance: u64,
    pub max_daily_loss_bps: u16, 
    pub kill_switch: u8, 
    pub _padding: [u8; 5], // O SEGREDINHO SÊNIOR: Alinhamento de memória para 8 bytes.
}

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

#[error_code]
pub enum FrenzyError {
    #[msg("Acesso Negado: O Kill-Switch foi ativado. Operações suspensas para proteção de patrimônio.")]
    KillSwitchActive,
}