/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("hardhat-etherscan-abi")

const {ETHERSCAN_API, MAIN_API_URL, API_URL, METAMASK_PRIVATE_KEY, COIN_API} = process.env;
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    rinkeby: {
      url: API_URL,
      accounts: [`0x${METAMASK_PRIVATE_KEY}`]
    },
    mainnet: {
      url: MAIN_API_URL,
      accounts: [`0x${METAMASK_PRIVATE_KEY}`]
    }
  },
  etherscan: 
  {
    apiKey: ETHERSCAN_API
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  gasReporter: {
    coinmarketcap: COIN_API,
    currency: "USD"
  }
};
