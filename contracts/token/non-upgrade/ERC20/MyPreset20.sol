// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract MyPreset20 is ERC20PresetMinterPauser {
    /*
     * msg.sender becomes a minter and pauser.
     * default decimals is 18
     * getRoleMember, getRoleMemberCount
     * grantRole is access-controlled. default by msg.sender
     * revokeRole is to cancel an account's privilege
     * burnFrom requires an allowance, even when msg.sender is the owner of the balance. use approve or increaseAllowance to set allowance

     * minter role(bytes32) : 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
     * pauser role(bytes32) : 0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a
     */
    constructor()ERC20PresetMinterPauser("MyPreset20", "MY"){}
}