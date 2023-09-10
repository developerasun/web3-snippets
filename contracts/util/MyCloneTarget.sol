// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract MyTarget {

    mapping (address=>Data[]) public dataList;

    struct Data {
        bytes32 label;
        uint256 secrets; 
        uint256 date;
    }

    function addOneData(string memory _label, uint256 _secrets) external {
        bytes32 label_ = keccak256(abi.encode(_label));

        Data memory data = Data ({ 
            label: label_,
            secrets: _secrets, 
            date: block.timestamp
        });
        dataList[msg.sender].push(data);
    }
}