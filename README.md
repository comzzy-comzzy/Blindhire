# BlindHire — Confidential Freelance Marketplace

BlindHire is a confidential freelance marketplace built on Ethereum using Zama's Fully Homomorphic Encryption (FHE). Clients post jobs with encrypted budgets, and freelancers submit sealed bids — nobody sees the numbers, not even validators.

## Live Demo

**Frontend:** https://blindhire.rugpullchecker.me

**Smart Contract (Sepolia):** `0x6F107c596f7CF883863bb112C347D41b26eCE9C6`

**Etherscan:** https://sepolia.etherscan.io/address/0x6F107c596f7CF883863bb112C347D41b26eCE9C6

## The Problem

On public blockchains, everything is visible. This creates a structural problem for freelance marketplaces:
- Clients reveal their budget, inviting inflated bids
- Freelancers see competing bids and adjust accordingly
- The result is a broken market where price discovery is manipulated

## The Solution: FHE-Powered Confidential Bidding

BlindHire uses Zama's FHEVM to encrypt sensitive data at the protocol level:
- Client budgets are encrypted using `euint64` FHE types
- Freelancer bids are sealed before hitting the chain
- Only authorized parties can decrypt their own data
- Smart contract logic runs on encrypted values without revealing them

## Features

- Post jobs with FHE-encrypted budgets
- Submit sealed bids with encrypted amounts
- Client dashboard to view bidders and select winner
- On-chain escrow and job lifecycle management (Open → Awarded → Completed)
- Dark mode, animations, responsive design
- RainbowKit wallet connection

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity + FHEVM (`@fhevm/solidity`) |
| FHE SDK | `@zama-fhe/react-sdk` + `@zama-fhe/relayer-sdk` |
| Frontend | Vite + React + TypeScript |
| Wallet | RainbowKit + wagmi v3 + viem |
| Styling | Tailwind CSS |
| Network | Ethereum Sepolia Testnet |
| Deployment | VPS + Nginx + PM2 |

## How It Works

### For Clients
1. Connect wallet and post a job with an encrypted budget
2. The budget is encrypted using Zama FHE before being stored on-chain
3. Receive sealed bids from freelancers
4. View bidders on dashboard and select a winner
5. Mark job complete

### For Freelancers
1. Browse confidential job listings
2. Submit an encrypted bid — nobody sees your amount
3. Get selected and receive payment

## Smart Contract

The `BlindHire.sol` contract inherits from `ZamaEthereumConfig` and uses:
- `euint64` for encrypted budget and bid amounts
- `FHE.fromExternal()` for validating encrypted inputs
- `FHE.allowThis()` and `FHE.allow()` for ACL-based access control
- Events for job lifecycle tracking

## Project Structure
blindhire/
├── contracts/          # Hardhat + Solidity smart contracts
│   └── contracts/
│       └── BlindHire.sol
├── app/                # Vite + React frontend
│   ├── src/
│   │   ├── pages/      # Home, Jobs, PostJob, Dashboard, MyBids
│   │   ├── components/ # Navbar, Footer, JobCard
│   │   └── lib/        # Contract ABI, FHE helpers
│   └── public/         # WASM files for FHE
└── README.md
## Local Setup

```bash
# Clone
git clone https://github.com/comzzy-comzzy/Blindhire.git
cd Blindhire

# Contracts
cd contracts
npm install
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set ETHERSCAN_API_KEY
npx hardhat deploy --network sepolia --tags BlindHire

# Frontend
cd ../app
npm install
npm run dev

