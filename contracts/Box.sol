// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Box {
    
    uint256 value = 0;

    event ValueChanged(uint256 indexed newValue);

    function setValue(uint256 _value) public {
        value = _value;
        
        emit ValueChanged(_value);
    }

    function getValue() public pure returns(uint256) {
        return 4;
    }
}