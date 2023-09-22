import {
  baseFee,
  estimateFees,
  getL2Client,
  gasPrice,
} from "@eth-optimism/fee-estimation";
import { optimistABI } from "@eth-optimism/contracts-ts";

import { formatUnits } from "ethers";

async function useOptimism() {
  const params = {
    chainId: 10,
    rpcUrl: "https://mainnet.optimism.io",
  };
  const client = getL2Client(params);

  console.log(client.name);

  const _baseFee = await baseFee({ client, blockNumber: 109899688 });
  const _gasPrice = await gasPrice({ client, blockNumber: 109899688 });

  const currentBaseFee = formatUnits(_baseFee.toString(), "gwei");
  const currentGasPrice = formatUnits(_gasPrice.toString(), "gwei");

  console.log({ currentBaseFee });
  console.log({ currentGasPrice });
}

// useOptimism();

// todo
async function useFee() {
  const optimistOwnerAddress = "0x77194aa25a06f932c10c0f25090f3046af2c85a6";
  const tokenId = BigInt(optimistOwnerAddress);
  const fees = await estimateFees({
    client: {
      chainId: 10,
      rpcUrl: "https://mainnet.optimism.io",
    },
    functionName: "burn",
    abi: optimistABI,
    args: [tokenId],
    account: optimistOwnerAddress,
    to: "0x2335022c740d17c2837f9C884Bfe4fFdbf0A95D5",
  });

  console.log({ fees });
}

useFee();
