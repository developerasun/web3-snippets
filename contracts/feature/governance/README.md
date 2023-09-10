# Tips and tricks for implementing governance

## Contents

- [Glossary](#glossary)
- [Contract deployment order](#contract-deployment-order)
- [Setting up governance with meta transactions](#setting-up-governance-with-meta-transactions)

## Glossary

1. Voting delay: Delay since proposal is created until voting starts.
1. MinDelay in timelock controller: time between voting finish and voting execution
1. Voting period: Length of period during which people can cast their vote.
1. block: Assumed block time for converting above time periods into block numbers. Block time may drift and impact these periods in the future.
1. proposal threshold: Minimum number of votes an account must have to create a proposal.
1. quorum: Quorum required for a proposal to pass.
1. token decimals: Token amounts above will be extended with this number of zeroes. Does not apply to ERC721Votes.
1. ERC20Votes: Represent voting power with a votes-enabled ERC20 token. Voters can entrust their voting power to a delegate.
1. TimelockController: Allows multiple proposers and executors, in addition to the Governor itself
1. Voting deadline: the sum of block.number, voting delay, and voting period

```solidity
    struct ProposalCore {
        Timers.BlockNumber voteStart;
        Timers.BlockNumber voteEnd;
        bool executed;
        bool canceled;
    }

    // uint64 snapshot = block.number.toUint64() + votingDelay().toUint64();
    // uint64 deadline = snapshot + votingPeriod().toUint64();
```

castVoteWithReason function signature

```solidity
function castVoteWithReason(
  uint256 proposalId,
  uint8 support,
  string calldata reason
  ) public virtual override returns (uint256)
```

Hash string with ethers.utils.id.

```js
// function signature
export function id(text: string): string {
  return keccak256(toUtf8Bytes(text));
}

// implementation
const agendaDescription = "hello governance";
const descriptionHash = ethers.utils.id(agendaDescription);
```

- @dev Delegate votes from the sender to `delegatee`.
- @dev people votes based on checkpoints
- @dev initial governance token has no delegatee

## Contract deployment order

Order matters.

1. Deploy ERC20 governance token.
1. Deploy timelock controller for governor.
1. Deploy governor.
1. Deploy meta transaction for governance setup.
1. Deploy governance agenda. In this example, Box contract.

## Setting up governance with meta transactions

Once deployed, you need to execute a few transactions to make governance working and decentralized.

**governance token**

Delegate a voting power to a delegatee.

```ts
const token = await ethers.getContractAt(
  "GovernanceToken",
  governanceTokenAddr
);

const tx = await token.delegate(delegatedAccount);
const confirmationBlocksToWait = 1;
await tx.wait(confirmationBlocksToWait);

console.log(
  chalk.bgCyan("Checkpoints of delegatedAccount: "),
  await token.numCheckpoints(delegatedAccount)
);
```

**timelock controller**

Timelock controller contract has roles specified: proposer, executor, admin. In on-chain DAO,

1. Governor contract is only a `proposer`
1. Anyone can be an executor or Governor contract is an `executor`.
1. Governor has an `admin` role at first, but should be revoked for decentralization.

```ts
// get roles from timelock controller contract
const proposerRole = await timelock.PROPOSER_ROLE();
const executorRole = await timelock.EXECUTOR_ROLE();
const adminRole = await timelock.TIMELOCK_ADMIN_ROLE();

// * this is a process for decentralizing governor contract.
// make governor contract proposer
const proposalTx = await timelock.grantRole(proposerRole, governor.address);
await proposalTx.wait(confirmationBlocksToWait);

// make everyone executors
const executorTx = await timelock.grantRole(executorRole, ADDRESS_ZERO);
await executorTx.wait(confirmationBlocksToWait);

// revoke deployer from owning governor contract
const revokeTx = await timelock.revokeRole(adminRole, deployer);
await revokeTx.wait(confirmationBlocksToWait);
```

**agenda**

Agenda is a contract where DAO community make a suggestion. These types of contracts have an access control and should be owned by timelock controller.

Value proposed can only be changed by owner(timelock controller).

```ts
const confirmationBlocksToWait = 1;
const transferOwnerTx = await box.transferOwnership(timelock.address);
await transferOwnerTx.wait(confirmationBlocksToWait);
```
