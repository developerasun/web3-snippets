import { ethers } from "hardhat";
import {  useEventParser, useGasPrice, useLogger } from "@scripts/hook";

async function _main() {
  const logger = await useLogger()
  logger.box("here comes the box, bitch")
  logger.info("big news here, fam")
  logger.error("something went wrong")
  logger.success("done, bitch")
  logger.warn("smell suspicious")
}

_main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
