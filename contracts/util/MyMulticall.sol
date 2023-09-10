// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/Multicall.sol";

contract TestMulticall {
    function func1() external view returns(uint256, uint256) {
        return (1, block.timestamp);
    }
    function func2() external view returns(uint256, uint256) {
        return (2, block.timestamp);
    }

    function getData1() external pure returns(bytes memory) {
        // abi.encodeWithSignature => use function string signature
        return abi.encodeWithSignature("func1()"); // return data from func 1 in bytes format 
    }

    function getData2() external pure returns(bytes memory) {
        // abi.encodeWithSelector => use function identifier
        return abi.encodeWithSelector(this.func2.selector); // return data from func 2 in bytes format 
    }
}

contract MyMulticall {

    /// @dev abi.encodeWithSelector: encodes data that will be sent and returns a encoded data in bytes memory 
    /// @dev abi.encodeWithSelector(bytes4, arg): bytes4 => choose a function to execute with function selector
    /// @return returned data should be the same with that of TestMulticall of getData1()
    function getTestMulticallFunc1Data() external pure returns(bytes memory) {
        return abi.encodeWithSelector(TestMulticall.func1.selector); // no param for func 1
    }

    /// @return returned data should be the same with that of TestMulticall of getData2()
    function getTestMulticallFunc2Data() external pure returns(bytes memory) {
        return abi.encodeWithSelector(TestMulticall.func2.selector); // no param for func 2
    }

    function getOneNumber() external pure returns(uint256) {
        return 6;
    }

    function getOneCharacter() external pure returns(bytes memory) {
        return abi.encodePacked("a");
    }

    function getMyMulticallGetOneCharacterData() external pure returns(bytes memory) {
        return abi.encodeWithSelector(this.getOneNumber.selector);
    }

    function getMyMulticallGetOneNumber() external pure returns(bytes memory) {
        return abi.encodeWithSelector(this.getOneCharacter.selector);
    }

    // overriding OZ's multicall
    function multiStaticcallFromThisContract(bytes[] calldata data) external view returns(bytes[] memory) {

        bytes[] memory _data = new bytes[](data.length); // container for function execution result

        for (uint256 i=0; i<data.length; i++) {
            _data[i] = Address.functionStaticCall(address(this), data[i]);// address(this) => this.delegatecall with calldata 'data'
        }

        return _data;
    }

    // below is an example to understand underlying logics
    /// @param targets callee contract => In Remix, inputs be like: ["0x123", "0x345" ...]
    /// @param data encrypted/encoded data that will be put into address.call as parameter, inputs be like: ["000001", "000002"]
    function multiStaticcallFromAnotherContract(address[] calldata targets, bytes[] calldata data)  external view returns(bytes[] memory) {
        require(targets.length == data.length);
        bytes[] memory results = new bytes[](data.length);  // collect the return values from external function call in array

        for (uint256 i; i<targets.length; i++) {
            // a special variant of message call: 1) call 2) staticcall 3) delegatecall
            // 3) delegatecall: dynamic code load from different contract at runtime. only the code is taken
            // the dynamic code execution makes possible 'library' feature

            // address.staticcall(bytes[] memory): returns (bool, bytes memory data). 
            // staticall is used to query/read data from blockchain
            (bool success, bytes memory result) = targets[i].staticcall(data[i]);
            require(success, "staticcall failed");
            results[i] = result;
        }

        return results;
    }

}