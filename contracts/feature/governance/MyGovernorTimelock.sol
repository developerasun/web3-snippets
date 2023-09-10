// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/// @dev timelock contract is an actual owner of the box(agenda) contract
contract MyGovernorTimelock is TimelockController {
    constructor(
        uint256 minDelay, // after voting passes, user can exit before execution
        address[] memory proposers, // governor contract should only be a proposer
        address[] memory executors // executor: either 1) anyone can execute or 2) governor only executes
    ) TimelockController(minDelay, proposers, executors) {}
}
