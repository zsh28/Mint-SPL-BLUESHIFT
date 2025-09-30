import {
  Keypair,
  Connection,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import {
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createMintToCheckedInstruction,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import bs58 from "bs58";

declare const process: { env: { SECRET?: string; RPC_ENDPOINT?: string } };

// ⚠️ INSECURE KEY. DO NOT USE OUTSIDE OF THIS CHALLENGE
const feePayer = Keypair.fromSecretKey(bs58.decode(process.env.SECRET!));

const connection = new Connection(process.env.RPC_ENDPOINT!, "confirmed");

async function main() {
  try {
    // 1) Create the mint account keypair
    const mint = Keypair.generate();

    // 2) Rent for the mint account
    const mintRent = await getMinimumBalanceForRentExemptMint(connection);

    // --- START HERE ---

    // Create the mint account
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: mintRent,
      space: MINT_SIZE,
      programId: TOKEN_PROGRAM_ID,
    });

    // Initialize the mint (6 decimals, feePayer is both mint + freeze authority)
    const initializeMintIx = createInitializeMint2Instruction(
      mint.publicKey,
      6,
      feePayer.publicKey,
      feePayer.publicKey,
      TOKEN_PROGRAM_ID
    );

    // Create the associated token account for feePayer
    const associatedTokenAccount = getAssociatedTokenAddressSync(
      mint.publicKey,
      feePayer.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createAssociatedTokenAccountIx =
      createAssociatedTokenAccountInstruction(
        feePayer.publicKey, // payer
        associatedTokenAccount, // ATA address
        feePayer.publicKey, // owner of the ATA
        mint.publicKey, // mint
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

    // Mint 21,000,000 tokens (with 6 decimals => amount is 21,000,000 * 10^6)
    const mintAmount = 21_000_000n * 1_000_000n; // 21,000,000,000,000 (as bigint)

    const mintToCheckedIx = createMintToCheckedInstruction(
      mint.publicKey, // mint
      associatedTokenAccount, // destination ATA
      feePayer.publicKey, // mint authority
      mintAmount, // amount in base units
      6 // decimals
    );

    // --- END FILL ---

    const recentBlockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: feePayer.publicKey,
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
    }).add(
      createAccountIx,
      initializeMintIx,
      createAssociatedTokenAccountIx,
      mintToCheckedIx
    );

    // Signers: feePayer (payer + mint authority) and mint (new account being created)
    const txSig = await sendAndConfirmTransaction(connection, transaction, [
      feePayer,
      mint,
    ]);

    console.log("Mint Address:", mint.publicKey.toBase58());
    console.log("Associated Token Account:", associatedTokenAccount.toBase58());
    console.log("Transaction Signature:", txSig);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
}

main().catch(console.error);
