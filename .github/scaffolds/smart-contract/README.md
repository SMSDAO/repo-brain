# smart-contract

A Solidity smart contract scaffold using Hardhat, managed by repo-brain.

## Getting Started

```bash
npm install
npm run compile
npm test
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile Solidity contracts |
| `npm test` | Run Hardhat tests |
| `npm run deploy` | Deploy contracts |
| `npm run lint` | Run linters |
| `npm run typecheck` | Run TypeScript type check |
| `npm run node` | Start local Hardhat node |

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values.

## Structure

```
contracts/     Solidity source files
scripts/       Deployment scripts
test/          Test files
```
