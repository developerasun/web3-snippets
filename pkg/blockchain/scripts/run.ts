import { ethers } from "hardhat";
import {  logger, useCron, useEventParser, useGasPrice, } from "@scripts/hook";
import { RecurrenceRule } from 'node-schedule';

async function _main() {

  // "*/5 * * * *"
  // "* /1 * * * *"
  // useCron("*/1 * * * *", (date) => console.log("check: ", Date.now()))
  // const logger = await useLogger()
  // logger.info("big news here, fam")
  // logger.error("something went wrong")
  // logger.success("done, bitch")
  // logger.warn("smell suspicious")
}

_main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
