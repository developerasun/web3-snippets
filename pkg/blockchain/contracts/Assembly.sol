// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract Assembly is ERC165 {
    uint256 public value = 99; // slot 0
    uint256 public directValue = 10; // slot 1

    string public name = "none";

    enum State {
        PENDING,
        SUCCESS,
        FAILURE
    }

    State enumState = State.FAILURE;

    // array and struct always starts at a new slot
    struct Map {
        uint8 small;
        uint128 medium;
        uint256 large;
    }

    Map public myMap = Map({small: 1, medium: 2, large: 3});

    event ValueChanged(uint256 indexed newValue);
    event Received(address sender, uint256 amount);

    function setValue(uint256 _value) public {
        value = _value;

        emit ValueChanged(_value);
    }

    function setName(string memory newName) public {
        name = newName;
    }

    function getMapPointerForUpdate() public {
        Map storage pointer = myMap;
        pointer.large *= 100;
    }

    function getValue() public pure returns (uint256) {
        return 4;
    }

    function getVersion() public pure returns (uint256) {
        return 2;
    }

    function getDirectValue() public view returns (uint256) {
        uint256 test = 100;

        assembly {
            let _value := sload(directValue.slot)
            test := _value
        }

        return test; // should be ten
    }

    ///  @dev return statement in assembly: return(relative address, data size)
    // 256 bits => 32 bytes (256/8 = 32)
    function addTwoValues(uint256 a, uint256 b) external pure returns (uint256) {
        assembly {
            mstore(0x00, add(a, b))
            return(0x00, 0x20) // (0x00, 0x10) ==> revert, (0x00, 0x40) ==> pass
        }
    }

    function getStateEnum() public view returns (State) {
        assembly {
            let foo := sload(enumState.slot)

            mstore(0x00, foo)
            return(0x00, 0x20) // should be two
        }
    }

    function setValueWithAssembly(uint256 _value) public {
        assembly {
            sstore(0x00, _value) // same with sstore(0, _value), targeting slot 0
        }
    }

    function getValueWithAssembly() public view returns (uint256 value_) {
        assembly {
            value_ := sload(0)
        }
    }

    function getStorageBySlot(uint256 index) public view returns (uint256 result) {
        assembly {
            result := sload(index)
        }
    }

    // free pointer memory
    function allocateAndReturn(uint256 length) public pure returns (uint256) {
        assembly {
            let current := msize() // return a current active memory
            let position := add(current, length) // in yul all types is bytes32
            mstore(position, length) // position - current = allocatable memory size for input

            return(position, 0x20) // return bytes32 size data
        }
    }

    function hash(uint256 a, uint256 b) public pure returns (bytes32) {
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            mstore(0x00, keccak256(0x00, 0x40))
            return(0x00, 0x20)
        }
    }

    function getHex() public pure returns (uint256 result) {
        assembly {
            result := 0xa
        }
    }

    function getCaller() public view returns (address who) {
        assembly {
            who := caller()
        }
    }

    function getNativeValue() public payable returns (uint256 _ether) {
        assembly {
            _ether := callvalue()
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getEmittedEvent() public payable {
        assembly {
            // let size := msize()
            // let pos := add(size, 0x40)

            let _sender := caller()
            let _amount := callvalue()

            mstore(0x00, _sender)
            mstore(0x20, _amount)

            // log3(start, size, topic hash, ...params)
            log1(0x00, 0x40, 0x88a5966d370b9919b20f3e2c13ff65706f196a4e32cc2c12bf57088f88525874)
        }
    }

    // topic hash: 0x88a5966d370b9919b20f3e2c13ff65706f196a4e32cc2c12bf57088f88525874
    receive() external payable {}
}
