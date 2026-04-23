use anchor_lang::prelude::*;

#[error_code]
pub enum FrenzyError {
    #[msg("Apenas o Master Admin pode executar esta operação.")]
    UnauthorizedMaster,

    #[msg("Apenas o Emergency Admin pode ativar o Kill Switch.")]
    UnauthorizedEmergencyAdmin,

    #[msg("Operação não autorizada para esta conta.")]
    Unauthorized,

    #[msg("Vault não pertence ao usuário conectado.")]
    UnauthorizedAccess,

    #[msg("Kill Switch global ativo. Protocolo em emergência.")]
    KillSwitchActive,

    #[msg("Cooldown de 24h ativo. Aguarde antes de sacar novamente.")]
    WithdrawalCooldownActive,

    #[msg("Cota global de saques atingida. Tente novamente amanhã.")]
    GlobalWithdrawalQuotaExceeded,

    #[msg("Valor inválido. Deve ser maior que zero.")]
    InvalidAmount,

    #[msg("Saldo insuficiente no cofre.")]
    InsufficientFunds,

    #[msg("Subordination ratio acima do teto (5000 bps = 50%).")]
    InvalidRatio,

    #[msg("Subordination ratio abaixo do piso mínimo (500 bps = 5%).")]
    RatioTooLow,

    #[msg("Overflow matemático detectado. Operação abortada.")]
    MathOverflow,

    #[msg("Invariante quebrada: TVL inconsistente pós-operação.")]
    InvariantViolation,

    #[msg("Modo de simulação desabilitado em Mainnet.")]
    SimulationDisabled,
}