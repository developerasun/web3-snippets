import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useDeployer } from "@scripts/hook";
import { Filter } from "ethers";
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
  it("Should return a value", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getValue()).to.equal(4);
  });

  it("Should require no casting with typechain", async function TestNoCasting() {
    const _contract = await ethers.getContractFactory("Box");
    const contract = await _contract.deploy();

    expect(await contract.getValue()).to.equal(4);
  });

  it.only("Should", async function TestLogFetcher() {
    const { contract } = await loadFixture(useFixture);
    const provider = hre.network.provider;

    await contract.setValue(4);

    const filter = contract.filters.ValueChanged(4);

    const logs = await contract.queryFilter(filter);

    logs.map((log) => {
      const { topics } = log;
      console.log(topics);
    });
    // // console.log({ filter });

    // const _filter = filter as unknown as Filter;

    // provider.on("connection", (res) => {
    //   console.log(res);
    // });
  });
});
