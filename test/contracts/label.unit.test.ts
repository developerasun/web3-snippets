import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useABIParser, useDeployer, useOptismFetcher } from "@scripts/hook";
import { ContractTransactionReceipt, Filter, TransactionRequest } from "ethers";
import hre from "hardhat";
import { Label } from "@assets/types";

const { ALCHEMY_KEY_MUMBAI, ALCHMEY_OPTIMISM_API_KEY } = process.env;

const contractName = "Label";
const PREFIX = `unit-${contractName}`;

const useFixture = async () => {
  const contract = (await useDeployer(contractName)).contract;
  const [owner, recipient] = await ethers.getSigners();

  return { contract, owner, recipient };
};

describe(`${PREFIX}-custom-ERC`, function TestCustomERC() {
  it.skip("Should support ERC9999 interface", async function TestSupportsInterface() {
    const { contract } = await loadFixture(useFixture);

    const label = contract as unknown as Label;
    const magicValue = await label.getInterfaceId();

    console.log({ magicValue });

    expect(await label.supportsInterface(magicValue)).to.be.true;
  });
});
