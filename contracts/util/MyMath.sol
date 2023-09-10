// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/math/SafeMath.sol"; 

/// @dev SafeMath is generally not needed for Solidity +0.8. And This version of SafeMath(the one with tryXXX)
/// should be used with Solidity +0.8 since the library relies on compiler. 
contract Mymath {
    using SafeMath for uint256;

    function add(uint256 _a, uint256  _b) public pure returns(bool, uint256) {
        return _a.tryAdd(_b);
    }

    function sub(uint256 _a, uint256 _b) public pure returns(bool, uint256) {
        return _a.trySub(_b);
    }

    function mul(uint256 _a, uint256 _b) public pure returns(bool, uint256) {
        return _a.tryMul(_b);
    }

    /// @dev divisor should be bigger than 0. returns a quotient
    /// @dev 3 / 2 = 1 ... 1 => 3: dividend, 2: divisor, 1: quotient, ...1: remainder 
    function div(uint256 _a, uint256 _b) public pure returns(bool, uint256) {
        return _a.tryDiv(_b);
    }

    /// @dev returns a remainder
    function mod(uint256 _a, uint256 _b) public pure returns(bool, uint256){
        return _a.tryMod(_b);
    }
   
}