// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./MyPermitToken.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "hardhat/console.sol";

contract MyPermitVault {
    MyPermitToken public immutable token;

    constructor(MyPermitToken _token) {
        token = _token;
    }

    function verifyPermissionAndTransfer(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        // increase ERC20 allowance if signature is correct
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        token.transferFrom(msg.sender, address(this), amount);
    }

    function getContractTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
