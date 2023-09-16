import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useDeployer } from "../scripts/hook";

const contractName = "Box";
const PREFIX = `unit-${contractName}`;

const useFixture = async () => {
  const contract = (await useDeployer(contractName)).contract;
  const [owner, recipient] = await ethers.getSigners();

  return { contract, owner, recipient };
};

describe.skip(`${PREFIX}-core`, function TestCore() {
  it("Should return a value", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getValue()).to.equal(4);
  });

  it("Should require no casting with typechain", async function TestNoCasting() {
    const _contract = await ethers.getContractFactory("Box");
    const contract = await _contract.deploy();

    expect(await contract.getValue()).to.equal(4);
  });
});
