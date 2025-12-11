# CeloReputationDAO-Layer

## Introduction

**CeloReputationDAO-Layer** is a foundational smart contract system designed for the Celo ecosystem to introduce a fairer, mobile-verified, and reputation-weighted governance model. Instead of relying solely on the "one token, one vote" principle, this layer integrates non-transferable **Soul-Bound Tokens (SBTs)** to assign dynamic voting power based on a user's verified identity, activity, and contribution history within the Celo network.

The project leverages Celo's mobile-first architecture and stable assets (cUSD/cEUR) to ensure broad accessibility and real-world applicability for decentralized decision-making.

## Core Mechanics

The system's integrity is built around three core components:

### 1. SBT Integration via SBTReward.sol

Users are rewarded with different tiers of SBTs, which are permanently linked to their Celo address. These tokens signify reputation, completion of tasks (e.g., successful micro-loan repayment, KYC verification), or active participation in the ecosystem.

* **Your Deployed Contract (Example):** `SBTReward.sol` at address **0x5ba23E827e684F8171983461f1D0FC3b41bECbC3** handles the minting and verification of these SBTs.

### 2. Reputation-Weighted Voting

The core voting contract (extending your existing `VoteManager.sol`) overrides standard token-based voting logic. A user's total voting power ($V_p$) is calculated using a dynamic formula that multiplies their staked tokens ($T_s$) by a reputation multiplier ($R_m$) derived from their highest-tier SBT.

$$\text{Voting Power} (V_p) = \text{Staked Tokens} (T_s) \times (1 + \text{Reputation Multiplier} (R_m))$$

* **Your Deployed Contract (Example):** `VoteManager.sol` at address **0xa1D5aC2C86A4215Bfb64738cd5655fEf8A21Bce8** will contain the updated logic to query the `SBTReward.sol` contract before calculating the final vote weight.

### 3. Celo Mobile Identity Focus

The front-end application (using WalletConnect) is designed to prioritize mobile verification, aligning with Celo's mission. By connecting through a mobile wallet, users inherently prove a higher level of real-world identity association, which can be the initial trigger for minting a base-level SBT.

* **WalletConnect Configuration (Example):** Project ID **a5f9260bc9bca570190d3b01f477fc45** is used for secure mobile authentication and transaction signing.

## Key Features

* **SBT-Gated Proposals:** Option to restrict voting rights to users who hold a specific SBT, ensuring only verified or contributing members can participate in critical governance.
* **Decentralized Reputation:** Reputation is earned through actions, not purchased through tokens, promoting healthy long-term ecosystem participation.
* **Mobile-Optimized:** Designed from the ground up to integrate seamlessly with Celo's mobile wallets and stablecoin payments (cUSD/cEUR) for gas and staking.
* **Modular Design:** Can be integrated as a governance module for any DeFi, DAO, or social impact DApp deployed on the Celo network.

## Contracts & Deployment

All contracts are deployed on the Celo Mainnet (or Alfajores Testnet) and written in Solidity.

| Contract | Address (Example) | Description |
| :--- | :--- | :--- |
| `SBTReward.sol` | `0x5ba23E827e684F8171983461f1D0FC3b41bECbC3` | Manages the minting and assignment of Soul-Bound Tokens. |
| `VoteManager.sol` | `0xa1D5aC2C86A4215Bfb64738cd5655fEf8A21Bce8` | Contains the core reputation-weighted voting logic. |
| `ReputationOracle.sol` | (To be deployed) | An optional contract to fetch real-world verification data (e.g., from a decentralized identity provider) before awarding high-tier SBTs.
