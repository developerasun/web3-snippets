import { ethers } from "hardhat";
import hre from "hardhat";
import { Contract, Interface, InterfaceAbi, Mnemonic, Networkish, TransactionReceipt } from "ethers";
import TEST_ABI from "../assets/abi/MyToken.polygonMumbai.json";
import { JobCallback, RecurrenceRule, scheduleJob, gracefulShutdown } from "node-schedule";
import pino from "pino";

const {
  ALCHEMY_KEY_MUMBAI,

  ALCHMEY_OPTIMISM_GOE_API_KEY,
  ALCHEMY_WSS_OPT_GOERLI,
  ALCHMEY_OPTIMISM_API_KEY,
} = process.env;

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

// ================================================================== //
// ============================ common  ============================= //
// ================================================================== //
export async function useDeployer(contractName: string) {
  const contract = await ethers.deployContract(contractName);
  await contract.waitForDeployment();

  // logger.info(`deployed to: ${contract.target}`);
  console.info(`deployed to: ${contract.target}`);

  const network = hre.network.name;

  // guard for transaction underpriced when network is not hardhat
  if (network === "hardhat") {
    // @ts-ignore
    // await hre.storageLayout.export()

    const [deployer, recipient] = await ethers.getSigners();

    return { contract, deployer, recipient };
  }

  if (network === "polygonMumbai") {
    const targetNetwork = "maticmum";
    const targetAddr = contract.target as string;

    await useWaitBlock(contract, targetNetwork, ALCHEMY_KEY_MUMBAI);
    await useVerifier(targetNetwork, targetAddr);
    return { contract };
  }

  if (network === "optimisticGoerli") {
    const targetNetwork = "optimism-goerli";
    const targetAddr = contract.target as string;

    await useWaitBlock(contract, targetNetwork, ALCHMEY_OPTIMISM_GOE_API_KEY!);
    await useVerifier(targetNetwork, targetAddr);
  }

  return { contract };
}

export async function useWaitBlock(contract: Contract, network: Networkish, apiKey: string) {
  function blockListener(block: number) {
    logger.debug(`Waited for block to produce: ${block}`);
  }

  const provider = new ethers.AlchemyProvider(network, apiKey);

  await provider.on("block", blockListener);

  const targetWaitNumber = 6;
  await contract.deploymentTransaction()?.wait(targetWaitNumber);

  logger.debug(`waited ${targetWaitNumber} blocks for confirmation`);

  await provider.removeListener("block", blockListener);
}

export async function useGasPrice() {
  const provider = new ethers.AlchemyProvider("maticmum", ALCHEMY_KEY_MUMBAI);

  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

  const _maxFeePerGas = maxFeePerGas?.toString() ?? "0";
  const _maxPriorityFeePerGas = maxPriorityFeePerGas?.toString() ?? "0";

  const estimatedBaseFee = ethers.formatUnits(_maxFeePerGas!, "gwei");
  const blockProducerTip = ethers.formatUnits(_maxPriorityFeePerGas!, "gwei");

  return { estimatedBaseFee, blockProducerTip };
}

export async function useVerifier(network: string, target: string, args?: any[]) {
  if (network === "hardhat") {
    logger.debug("Invalid network target for verification");
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

export async function useErrorParser(error: any) {
  const { code, reason } = error;

  const textified = JSON.parse(JSON.stringify(error));
  const responseBody = JSON.parse(textified.error.error.body);

  logger.info(
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
// ========================== timestamp  ============================ //
// ================================================================== //
export function useEpochTime() {
  return {
    utc: Math.floor(new Date().getTime() / 1000.0), // The getTime method returns the time in milliseconds.
    local: new Date().toLocaleString(),
  };
}

export function useUnixTable(timestamp: number) {
  const constant = 1000;
  const localDateString = new Date(timestamp * constant).toLocaleString();
  const yyyymmdd = new Date(timestamp * constant).toISOString().slice(0, 10);

  return { localDateString, yyyymmdd };
}

// @dev cron job can't be used for second-based jobs. use shell script for it instead
export function useCron(schedule: string, callback: JobCallback) {
  const job = scheduleJob(schedule, callback);
}

export async function useInterval(callback: TimerHandler, timeout: number, clear: number): Promise<{ done: Boolean }> {
  logger.debug(`running scheduled jobs for ${timeout} milliseconds`);

  const intervalId = setInterval(callback, timeout);

  let done = false;

  const timeoutId = setTimeout(() => {
    logger.debug(`terminating interval with id ${intervalId} after ${clear} milliseconds`);
    clearInterval(intervalId);
    logger.info(`terminating timeout with id ${timeoutId}`);
  }, clear);

  return new Promise((resolve) => {
    done = true;
    setTimeout(() => {
      resolve({ done });
    }, clear + 1000);
  });
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

  const provider = new ethers.AlchemyProvider("optimism", ALCHMEY_OPTIMISM_API_KEY);

  const currentBlock = await provider.getBlock("latest");

  if (currentBlock !== null) {
    const { number, gasLimit } = currentBlock;

    const _baseFee = await baseFee({ client, blockNumber: BigInt(number) });
    const _gasPrice = await gasPrice({ client, blockNumber: BigInt(number) });

    const currentBaseFee = ethers.formatUnits(_baseFee.toString(), "gwei");
    const currentGasPrice = ethers.formatUnits(_gasPrice.toString(), "gwei");
    const currentBlockNumber = number;

    logger.info({ currentBaseFee });
    logger.info({ currentGasPrice });
    logger.info({ currentBlockNumber });
    logger.info({ gasLimit });
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

//   logger.info({ fees });
// }
