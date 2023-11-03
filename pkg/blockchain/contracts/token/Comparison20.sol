// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC20.sol";

// check token holder count for each method
// with Transfer event: count increased
// without Transfer event: count not increased on block explorer
contract Comparison20 is ERC20 {
    constructor () ERC20("Comparison20", "CP20") {}

    function mintWithTransfer(address account, uint256 amount) public {
        return super._mint(account, amount);
    }

    function mintWithoutTransfer(address account, uint256 amount) public {
        return super.__mint(account, amount);
    }
}