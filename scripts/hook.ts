import { ethers } from "hardhat";
import hre from "hardhat";
import { Contract, Interface, InterfaceAbi, Mnemonic, TransactionReceipt } from "ethers";
import TEST_ABI from "../assets/abi/MyToken.polygonMumbai.json";

const { ALCHEMY_KEY_MUMBAI, ALCHMEY_OPTIMISM_APK_KEY } = process.env;

// ================================================================== //
// =========================== common  ============================= //
// ================================================================== //
export async function useDeployer(contractName: string) {
  const contract = await ethers.deployContract(contractName);
  await contract.waitForDeployment();

  const [deployer, recipient] = await ethers.getSigners();

  console.log("deployed to: ", contract.target);

  return { contract, deployer, recipient };
}

export async function useWaitBlock(contract: Contract) {
  const receipt = await contract.deploymentTransaction()?.wait(6);

  if (receipt !== undefined) {
    let message = "";

    receipt?.status === 1 ? (message = "33") : (message = "99");
    console.log({ message });
  }
}

export async function useGasPrice() {
  const provider = new ethers.AlchemyProvider("maticmum", ALCHEMY_KEY_MUMBAI);

  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

  const _maxFeePerGas = maxFeePerGas?.toString() ?? "0";
  const _maxPriorityFeePerGas = maxPriorityFeePerGas?.toString() ?? "0";

  const userFee = ethers.formatUnits(_maxFeePerGas!, "gwei");
  const blockProducerTip = ethers.formatUnits(_maxPriorityFeePerGas!, "gwei");

  return { userFee, blockProducerTip };
}

export async function useVerifier(network: string, target: string, args?: any[]) {
  if (network === "hardhat") {
    console.log("Invalid network target for verification");
    process.exit(1);
  }
  await hre.run("verify:verify", {
    address: target,
    constructorArguments: args,
  });
}

/**
 * @dev fetch private key with mnemonic/recovery seed
 * @param mnemonic
 * @returns
 */
export function useMnemonic(mnemonic: Mnemonic) {
  const { privateKey, address } = ethers.HDNodeWallet.fromMnemonic(mnemonic);
  return {
    address,
    privateKey,
  };
}

export async function useABIParser(contractName: string) {
  const abi = (await hre.artifacts.readArtifact(contractName)).abi;

  return { abi };
}

export function useUnixTable(timestamp: number) {
  const constant = 1000;
  const localDateString = new Date(timestamp * constant).toLocaleString();
  const yyyymmdd = new Date(timestamp * constant).toISOString().slice(0, 10);

  return { localDateString, yyyymmdd };
}

export async function useErrorParser(error: any) {
  const { code, reason } = error;

  const textified = JSON.parse(JSON.stringify(error));
  const responseBody = JSON.parse(textified.error.error.body);

  console.log(
    `
    top level debug info:
      code: ${code}
      reason: ${reason}
    detailed:
      fromContract: ${responseBody.error.message}`
  );
}

export async function useEventParser(abi: Interface | InterfaceAbi) {
  const iface = ethers.Interface.from(TEST_ABI.abi);
  let eventMap: Record<string, string> = {};

  iface.forEachEvent((event) => {
    eventMap[event.name] = event.topicHash;
  });

  return { eventMap };
}

// ================================================================== //
// =========================== L2 hooks ============================= //
// ================================================================== //
export async function useOptismFetcher() {
  const sdk = await import("@eth-optimism/fee-estimation");

  const { getL2Client, baseFee, gasPrice } = sdk;

  const params = {
    chainId: 10,
    rpcUrl: "https://mainnet.optimism.io",
  };
  const client = getL2Client(params);

  const provider = new ethers.AlchemyProvider("optimism", ALCHMEY_OPTIMISM_APK_KEY);

  const currentBlock = await provider.getBlock("latest");

  if (currentBlock !== null) {
    const { number, gasLimit } = currentBlock;

    const _baseFee = await baseFee({ client, blockNumber: BigInt(number) });
    const _gasPrice = await gasPrice({ client, blockNumber: BigInt(number) });

    const currentBaseFee = ethers.formatUnits(_baseFee.toString(), "gwei");
    const currentGasPrice = ethers.formatUnits(_gasPrice.toString(), "gwei");
    const currentBlockNumber = number;

    console.log({ currentBaseFee });
    console.log({ currentGasPrice });
    console.log({ currentBlockNumber });
    console.log({ gasLimit });
  }
}

// todo
// export async function useFee() {
//   const optimistOwnerAddress = "0x77194aa25a06f932c10c0f25090f3046af2c85a6";
//   const tokenId = BigInt(optimistOwnerAddress);
//   const fees = await estimateFees({
//     client: {
//       chainId: 10,
//       rpcUrl: "https://mainnet.optimism.io",
//     },
//     functionName: "burn",
//     abi: optimistABI,
//     args: [tokenId],
//     account: optimistOwnerAddress,
//     to: "0x2335022c740d17c2837f9C884Bfe4fFdbf0A95D5",
//   });

//   console.log({ fees });
// }
