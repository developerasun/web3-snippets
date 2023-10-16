import { BigNumberish } from "ethers";

interface ActionProps {
  timestamp: number;
}

export interface IERC20PermitDomain {
  name: string;
  version: string;
  chainId: string;
  verifyingContract: string;
}

export interface IERC20PermitType {
  Permit: [
    { name: "owner"; type: "address" },
    { name: "spender"; type: "address" },
    { name: "value"; type: "uint256" },
    { name: "nonce"; type: "uint256" },
    { name: "deadline"; type: "uint256" }
  ];
}

export interface IERC20PermitValue {
  owner: string;
  spender: string;
  value: BigNumberish | number;
  nonce: number;
  deadline: number;
}
