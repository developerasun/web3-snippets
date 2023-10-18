import { SnapshotRestorer, loadFixture, setBalance, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { expect, use } from "chai";
import { ethers } from "hardhat"
import { useABIParser, useDeployer, useOptismFetcher } from "@scripts/hook";
import { ContractRunner, ContractTransactionReceipt, Filter, TransactionRequest } from "ethers";
import hre from "hardhat";
import { Assembly } from "@assets/types";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { Network, Alchemy } from 'alchemy-sdk'
 
const { 
  ALCHEMY_KEY_MUMBAI, 
  ALCHMEY_OPTIMISM_API_KEY, 
  ALCHMEY_OPTIMISM_GOE_API_KEY, 
  ALCHEMY_WSS_OPT_GOERLI,
  ACCOUNT_PRIVATE_KEY
} = process.env;

const contractName = "Assembly";
const PREFIX = `unit-${contractName}`;

const useFixture = async () => {
  const _contract = (await useDeployer(contractName)).contract;
  const [owner, recipient] = await ethers.getSigners();

  const contract = _contract as unknown as Assembly
  return { contract, owner, recipient };
};

describe(`${PREFIX}-base`, function TestCore() {
  it.skip("Should return a value", async function TestName() {
    const { contract } = await loadFixture(useFixture);
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

    const box = contract as unknown as Assembly;
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

  it.skip("Should allocate and return with free pointer memory", async function TestFreePointer() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.allocateAndReturn(44)).to.equal(44);
  });

  it.skip("Should return hex to integer", async function TestGetHex() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.getHex()).to.equal(10); // 0xa is 10 in decimals
  });

  it.skip("Should return msg.sender", async function TestCaller() {
    const { contract } = await loadFixture(useFixture);
    const hardhatDefaultSender = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    expect(await contract.getCaller()).to.equal(hardhatDefaultSender);
  });

  it.skip("Should return msg.value", async function TestCaller() {
    const { contract, owner } = await loadFixture(useFixture);
    const valueSent = ethers.parseUnits("11", "ether");

    await owner.sendTransaction({
      value: valueSent,
      to: contract.target,
    });

    // expect(await contract.getNativeValue({ value: valueSent, from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" })).to.equal(valueSent);

    expect(await contract.getBalance()).to.equal(valueSent);
    // expect(await contract.getNativeValue({ value: valueSent })).to.equal(valueSent);
  });

  it.skip("Should emit an event", async function TestEvent() {
    const { contract, owner } = await loadFixture(useFixture);

    const id = ethers.id("Received(address,uint256)");

    console.log({ id });
    console.log("id is byteslike?: ", ethers.isBytesLike(id));

    const encoded = ethers.encodeBytes32String("Received(address,uint256)");
    console.log({ encoded });

    console.log("encoded is byteslike?: ", encoded);

    const abi = (await useABIParser("Assembly")).abi;

    const iface = ethers.Interface.from(abi);

    const topicHash = iface.getEvent("Received")?.topicHash;

    console.log({ topicHash });
    console.log("topichash is byteslike?: ", ethers.isBytesLike(topicHash));

    console.log("is id the same with topic hash?: ", id === topicHash);

    const sender = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const value = ethers.parseEther("1")

    const assembly = contract as unknown as Assembly
    const runner = owner as unknown as ContractRunner

    await expect(assembly.connect(runner).getEmittedEvent({ value, from: sender})).to.emit(contract, "Received").withArgs(sender,value)
  });
});

describe(`${PREFIX}-storage-pointer`, async function TestStoragePointer() {
  it.skip("Should update storage variable with pointer", async function TestPointerUpdate() {
    const { contract } = await loadFixture(useFixture);
    await contract.getMapPointerForUpdate();
    
    expect((await contract.myMap())[2]).to.equal(BigInt(300));
  });
});


describe(`${PREFIX}-mock`, function TestMockContract() {
  let blockchain: SnapshotRestorer

  beforeEach('Should set up', async () => {
    console.log("take blockchain snapshot")
    blockchain = await takeSnapshot()
  })
  
  afterEach('Should clean up', async () => {
    console.log(`restore blockchain ${blockchain.snapshotId} to initial state`)
    await blockchain.restore()
  })

  it.skip("Should mock storage update", async function TestMockStorage() {
    // const { owner } = await loadFixture(useFixture);
    // const abi = (await useABIParser('Assembly')).abi
    // const mocked = await deployMockContract<Assembly>(owner, abi)
    // console.log({mocked})
    // // const fakeCn = await smock.fake<Assembly>('Assembly')
    // // // const mocked = await smock.mock('Assembly')
    // // console.log({fakeCn})
    
    // // // console.log(await fakeCn.getBalance())
    
  })
  
})

describe(`${PREFIX}-alchemy-hook`, function TestAlchemyHook() {
  let alchemy: Alchemy

  const settings = {
    apiKey: ALCHMEY_OPTIMISM_GOE_API_KEY,
    network: Network.OPT_GOERLI
  }

  beforeEach('Should setup alchemy instance', () => {
    const _alchemy = new Alchemy(settings)
    alchemy = _alchemy
  })

  it.skip("Should fetch receipt info", async function TestTxStatusCheck() {
    const exampleHash = '0xf2b47e84f96bc33c1a73495d7945ee5400129c43947bd58329ab248450d7c6dd'
    const receipt = await alchemy.core.getTransactionReceipt(exampleHash)
    
    if (receipt) {
      console.log("is success? ", receipt.status === 1 ? true : false)
      console.log("tx hash: ", receipt.transactionHash)
      console.log("block hash: ", receipt.blockHash)
      console.log("block number: ", receipt.blockNumber)
    }
     
    if (!receipt) {
      console.log("transaction not mined yet")
    }
  })
  
  it.skip("Should get block number", async function TestGetBlock() {
      const { contract, owner } = await loadFixture(useFixture);
    ethers.provider.on("block", (b) => {
      console.log("current block: ",b)
    })

    // await owner.sendTransaction({ value: ethers.parseEther("1")})
    ethers.provider.on("pending", (txHash) => {
      console.log("current hash: ", txHash)
    })
 
    await contract.setName("wow")
    // const receipt = await tx.wait(1)
    // console.log("executed hash: ", receipt?.hash)
  })

  // todo
  it.skip("Should fetch pending tx", async function TestGetPendingTx() {
    const latest = await alchemy.core.getBlock("latest")

    let blockHash = ''

    const targetBlockHash = '0x7fab80188d4297a376c5ded4da33faec4ea1df733a6eb1587d5c0cb06d143786'
    const targetTxHash = '0x15ae92ee6dc524f097d3de2ffbbfab93cbe39c0407509ed386bd000371f036fd'

    if (latest) {
      blockHash = latest.hash
    }

    const response = await alchemy.core.getTransactionReceipts({ blockHash: targetBlockHash })

    const { receipts }  = response

    if (receipts) {

      receipts.forEach((receipt) => {
        if (receipt.transactionHash === targetTxHash) {
          console.log("found: ", receipt.transactionHash)
        }
      })
    }
  })

  it.skip("Should inspect latest block for tx hash", async function TestSearchBlock() {
    const latest = await alchemy.core.getBlock("latest")
    console.log("latest: ",latest.hash)
    const response = await alchemy.core.getTransactionReceipts({ blockHash: latest.hash })

    const { receipts } = response

    if (receipts) {
      receipts.forEach((receipt) => {
        console.log(receipt.transactionHash)
      })
    }
  })
  
})

describe(`${PREFIX}-transaction`, function TestTransaction() {
  it.only("Should return the same tx hash", async function TestRawTx() {
    const { contract, owner } = await loadFixture(useFixture)

    const provider = ethers.provider
    const wallet = new ethers.Wallet(ACCOUNT_PRIVATE_KEY!, provider)

    await setBalance(wallet.address, ethers.parseEther("100"))

    const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData()
    const estimates = await contract.setValue.estimateGas(10)

    const abi = (await useABIParser('Assembly')).abi
    const iface = ethers.Interface.from(abi)

    const setName = iface.getFunction('setValue')
    const params = setName?.inputs
    const data = iface.encodeFunctionData(setName!, [20])

    console.log({params})
    console.log({data})

    const tx:TransactionRequest = {
      from: wallet.address, 
      to: contract.target,
      gasLimit: estimates,
      chainId: 31337, 
      nonce: await owner.getNonce(), 
      maxFeePerGas, 
      maxPriorityFeePerGas,
      data
    }

    const rawTx = await wallet.signTransaction(tx)
    console.log({rawTx})
    
    const txResponse = await contract.connect(wallet).setValue(10)
    console.log("tx res hash: ", txResponse.hash)

    const receipt = await txResponse.wait(1)
    console.log("receipt hash: ", receipt?.hash)

    expect(rawTx).not.to.equal(txResponse.hash)
    expect(rawTx).not.to.equal(receipt?.hash)
    expect(await contract.value()).to.equal(10)
    
    const txResponse2 = await wallet.sendTransaction(tx)
    console.log("tx res2 hash: ", txResponse2.hash)
    
    const receipt2 = await txResponse2.wait(1)
    console.log("receipt2 hash: ", receipt2?.hash)

    expect(await contract.value()).to.equal(20)
  })
})