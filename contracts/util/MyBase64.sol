// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Base64.sol"; // Base64 is a library

/// @dev Base64 is used to transform bytes memory into string memory
contract MyBase64 {
    function encodeJson() external pure returns(string memory) {
        string memory dataType = "data:application/json;base64";
        bytes memory metadata = abi.encodePacked(
            dataType, 
            "{", 
            "'name': 'developerasun'",
            "'description': 'smart contract developer'",
            "}"
        );

        return Base64.encode(metadata); // length: 124
    }

    /// @return base64Encoded value is YQ==
    function encodeOneCharacter() external pure returns(uint256, string memory) {
        string memory char = 'a';
        bytes memory encoded = abi.encodePacked(char);
        string memory base64Encoded = Base64.encode(encoded);
        return (encoded.length, base64Encoded);
    }
}

contract ABIstruct {
    struct Data {
        uint256 date;
        Owner owner;
    }

    struct Owner {
        string name;
        uint256 label;
    }

    function encodeStruct() external view returns(bytes memory){
        Owner memory _owner = Owner({
            name: "jake", 
            label: block.number
        });

        Data memory data = Data({
            date: block.timestamp, 
            owner: _owner
        });

        // abi.encode(data); // struct encoding working
        // abi.encodePacked(data); // struct encoding not working

        // As a rule of thumb, use bytes for arbitrary-length raw byte data and 
        // string for arbitrary-length string (UTF-8) data. If you can limit the length 
        // to a certain number of bytes, always use one of bytes1 to bytes32 
        // because they are much cheaper.
        bytes memory _data = abi.encode(data);

        return _data; // working
    }
}