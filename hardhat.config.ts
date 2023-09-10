import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-contract-sizer";
import "hardhat-log-remover";
import "solidity-docgen";
import "@nomiclabs/hardhat-solhint";
import { HARDHAT_CONFIG_HELPER } from "./scripts/constants";
import "hardhat-gas-reporter";

dotenv.config({ path: "./.dev.env" });

/**
 *
 * "@nomicfoundation/hardhat-toolbox" dependency includes below deps.
 * - @nomiclabs/hardhat-ethers
 * - @nomiclabs/hardhat-etherscan
 * - hardhat-gas-reporter
 * - solidity-coverage
 * - @typechain/hardhat
 *
 */
const {
  ALCHEMY_HTTPS_SEPOLIA,
  ALCHEMY_HTTPS_MUMBAI,

  ALCHEMY_KEY_GOERLI,
  ALCHEMY_HTTPS_GOERLI,

  ACCOUNT_PRIVATE_KEY,
  ACCOUNT_HELPER_PRIVATE_KEY,

  API_ETHERSCAN_KEY,
  API_POLYGONSCAN_KEY,
  API_COINMARKETCAP,
} = process.env;

const options = {
  settings: {
    optimizer: {
      enabled: HARDHAT_CONFIG_HELPER.compiler.enable,
      runs: HARDHAT_CONFIG_HELPER.compiler.fee.lowDeployment,
    },
    // enable smock plugin mocking
    outputSelection: {
      "*": {
        "*": ["storageLayout"],
      },
    },
  },
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    // set multiple compiler version
    // prettier-ignore
    compilers: [
      { version: "0.8.0" }, 
      { version: "0.8.19" }
    ].map((ver) => {
      return {
        ...ver,
        ...options,
      };
    }),
  },
  networks: {
    goerli: {
      url: ALCHEMY_HTTPS_GOERLI !== undefined ? ALCHEMY_HTTPS_GOERLI : "",
      accounts: ACCOUNT_PRIVATE_KEY !== undefined ? [ACCOUNT_PRIVATE_KEY] : [],
    },
    sepolia: {
      url: ALCHEMY_HTTPS_SEPOLIA !== undefined ? ALCHEMY_HTTPS_SEPOLIA : "",
      accounts: ACCOUNT_PRIVATE_KEY !== undefined ? [ACCOUNT_PRIVATE_KEY] : [],
    },
    polygonMumbai: {
      url: ALCHEMY_HTTPS_MUMBAI !== undefined ? ALCHEMY_HTTPS_MUMBAI : "",
      accounts:
        ACCOUNT_PRIVATE_KEY !== undefined
          ? [ACCOUNT_PRIVATE_KEY, ACCOUNT_HELPER_PRIVATE_KEY]
          : [],
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  etherscan: {
    apiKey: {
      sepolia: API_ETHERSCAN_KEY !== undefined ? API_ETHERSCAN_KEY : "",
      polygonMumbai:
        API_POLYGONSCAN_KEY !== undefined ? API_POLYGONSCAN_KEY : "",
    },
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v5",
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    strict: true,
  },
  docgen: {
    pages: "single",
    pageExtension: ".md",
    outputDir: "./docs",
    exclude: [],
  },
  gasReporter: {
    enabled: HARDHAT_CONFIG_HELPER.reportGas,
    currency: "USD",
    token: "MATIC",
    coinmarketcap: API_COINMARKETCAP !== undefined ? API_COINMARKETCAP : "",
  },
};

export default config;
