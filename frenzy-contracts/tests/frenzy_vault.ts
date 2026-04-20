import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FrenzyVault } from "../target/types/frenzy_vault";
import { assert } from "chai";

describe("FRENZY Protocol - RBAC Security Audit Suite", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.FrenzyVault as Program<FrenzyVault>;

  // As 3 chaves do nosso novo Sistema Institucional
  const masterAdmin = (provider.wallet as anchor.Wallet).payer; 
  const yieldAdmin = anchor.web3.Keypair.generate();
  const emergencyAdmin = anchor.web3.Keypair.generate();
  
  const hacker = anchor.web3.Keypair.generate(); 
  const user = anchor.web3.Keypair.generate(); 

  let userVaultPda: anchor.web3.PublicKey;
  let protocolConfigPda: anchor.web3.PublicKey;

  before(async () => {
    // Airdrop para os bots e para o hacker poderem pagar as taxas de teste
    const sig1 = await provider.connection.requestAirdrop(user.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    const sig2 = await provider.connection.requestAirdrop(hacker.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    const sig3 = await provider.connection.requestAirdrop(yieldAdmin.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    const sig4 = await provider.connection.requestAirdrop(emergencyAdmin.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    
    await provider.connection.confirmTransaction(sig1);
    await provider.connection.confirmTransaction(sig2);
    await provider.connection.confirmTransaction(sig3);
    await provider.connection.confirmTransaction(sig4);

    [userVaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("frenzy_state"), user.publicKey.toBuffer()],
      program.programId
    );

    [protocolConfigPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("protocol_config")],
      program.programId
    );
  });

  it(" [RBAC] Master Admin initializes the Global Protocol Config", async () => {
    await program.methods.initializeProtocol(yieldAdmin.publicKey, emergencyAdmin.publicKey)
      .accounts({
        admin: masterAdmin.publicKey,
      }).rpc(); // Assinado automaticamente pelo provider.wallet

    const config = await program.account.protocolConfig.fetch(protocolConfigPda);
    assert.ok(config.masterAdmin.equals(masterAdmin.publicKey));
    assert.ok(config.yieldAdmin.equals(yieldAdmin.publicKey));
    assert.ok(config.emergencyAdmin.equals(emergencyAdmin.publicKey));
  });

  it("Successfully initializes user vault and processes deposit", async () => {
    await program.methods.initialize(1000).accounts({
      authority: user.publicKey,
    }).signers([user]).rpc();

    const depositAmount = new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL);
    await program.methods.splitDeposit(depositAmount).accounts({
      user: user.publicKey,
      vaultState: userVaultPda,
    }).signers([user]).rpc();
  });

  it(" [RBAC] Rejects yield injection from Hacker", async () => {
    try {
      const fakeYield = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
      await program.methods.injectMockYield(fakeYield, fakeYield).accounts({
        admin: hacker.publicKey, 
        vaultState: userVaultPda,
      }).signers([hacker]).rpc();

      assert.fail("Hacker bypassed RBAC!");
    } catch (err: any) {
      assert.include(err.message, "UnauthorizedYieldAdmin", "RBAC Yield Shield failed.");
    }
  });

  it(" [RBAC] Authorized Yield Admin successfully injects profit", async () => {
    const safeYield = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
    await program.methods.injectMockYield(safeYield, safeYield).accounts({
      admin: yieldAdmin.publicKey,
      vaultState: userVaultPda,
    }).signers([yieldAdmin]).rpc();

    const vaultData = await program.account.vaultState.fetch(userVaultPda);
    assert.ok(vaultData.safetyBalance.eq(new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL)));
  });

  it(" [RBAC] Rejects Kill-Switch trigger from Yield Admin (Separation of Powers)", async () => {
    try {
      // O Bot de Yield não pode acionar o pânico. Apenas o de Emergência.
      await program.methods.triggerKillSwitch().accounts({
        admin: yieldAdmin.publicKey,
        vaultState: userVaultPda,
      }).signers([yieldAdmin]).rpc();

      assert.fail("Yield Admin triggered Kill-Switch!");
    } catch (err: any) {
      assert.include(err.message, "UnauthorizedEmergencyAdmin", "Separation of Powers failed.");
    }
  });

  it(" [RBAC] Emergency Admin successfully triggers protocol lockdown", async () => {
    await program.methods.triggerKillSwitch().accounts({
      admin: emergencyAdmin.publicKey,
      vaultState: userVaultPda,
    }).signers([emergencyAdmin]).rpc();

    const vaultData = await program.account.vaultState.fetch(userVaultPda);
    assert.equal(vaultData.killSwitch, 1);
  });

it("[ANTI-BANK RUN] Processes initial withdrawal successfully", async () => {
    const withdrawAmount = new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL);
    
    // Modern Anchor resolves the vaultState PDA automatically
    await program.methods.withdraw(withdrawAmount).accounts({
      user: user.publicKey,
    }).signers([user]).rpc();

    const vaultData = await program.account.vaultState.fetch(userVaultPda);
    assert.ok(vaultData.lastWithdrawalTimestamp.toNumber() > 0, "Timestamp was not registered!");
  });

  it("[ANTI-BANK RUN] Blocks consecutive withdrawal during cooldown period", async () => {
    try {
      const withdrawAmount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);
      
      await program.methods.withdraw(withdrawAmount).accounts({
        user: user.publicKey,
      }).signers([user]).rpc();

      assert.fail("Critical Vulnerability: User bypassed the Cooldown constraint!");
    } catch (err: any) {
      assert.include(err.message, "WithdrawalCooldownActive", "Anti-Bank Run lock failed.");
    }
  });

});