import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { HARDHAT_CONFIG_HELPER } from "./scripts/constants";

// core plugins
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "tsconfig-paths/register";

// community plugins
import "hardhat-contract-sizer";
import "hardhat-log-remover";
import "solidity-docgen";

dotenv.config({ path: "./.dev.env" });

const {
  ALCHEMY_HTTPS_SEPOLIA,
  ALCHEMY_HTTPS_MUMBAI,
  ALCHEMY_HTTPS_OPTIMISM,

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
      { version: "0.6.6" }, 
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
    optimisticEthereum: {
      url: ALCHEMY_HTTPS_OPTIMISM !== undefined ? ALCHEMY_HTTPS_OPTIMISM : "",
      accounts: ACCOUNT_PRIVATE_KEY !== undefined ? [ACCOUNT_PRIVATE_KEY] : [],
    },
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
    outDir: "assets/types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false, // defaults to false
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
