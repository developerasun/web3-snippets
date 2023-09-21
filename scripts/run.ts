import { ethers } from "hardhat";
import { useEventParser, useGasPrice } from "./hook";

async function _main() {
  // useEventParser();
  // await useGasPrice();
  console.log(ethers.formatUnits("58819800030256", "ether"));
}

_main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
