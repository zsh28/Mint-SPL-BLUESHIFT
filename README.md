# SPL Token Mint - Blueshift

A TypeScript application for minting SPL tokens on the Solana blockchain. This project demonstrates how to create a new SPL token mint and mint tokens to an associated token account.

## Features

- 🪙 Create new SPL token mints
- 🏦 Initialize mint with custom decimals (6 decimals)
- 💰 Mint 21 million tokens to associated token account
- 🔐 Support for custom mint and freeze authorities
- 🌐 Configurable Solana RPC endpoint

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Solana wallet with some SOL for transaction fees

## Installation

1. Clone the repository:
```bash
git clone https://github.com/zsh28/Mint-SPL-BLUESHIFT.git
cd spl-mint-blueshift
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
RPC_ENDPOINT=https://api.devnet.solana.com
SECRET=your_wallet_secret_key_in_base58
```

## Usage

Run the token minting script:

```bash
npx ts-node main.ts
```

The script will:
1. Create a new mint account
2. Initialize the mint with 6 decimals
3. Create an associated token account for the fee payer
4. Mint 21,000,000 tokens to the associated token account

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RPC_ENDPOINT` | Solana RPC endpoint URL | `https://api.devnet.solana.com` |
| `SECRET` | Wallet secret key in base58 format | Your wallet's secret key |

## Output

Upon successful execution, the script outputs:
- **Mint Address**: The public key of the newly created token mint
- **Associated Token Account**: The address of the token account holding the minted tokens
- **Transaction Signature**: The signature of the successful transaction

## Built With

- [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) - Solana JavaScript SDK
- [@solana/spl-token](https://github.com/solana-labs/solana-program-library) - SPL Token JavaScript bindings
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [bs58](https://github.com/cryptocoinjs/bs58) - Base58 encoding/decoding