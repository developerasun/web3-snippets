import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useDeployer, useOptismFetcher } from "@scripts/hook";
import { ContractTransactionReceipt, Filter, TransactionRequest } from "ethers";
import hre from "hardhat";
import { Box } from "@assets/types";

const { ALCHEMY_KEY_MUMBAI } = process.env;

const contractName = "Box";
const PREFIX = `unit-${contractName}`;

const useFixture = async () => {
  const contract = (await useDeployer(contractName)).contract;
  const [owner, recipient] = await ethers.getSigners();

  return { contract, owner, recipient };
};

describe(`${PREFIX}-base`, function TestCore() {
  it.skip("Should return a value", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getValue()).to.equal(4);
  });

  it.skip("Should require no casting with typechain", async function TestNoCasting() {
    const _contract = await ethers.getContractFactory("Box");
    const contract = await _contract.deploy();

    expect(await contract.getValue()).to.equal(4);
  });
});

describe(`${PREFIX}-event`, function TestEvent() {
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
});

describe(`${PREFIX}-gas`, function TestGas() {
  it.skip("Should check actual gas used", async function TestGasUsed() {
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

  it.only("Should init a raw transaction", async function TestRawTransaction() {
    const { contract, owner } = await loadFixture(useFixture);

    const box = contract as unknown as Box;
    const param = 10;
    const txMeta: TransactionRequest = {
      from: owner.address,

      //The maximum total fee to pay per gas. The actual value used is protocol enforced to be the block's base fee.
      maxFeePerGas: ethers.formatUnits("3", "gwei"),
    };

    // @dev `populateTransaction`: validate all props for tx
    const rawTx = await box.setValue.populateTransaction(param, txMeta);
    console.log({ rawTx }); // from(owner), to(contract), data

    const tx = await owner.sendTransaction(rawTx);
    const receipt = await tx.wait(1);

    if (receipt) {
      console.log("tx status: ", receipt.status === 1 ? "success" : "failure");
    }
  });
});

describe(`${PREFIX}-assembly`, function TestAssembly() {});
