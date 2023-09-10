// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev should approve even oneself to use safeTransferFrom
contract MyPlainERC20 is ERC20 {
    constructor(uint256 _initialSupply) ERC20("MyPlainERC20", "MP") {
        _mint(msg.sender, _initialSupply);
    }
}
