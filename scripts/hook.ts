import { ethers } from "hardhat";
import hre from "hardhat";
import { consola, createConsola } from "consola";
import { Contract, Interface, InterfaceAbi, Mnemonic, TransactionReceipt } from "ethers";
import TEST_ABI from "../assets/abi/MyToken.polygonMumbai.json";

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
    consola.log({ message });
  }
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

export async function logConfirm(message: string) {
  const consola = createConsola({
    reporters: [
      {
        log: (logObj) => {
          console.log(JSON.stringify(logObj));
        },
      },
    ],
  });

  await consola.prompt(message, {
    type: "confirm",
  });
}

export function logLink(txHash: `0x${string}`) {
  consola.success("transaction done: ", `https://mumbai.polygonscan.com/tx/${txHash}`);
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

//   await fs.promises.writeFile(`${process.cwd()}/event-list.json`, JSON.stringify(eventList, null, 2));
//   return { eventList };
// }
