// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "hardhat/console.sol";

contract MyPermitToken is ERC20, ERC20Permit {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) ERC20Permit(name) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // enroll counter in storage and get a current counter
    function getNonce(address account) public returns(uint256) {
        uint256 nonce = super._useNonce(account);
        return nonce;
    }
}
