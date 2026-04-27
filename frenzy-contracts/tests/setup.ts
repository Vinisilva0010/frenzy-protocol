import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";


// dashboard.tsx
const PROGRAM_ID = new PublicKey("BLafEMNRKAimMcisFEpUg8oZuCKSSNaujdQf7moNpFyx");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");


async function setup() {
  const keyPath = `${process.env.HOME}/.config/solana/id.json`;
  const adminKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(keyPath, "utf-8")))
  );


  const wallet = new anchor.Wallet(adminKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });


  const idl = JSON.parse(
    fs.readFileSync("./target/idl/frenzy_vault.json", "utf-8")
  );
  anchor.setProvider(provider);
const program = new anchor.Program(idl, provider);


  const [protocolConfigPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("protocol_config")],
    PROGRAM_ID
  );


  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("frenzy_state"), adminKeypair.publicKey.toBuffer()],
    PROGRAM_ID
  );


  // ---------------------------------------------------------------
  // STEP 1: Close corrupted PDA from Phase 1 (if exists)
  // ---------------------------------------------------------------
  console.log("\n🔍 Checking corrupted PDA...");
  const vaultInfo = await connection.getAccountInfo(vaultPda);


  if (vaultInfo !== null) {
    console.log(`⚠️  PDA found (${vaultInfo.data.length} bytes). Closing...`);
    try {
      const sig = await (program.methods as any)
        .closeCorruptedVault()
        .accounts({
          user: adminKeypair.publicKey,
          vaultState: vaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();


      await connection.confirmTransaction(sig, "confirmed");
      console.log("✅ Corrupted PDA closed:", sig);
    } catch (e: any) {
      console.log("PDA could not be closed via instruction. Trying direct method...");
      // Fallback: If the program cannot close it, use solana CLI
      console.log(`Run manually: solana account ${vaultPda.toBase58()} --url devnet`);
    }
  } else {
    console.log("✅ No corrupted PDA found.");
  }


  // ---------------------------------------------------------------
  // STEP 2: Check if ProtocolConfig already exists
  // ---------------------------------------------------------------
  console.log("\n🔍 Checking ProtocolConfig...");
  const configInfo = await connection.getAccountInfo(protocolConfigPda);


  if (configInfo === null) {
    console.log("Initializing ProtocolConfig...");
    const sig = await (program.methods as any)
      .initializeProtocol(
        adminKeypair.publicKey,       // yield_admin = master for now
        adminKeypair.publicKey,       // emergency_admin = master for now
        new anchor.BN(10 * 1_000_000_000) // quota: 10 SOL/day
      )
      .accounts({
        admin: adminKeypair.publicKey,
        protocolConfig: protocolConfigPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();


    await connection.confirmTransaction(sig, "confirmed");
    console.log("✅ ProtocolConfig initialized:", sig);
  } else {
    console.log("✅ ProtocolConfig already exists:", protocolConfigPda.toBase58());
  }


  // ---------------------------------------------------------------
  // STEP 3: Initialize Admin Vault (clean Phase 2)
  // ---------------------------------------------------------------
  console.log("\n🔍 Initializing Phase 2 Vault...");
  try {
    const sig = await (program.methods as any)
      .initialize(1000) // 10% junior subordination
      .accounts({
        authority: adminKeypair.publicKey,
        vaultState: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();


    await connection.confirmTransaction(sig, "confirmed");
    console.log("✅ Phase 2 Vault initialized:", sig);
  } catch (e: any) {
    if (e.message?.includes("already in use")) {
      console.log("✅ Vault already initialized in Phase 2.");
    } else {
      throw e;
    }
  }


  console.log("\n🎯 Setup complete!");
  console.log(`   Program:        ${PROGRAM_ID.toBase58()}`);
  console.log(`   ProtocolConfig: ${protocolConfigPda.toBase58()}`);
  console.log(`   VaultPDA:       ${vaultPda.toBase58()}`);
}


setup().catch(console.error);