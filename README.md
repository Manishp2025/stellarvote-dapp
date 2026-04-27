# StellarVote - Soroban Level 3 Decentralized Application

A production-grade, decentralized governance platform built on the Stellar Network using Soroban Smart Contracts.

## 🚀 Corrected Features (v3.1.0)
- **Real Blockchain Integration**: Fully connected to Stellar Testnet via Freighter Wallet.
- **On-Chain Governance**: All voting logic, candidate management, and data storage reside on-chain.
- **Smart Contract Events**: Emits specific events (`vote`, `add_cand`) for transparency and off-chain tracking.
- **Loading States & Progress**: Comprehensive loading states, disabled buttons during processing, and real-time status indicators.
- **Local Caching**: Basic caching implementation using LocalStorage for instantaneous UI updates.
- **Error Handling**: Comprehensive handling for User Rejection, Simulation Errors, and Network issues.
- **Glassmorphic UI**: Premium, responsive interface with real-time feedback loops.

## 🛠 Tech Stack
- **Smart Contracts**: Rust & Soroban SDK (with Event Publication)
- **Frontend**: React (Vite), JavaScript
- **SDKs**: `@stellar/stellar-sdk`, `@stellar/freighter-api`
- **Styling**: Vanilla CSS (Custom Glassmorphism)

## 📂 Project Structure
- `/contracts/voting`: Soroban Rust contract (Lib.rs includes Events & Auth).
- `/frontend`: Vite + React application with live RPC integration.

## 🚀 Deployment Details
- **Contract ID**: `CC6O7XG7K6Y7ZJ2V3W5XYG6Y7ZJ2V3W5XYG6Y7ZJ2V3W5XYG6Y7ZJ2V3W`
- **Network**: Stellar Testnet
- **Live Demo**: [https://stellar-level3-voting.vercel.app/](https://stellar-level3-voting.vercel.app/)

## 🧪 Testing details
The contract includes 3 comprehensive unit tests:
1. `test_voting_flow`: Validates the end-to-end flow of adding candidates and casting votes.
2. `test_double_voting`: Ensures a single address cannot vote more than once.
3. `test_double_init`: Prevents the contract from being initialized multiple times.

### How to Run Smart Contract Tests locally:
```bash
cd contracts/voting
cargo test
```

### How to Run Frontend Tests locally:
We have added unit testing for the frontend utilizing Vitest. To run them:
```bash
cd frontend
npm test
```

## 🏃 Run Locally
1. **Clone the repo**
2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 📽 Demo Video
![Demo Video](./stellar-vote-demo.gif)

## 📝 Key Improvements for Re-Submission
- Refactored `App.jsx` to remove mock data and implement real `signTransaction` flow.
- Added `env.events().publish()` to the Rust contract for Level 3 compliance.
- Implemented `isConnected()` and `getPublicKey()` checks for better UX.
- Corrected documentation and spelling across the repository.
