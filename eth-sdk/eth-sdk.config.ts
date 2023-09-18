import { defineConfig } from "@dethcrypto/eth-sdk";

console.log("eth-sdk config loaded");

// ! works with ethers-v5, throwing type error for version 6
export default defineConfig({
  contracts: {
    polygonMumbai: {
      tokens: {
        mtk: "0x76cf5CD42DaaDe18686b5705df50278caE893cf0",
      },
    },
  },
  rpc: {
    // mainnet: mainnetRpc,
    polygonMumbai: "https://polygon-mumbai.g.alchemy.com/v2/k34nFn80BO-wKieB9E_NwGB2rs9LRSC6",
  },
});
