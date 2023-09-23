import { ethers } from "hardhat";
import { useEventParser, useGasPrice } from "@scripts/hook.js";

async function _main() {
  // useEventParser();
  const { userFee, blockProducerTip } = await useGasPrice();
  console.log({ userFee: userFee + "gwei", blockProducerTip: blockProducerTip + "gwei" });
}

_main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
