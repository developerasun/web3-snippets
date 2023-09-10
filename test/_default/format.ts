import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useDeployer } from "../../scripts/hook/useDeployer";

const contractName = "Promiser";
const PREFIX = `unit-${contractName}`;

const useFixture = async () => {
  const contract = (await useDeployer(contractName)).contract;
  const [owner, recipient] = await ethers.getSigners();

  return { contract, owner, recipient };
};

describe.skip(`${PREFIX}-core`, function TestCore() {
  it("Should return a name", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getName()).to.equal("Promiser");
  });
});
