// overriding @types/node's process.env for auto-completion
// 1. check if @types/node is installed
// 2. create .d.ts and override ProcessEnv
// 3. include the .d.ts file in tsconfig's include prop
// 4. enjoy auto-completion
declare namespace NodeJS {
  export interface ProcessEnv {
    WALLET_CONNECT_CLOUD: string;
    WALLET_CONNECT_SETTING: string;

    ALCHEMY_KEY_SEPOLIA: string;
    ALCHEMY_HTTPS_SEPOLIA: string;
    ALCHEMY_WSS_SEPOLIA: string;

    ALCHEMY_KEY_MUMBAI: string;
    ALCHEMY_HTTPS_MUMBAI: string;
    ALCHEMY_WSS_MUMBAI: string;

    ACCOUNT_ADDRESS: string;
    ACCOUNT_ENS: string;
    ACCOUNT_PRIVATE_KEY: string;
    ACCOUNT_HELPER_ADDRESS: string;
    ACCOUNT_HELPER_PRIVATE_KEY: string;

    API_ETHERSCAN_KEY: string;
    API_POLYGONSCAN_KEY: string;
    API_COINMARKETCAP: string;
  }
}
