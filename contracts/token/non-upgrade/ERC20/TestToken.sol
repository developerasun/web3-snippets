// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// add polygon network(mainnet, mumbai) to wallet and deploy as it is
// fill out the wallet with matic before the deployment
// polygon block explorer: https://mumbai.polygonscan.com/
contract TestToken is ERC20 {
    string public author;

    constructor(string memory _author) ERC20("TestToken", "TT") {
        author = _author;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
