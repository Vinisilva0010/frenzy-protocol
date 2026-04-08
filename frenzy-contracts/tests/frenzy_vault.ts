import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FrenzyVault } from "../../target/types/frenzy_vault";
import { expect } from "chai";

describe("frenzy_vault_tests", () => {
  // Configura o cliente para usar o cluster local (solana-test-validator)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FrenzyVault as Program<FrenzyVault>;
  const authority = provider.wallet;

  // Derivando a nossa Program Derived Address (PDA) do Cofre
  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("frenzy_state"), authority.publicKey.toBuffer()],
    program.programId
  );

  it("1. Inicializa o FRENZY Vault com limites de segurança", async () => {
    try {
      await program.methods
        .initialize(1000) // 1000 bps = 10% Max Daily Loss
        .accounts({
          authority: authority.publicKey,
          vaultState: vaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Puxa os dados da conta (O Anchor deserializa o zero_copy automaticamente aqui)
      const vaultData = await program.account.vaultState.fetch(vaultPda);

      expect(vaultData.maxDailyLossBps).to.equal(1000);
      expect(vaultData.killSwitch).to.equal(0);
      expect(vaultData.safetyBalance.toNumber()).to.equal(0);
      expect(vaultData.chaosBalance.toNumber()).to.equal(0);
      
      console.log("✅ Cofre Inicializado. Kill-switch inativo.");
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it("2. Executa um depósito e valida a matemática imutável de 50/50", async () => {
    const depositAmount = new anchor.BN(1000);

    await program.methods
      .splitDeposit(depositAmount)
      .accounts({
        user: authority.publicKey,
        vaultState: vaultPda,
      })
      .rpc();

    const vaultData = await program.account.vaultState.fetch(vaultPda);

    // A prova dos 9: A matemática do contrato funcionou?
    expect(vaultData.safetyBalance.toNumber()).to.equal(500);
    expect(vaultData.chaosBalance.toNumber()).to.equal(500);

    console.log(`✅ Depósito fatiado com sucesso! Segurança: ${vaultData.safetyBalance.toNumber()} | Caos: ${vaultData.chaosBalance.toNumber()}`);
  });

  it("3. Aciona o Kill-Switch (Botão do Pânico)", async () => {
    await program.methods
      .triggerKillSwitch()
      .accounts({
        authority: authority.publicKey,
        vaultState: vaultPda,
      })
      .rpc();

    const vaultData = await program.account.vaultState.fetch(vaultPda);
    expect(vaultData.killSwitch).to.equal(1);

    console.log("✅ Lockdown ativado com sucesso.");
  });
});