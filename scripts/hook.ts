import { ethers } from "hardhat";
import hre from "hardhat";

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

export async function useVerifier(target: string, args?: any[]) {
  await hre.run("verify:verify", {
    address: target,
    constructorArguments: args,
  });
}

// ESM
import { consola, createConsola } from "consola";
import { Contract } from "ethers";

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

// export async function useErrorParser(error: any) {
//   const { code, reason } = error;

//   const textified = JSON.parse(JSON.stringify(error));
//   const responseBody = JSON.parse(textified.error.error.body);

//   console.log(
//     chalk.red(`
//     top level debug info:
//       code: ${code}
//       reason: ${reason}
//     detailed:
//       fromContract: ${responseBody.error.message}`)
//   );
// }

// export async function useEventParser(contract: Contract) {
//   const eventList = Object.entries(contract.interface.events).map(([name, evt]) => {
//     const contractName = "contract name here";

//     return {
//       contractName,
//       eventSig: ethers.utils.keccak256(Buffer.from(name)),
//       eventName: name,
//     };
//   });

//   await fs.promises.writeFile(`${process.cwd()}/event-list.json`, JSON.stringify(eventList, null, 2));
//   return { eventList };
// }
