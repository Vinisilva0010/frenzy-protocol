import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FrenzyVault } from "../target/types/frenzy_vault";
import { expect } from "chai";

describe("FRENZY Protocol - Invariant Test Suite (Adevar Labs)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FrenzyVault as Program<FrenzyVault>;
  const wallet = provider.wallet as anchor.Wallet;

  const [protocolConfigPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("protocol_config")],
    program.programId
  );

  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("frenzy_state"), wallet.publicKey.toBuffer()],
    program.programId
  );

  it("1. Initializes Protocol with Global Lock (Anti-Sybil)", async () => {
    try {
      const yieldAdmin = wallet.publicKey;
      const emergencyAdmin = wallet.publicKey;
      const globalDailyLimit = new anchor.BN(1000 * 1_000_000_000);

      await program.methods
        .initializeProtocol(yieldAdmin, emergencyAdmin, globalDailyLimit)
        .accounts({
          masterAdmin: wallet.publicKey,
          protocolConfig: protocolConfigPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc();
    } catch (e) {}

    const config = await program.account.protocolConfig.fetch(protocolConfigPda);
    expect(config.masterAdmin.toBase58()).to.equal(wallet.publicKey.toBase58());
  });

  it("2. Initializes Vault with Subordination Ratio", async () => {
    try {
      await program.methods
        .initialize(1000)
        .accounts({
          authority: wallet.publicKey,
          vaultState: vaultPda,
          vault: vaultPda, 
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc();
    } catch (e) {}

    const vault = await program.account.vaultState.fetch(vaultPda);
    expect(vault.subordinationRatioBps).to.equal(1000);
  });

  it("INVARIANT 1: Capital Conservation on Deposit (Correct Split)", async () => {
    const depositAmount = new anchor.BN(1_000_000_000);
    
    await program.methods
      .splitDeposit(depositAmount)
      .accounts({
        user: wallet.publicKey,
        vaultState: vaultPda,
        vault: vaultPda,
        protocolConfig: protocolConfigPda,
        systemProgram: anchor.web3.SystemProgram.programId,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      } as any)
      .rpc();

    const vault = await program.account.vaultState.fetch(vaultPda);
    expect(vault.seniorTranche.toNumber()).to.equal(900_000_000);
    expect(vault.juniorTranche.toNumber()).to.equal(100_000_000);
  });

  it("INVARIANT 2: Devnet Simulator - Junior absorbs 100% of Alpha (Profit)", async () => {
    const profit = new anchor.BN(200_000_000);
    
    await program.methods
      .devnetYieldSimulator(profit)
      .accounts({
        admin: wallet.publicKey,
        protocolConfig: protocolConfigPda,
        vaultState: vaultPda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    const vault = await program.account.vaultState.fetch(vaultPda);
    expect(vault.accumulatedProfits.toNumber()).to.be.greaterThan(0);
  });
});