import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FrenzyVault } from "../target/types/frenzy_vault";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.FrenzyVault as Program<FrenzyVault>;

  
  const phantomWallet = new anchor.web3.PublicKey("7aSDp11gPbCCew7yMSQKuBLr6pcKfgwRPtp2QgAE89f3");

  console.log(" Autenticando com o Master Terminal...");
  console.log(" Transferindo poderes de Yield Admin para a Phantom:", phantomWallet.toBase58());
  
  const tx = await program.methods
    .updateAdmins(phantomWallet, phantomWallet) // Passa o Yield Admin e Emergency Admin para você
    .accounts({ 
      admin: provider.wallet.publicKey 
    })
    .rpc();

  console.log(" Passagem de Bastão Concluída! A sua Phantom agora é a dona do FIDC. Assinatura:", tx);
}

main().catch(err => console.error(err));