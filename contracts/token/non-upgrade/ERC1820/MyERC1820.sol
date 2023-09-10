// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/introspection/ERC1820Implementer.sol";

contract MyERC1820 is ERC1820Implementer {
    /**
     * * ERC1820 has a separate registry contract holding whole interfaces
     * CA => interface AAA or
     * regular address => interface AAA
     *
     *
     * target address: a contract or EOA to declare interface
     * manager: declare a registry, which shows which contract/EOA implements specific interfaces
     * implementor: a smart contract implementing interface
     * registry: returns a specific interface's implementor address
     */
    function registerInterfaceForAddress(bytes32 interfaceHash, address account) public virtual {
        _registerInterfaceForAddress(interfaceHash, account);
    }
}
