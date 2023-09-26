import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useABIParser, useDeployer, useOptismFetcher } from "@scripts/hook";
import { ContractTransactionReceipt, Filter, TransactionRequest } from "ethers";
import hre from "hardhat";
import { Box } from "@assets/types";

const { ALCHEMY_KEY_MUMBAI, ALCHMEY_OPTIMISM_API_KEY } = process.env;

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

  it.skip("Should init a raw transaction", async function TestRawTransaction() {
    const { contract, owner } = await loadFixture(useFixture);

    const box = contract as unknown as Box;
    const param = 10;
    const _maxFeePerGas = ethers.parseUnits("1", "gwei");
    const _maxPriorityFeePerGas = ethers.parseUnits("3", "gwei");

    console.log({ _maxFeePerGas });

    console.log(BigInt(_maxFeePerGas));

    const txMeta: TransactionRequest = {
      from: owner.address,

      //The maximum total fee to pay per gas. The actual value used is protocol enforced to be the block's base fee.
      // unit: gwei => bigint
      maxFeePerGas: BigInt(_maxFeePerGas),
      maxPriorityFeePerGas: BigInt(_maxPriorityFeePerGas),
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

  it.skip("Should estimate gas for L2 tx", async function TestL2Gas() {
    const { contract } = await loadFixture(useFixture);
    const [owner] = await ethers.getSigners();

    const sdk = await import("@eth-optimism/fee-estimation");
    const { getL2Client, estimateFees, overhead, scalar } = sdk;

    const params = {
      chainId: 420,
      rpcUrl: "https://goerli.optimism.io",
      // chainId: 10,
      // rpcUrl: "https://mainnet.optimism.io",
    };

    const client = getL2Client(params);

    const abi = (await useABIParser(contractName)).abi;

    const gas = await estimateFees({
      functionName: "setValue",
      abi: abi,
      args: [100],
      chainId: 420,
      client: client,
      account: "0x7D5d9edDC3DAd91e5E18200EC3972CeCF988485f", // eoa address
      to: "0xc2be2fE8A4B52348880E9D08277eF305A5Aad1F8", // contract address
    });

    const cost = ethers.formatUnits(gas, "ether");
    console.log({ cost }); // cold : 142.75 krw, warm: 79.20 krw / 0.000037201501267602 ether

    // from block explorer: https://goerli-optimism.etherscan.io/tx/0x9327d517d3dfd7175a85093e966c59f4fd812140d1ce9613483e7778e1b286b3
    // actual testnet cost: cold : 146.92 krw(0.11 usd), warm 88.14 krw / 0.000041401501408358 ether

    console.log({ gas });
  });
});

describe(`${PREFIX}-assembly`, function TestAssembly() {
  it.skip("Should return a storage slot", async function TestStorageSlot() {
    const { contract } = await loadFixture(useFixture);

    const expected = 10;
    expect(await contract.getDirectValue()).to.equal(expected);
  });

  it.skip("Should add two values", async function TestAdd() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.addTwoValues(3, 99)).to.equal(102);
  });

  it.skip("Should return state enum", async function TestStateEnum() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getStateEnum()).to.equal(2);
  });

  it.skip("Should set a new value with assembly", async function TestAssemblySetter() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.value()).to.equal(99);

    await contract.setValueWithAssembly(999);

    expect(await contract.value()).to.equal(999);
  });

  it.skip("Should get a value with assembly", async function TestAssemblyGetter() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getValueWithAssembly()).to.equal(99);
  });

  it.skip("Should get storage vars by slot number", async function TestSlotIndex() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getStorageBySlot(0)).to.equal(99);
    expect(await contract.getStorageBySlot(1)).to.equal(10);
    expect(await contract.getStorageBySlot(2)).to.equal(2);

    console.log(await contract.getStorageBySlot(3));
    console.log(await contract.getStorageBySlot(4)); // last slot
    console.log(await contract.getStorageBySlot(5));
    console.log(await contract.getStorageBySlot(6));
    console.log(await contract.getStorageBySlot(7));
  });

  it.skip("Should hash with assembly", async function TestAssemblyHash() {
    const { contract } = await loadFixture(useFixture);
    const expected = ethers.solidityPackedKeccak256(["uint", "uint"], [3, 9]);
    expect(await contract.hash(3, 9)).to.equal(expected);
  });

  // todo
  it.skip("Should allocate and return with free pointer memory", async function TestFreePointer() {
    const { contract } = await loadFixture(useFixture);
    // console.log(await contract.allocateAndReturn(44, 6));
    expect(await contract.allocateAndReturn(44)).to.equal(44);
  });
});

describe(`${PREFIX}-storage-pointer`, async function TestStoragePointer() {
  it.skip("Should update storage variable with pointer", async function TestPointerUpdate() {
    const { contract } = await loadFixture(useFixture);
    await contract.getMapPointerForUpdate();

    expect((await contract.myMap())[2]).to.equal(BigInt(300));
  });
});
