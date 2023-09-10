import hre from "hardhat";
import { ethers } from "hardhat";
import fs from "fs";
import chalk from "chalk";
import * as abiDecoder from "abi-decoder";
import { Contract } from "ethers";

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
    chalk.red(`
    top level debug info:
      code: ${code}
      reason: ${reason}
    detailed:
      fromContract: ${responseBody.error.message}`)
  );
}

export async function useEventParser(contract: Contract) {
  const eventList = Object.entries(contract.interface.events).map(([name, evt]) => {
    const contractName = "contract name here";

    return {
      contractName,
      eventSig: ethers.utils.keccak256(Buffer.from(name)),
      eventName: name,
    };
  });

  await fs.promises.writeFile(`${process.cwd()}/event-list.json`, JSON.stringify(eventList, null, 2));
  return { eventList };
}
