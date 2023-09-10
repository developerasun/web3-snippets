// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Address.sol";

contract MyIsContract {
    using Address for address;

    /**
     *
     * It is unsafe to assume that an address for which this function returns false is an externally-owned account (EOA) and not a contract.
     * Among others, isContract will return false for the following types of addresses:
     
     * an externally-owned account
     * a contract in construction
     * an address where a contract will be created
     * an address where a contract lived, but was destroyed

     */
    function checkAccount(address _object) public view returns(bool) {
        return _object.isContract();
    }    
}