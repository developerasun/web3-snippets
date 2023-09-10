export const ASUNLABS_WALLET = {
  ens: "developerasun.eth",
} as const;

export enum PROMISE_STATE {
  PENDING,
  FULFILLED,
  REJECTED,
}

export const INTERFACE_ID = {
  erc20: "0x36372b07",
  erc165: "0x01ffc9a7",
  erc721: "0x80ac58cd",
  erc777: "0xe58e113c",
  erc1155: "0xd9b67a26",
};

export const WHALE_ACCOUNTS = {
  ethereum: {
    mainnet: {
      ERC20: {
        DAI: "0x1B7BAa734C00298b9429b518D621753Bb0f6efF2",
        USDC: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        TETHER: "",
        WETH: "",
        UNI: "",
        ZRX: "",
        LINK: "0x8652Fb672253607c0061677bDCaFb77a324DE081",
      },
      ERC721: {
        FiniliarEgg: "0xe4f91a435ef991A380f8dF573EF49d415b9D627D", // 16 FEGG
        FatRatMafia: "0x0EeCCd3B48D7cAA3a516D808eE5aDA20fB660c3a", // 237 FRM
        CryptoPudgyPunks: "0xa85c827B214123ad8818532f7E8fe3069132bc42", // 121 CPP
      },
    },
    goerli: {
      ERC20: {
        DAI: "0xFBB8495A691232Cb819b84475F57e76aa9aBb6f1", // 41 ETH, 95,000,100 DAI
        USDC: "0x01dA0c5fda944a694CE10F2457301CD7E3b3Ba3C", // 1 ETH, 43,000,000 USDC
        TETHER: "0x7c8CA1a587b2c4c40fC650dB8196eE66DC9c46F4",
        WETH: "0xE807C2a81366dc10a68cd8e95660477294B6019B", // 2,680 ETH, 4,064 WETH
        UNI: "0xC6E19b38C01e8E9B2cC5AF190E6fa33654Fc5F7d", // 0 ETH, 5,000,000 UNI
        ZRX: "0x0cadA1cf272472cF9Eb8f579EB6a5263C5F7D61b",
        LINK: "0x27EDCF774e0991c86e3d52FF58f94cB39c486A3E", // 91 ETH, 100,000 LINK
      },
    },
  },
} as const;

export const HARDHAT_CONFIG_HELPER = {
  compiler: {
    enable: true,
    fee: {
      lowDeployment: 1,
      lowExecution: 1000,
    },
  },
  reportGas: true,
} as const;
