import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useDeployer, useOptismFetcher } from "@scripts/hook";
import { ContractTransactionReceipt, Filter } from "ethers";
import hre from "hardhat";

const { ALCHEMY_KEY_MUMBAI } = process.env;

const contractName = "Box";
const PREFIX = `unit-${contractName}`;

const useFixture = async () => {
  const contract = (await useDeployer(contractName)).contract;
  const [owner, recipient] = await ethers.getSigners();

  return { contract, owner, recipient };
};

describe(`${PREFIX}-core`, function TestCore() {
  it.skip("Should return a value", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getValue()).to.equal(4);
  });

  it.skip("Should require no casting with typechain", async function TestNoCasting() {
    const _contract = await ethers.getContractFactory("Box");
    const contract = await _contract.deploy();

    expect(await contract.getValue()).to.equal(4);
  });

  it.skip("Should filter an event", async function TestLogFetcher() {
    const { contract } = await loadFixture(useFixture);

    await contract.setValue(4);

    const filter = contract.filters.ValueChanged(4);

    const logs = await contract.queryFilter(filter);

    logs.map((log) => {
      const { topics } = log;
      console.log(topics);
    });
  });

  it.only("Should check actual gas used", async function TestGasUsed() {
    const { contract } = await loadFixture(useFixture);
    const tx = await contract.setValue(100);

    const receipt = (await tx.wait(1)) as ContractTransactionReceipt;
    const { gasPrice, gasUsed } = receipt;

    const estimatedGas = await contract.setValue.estimateGas(100);
    const _gasPrice = ethers.formatUnits(gasPrice, "gwei");

    const actualFee = ethers.formatUnits(gasPrice * gasUsed, "ether");
    console.log({ estimatedGas });
    console.log({ gasUsed });
    console.log({ _gasPrice });
    console.log({ actualFee });
  });

  it.skip("Should return gas info for a block", async function TestGasInfoFetch() {
    await useOptismFetcher();
  });
});
