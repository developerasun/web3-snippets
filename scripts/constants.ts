export const INTERFACE_ID = {
  erc20: "0x36372b07",
  erc165: "0x01ffc9a7",
  erc721: "0x80ac58cd",
  erc777: "0xe58e113c",
  erc1155: "0xd9b67a26",
} as const;

const HASH_HELPER = {
  erc9999: {
    domain: {
      name: "Jake Sung", 
      version: 1,
      hex: "4A616B652053756E67", 
      decimals: "1372078877088207433319"
    }
  },
  eip191: {
    format: {
      bytes32: "\x19Ethereum Signed Message:\n32",
      arbitrary: "\x19Ethereum Signed Message:\n",
      validator: "\x19\x00Ethereum Signed Message:\n"
    },
    prefix: "\x19"
  },
  eip712: {
    format: "\x19\x01\Ethereum Signed Message:\n32",
    prefix: "\x19\x01"
  },
} as const

export const HARDHAT_CONFIG_HELPER = {
  compiler: {
    enable: true,
    fee: {
      lowDeployment: 1,
      lowExecution: 1000,
    },
  },
  reportGas: true,
  networkNames: ["maticmum"],
} as const;
