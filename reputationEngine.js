// reputationEngine.js
const { ethers } = require("ethers");
require("dotenv").config({ path: '../.env' }); // Ensure the .env path is correct

// --- Contract & Celo Network Configuration ---

// Environment Variables
const SBT_REWARD_ADDRESS = process.env.SBT_REWARD_ADDRESS;
const CELO_RPC_URL = process.env.ALFAJORES_URL; 
const ENGINE_PRIVATE_KEY = process.env.ENGINE_PRIVATE_KEY; // Dedicated Key for the Engine
const CUSD_ADDRESS = "0x87406850d53c7c25c345b583f7331899e46a7822"; // cUSD Alfajores Testnet Address

// Minimal ABI for ERC20 (cUSD)
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
];

// Minimal ABI for SBTReward.sol (must match your contract interface)
const SBT_REWARD_ABI = [
    "function mintSBT(address _to, uint256 _tierId) external",
    "function getHighestSBTLevel(address _user) view returns (uint256)"
];

// --- Main Reputation Engine Function ---

async function runReputationEngine() {
    console.log("--- Celo Reputational Engine Started ---");

    // 1. Setup Provider & Signer
    const provider = new ethers.JsonRpcProvider(CELO_RPC_URL);
    // The Signer is the account authorized to send mint transactions (must be the contract's Owner)
    const signer = new ethers.Wallet(ENGINE_PRIVATE_KEY, provider); 
    console.log(`Engine Account: ${signer.address}`);

    // 2. Setup Contract Instances
    const sbtRewardContract = new ethers.Contract(SBT_REWARD_ADDRESS, SBT_REWARD_ABI, signer);
    const cUSDContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, provider);

    // List of addresses to audit (In a real system, this would come from a database/API)
    const addressesToAudit = [
        "0x...CeloUserAddress1...", 
        "0x...CeloUserAddress2..."
    ];
    
    // Reputation Criteria
    const MIN_CUSD_BALANCE_FOR_TIER1 = ethers.parseUnits("10", 18); // Minimum 10 cUSD balance
    const TIER_1_ID = 1;

    for (const userAddress of addressesToAudit) {
        try {
            console.log(`\nAuditing user: ${userAddress}`);

            // Check cUSD Balance
            const cUSDBalance = await cUSDContract.balanceOf(userAddress);
            console.log(`cUSD Balance: ${ethers.formatUnits(cUSDBalance, 18)}`);

            // Check current SBT Level
            const currentSBTLevel = await sbtRewardContract.getHighestSBTLevel(userAddress);
            console.log(`Current SBT Level: ${currentSBTLevel}`);

            // Logic to award SBT Tier 1
            if (cUSDBalance >= MIN_CUSD_BALANCE_FOR_TIER1 && currentSBTLevel < TIER_1_ID) {
                console.log(`Criteria met! Minting SBT Tier ${TIER_1_ID} for ${userAddress}`);
                
                // Send the SBT minting transaction
                const tx = await sbtRewardContract.mintSBT(userAddress, TIER_1_ID);
                await tx.wait();
                console.log(`SBT Minted successfully. Transaction hash: ${tx.hash}`);

            } else if (currentSBTLevel >= TIER_1_ID) {
                console.log("SBT Tier 1 already owned. Skipping.");
            } else {
                console.log("Criteria not met.");
            }

        } catch (error) {
            console.error(`Error processing ${userAddress}:`, error.message);
        }
    }

    console.log("--- Engine Audit Complete ---");
}

runReputationEngine().catch(console.error);
