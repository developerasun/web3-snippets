// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token/ERC9999.sol";

contract Label is ERC9999 {
    function setLabel(address maker) public {
        bytes32 index = keccak256(abi.encode(maker));
        _isLabeled[index] = true;

        emit Labeled(index);
    }
}