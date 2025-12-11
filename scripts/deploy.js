const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Alamat kontrak yang sudah ada (dari .env)
  const sbtRewardAddress = process.env.SBT_REWARD_ADDRESS;
  const governanceTokenAddress = process.env.GOVERNANCE_TOKEN_ADDRESS;

  if (!sbtRewardAddress || !governanceTokenAddress) {
    console.error("Missing contract addresses in .env file.");
    return;
  }
  
  // Mengambil Kontrak VoteManager
  const VoteManager = await hre.ethers.getContractFactory("VoteManager");
  
  // Deploy kontrak VoteManager, memberikan alamat SBT dan token tata kelola
  const voteManager = await VoteManager.deploy(sbtRewardAddress, governanceTokenAddress);
  
  await voteManager.waitForDeployment();

  console.log("VoteManager deployed to:", voteManager.target);

  // Jika Anda ingin memverifikasi kontrak di CeloScan/Etherscan:
  /*
  console.log("Verifying contract...");
  await hre.run("verify:verify", {
    address: voteManager.target,
    constructorArguments: [sbtRewardAddress, governanceTokenAddress],
  });
  */
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
