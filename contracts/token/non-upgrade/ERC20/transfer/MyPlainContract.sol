// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import path destructuring in Solidity
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev plain contract can receive ERC20
/// @dev careful not to forget to add withdraw function for the ERC20
contract MyPlainContract {

    function getTokenBalance(IERC20 token, address account) public view returns(uint256) { 
        return token.balanceOf(account);
    }
}