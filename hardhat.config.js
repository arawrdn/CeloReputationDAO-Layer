require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALFAJORES_URL = process.env.ALFAJORES_URL;
const MNEMONIC = process.env.MNEMONIC; // Atau gunakan PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    alfajores: {
      url: ALFAJORES_URL || "https://alfajores-forno.celo-testnet.org",
      accounts: {
        mnemonic: MNEMONIC, // Gunakan mnemonic atau private key
        path: "m/44'/60'/0'/0/0", // Path standar Celo
        initialIndex: 0,
        count: 10,
      },
      chainId: 44787,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0/0",
      },
      chainId: 42220,
    }
  },
  // Konfigurasi lain seperti Etherscan verification
};
