// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Box {
    
    uint256 value = 0;
    uint256 directValue = 10; 

    event ValueChanged(uint256 indexed newValue);

    function setValue(uint256 _value) public {
        value = _value;
        
        emit ValueChanged(_value);
    }

    function getValue() public pure returns(uint256) {
        return 4;
    }

    function getVersion() public pure returns(uint256) {
        return 2;
    }

    function getDirectValue() public view returns(uint256) {
        uint256 test = 100;

        assembly { 
            let _value := sload(directValue.slot)
            test := _value
        }

        return test; // should be ten
    }

    ///  @dev return statement in assembly: return(relative address, data size)
    // 256 bits => 32 bytes (256/8 = 32) 
    function addTwoValues(uint256 a, uint256 b) external pure returns(uint256) {
        assembly { 
            mstore(0x00, add(a,b))
            return (0x00, 0x20) // (0x00, 0x10) ==> revert, (0x00, 0x40) ==> pass
        }
    }
}