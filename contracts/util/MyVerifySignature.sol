// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

/**
 * * EIP191
 * 1) create a message to sign
 * 2) hash the message
 * 3) signer signs the hashed message, creating a signature
 * 4) ecrecover(hashed message, signature) recovers a signer
 * 5) contract compares the signer in #3 and recovered signer in #4
 */

contract MyVerifySignature {
    uint256 public value = 0;
    event ValueChanged(uint256 indexed _value);

    function setValueBySig(
        uint256 _value,
        address _signer,
        string memory _message,
        bytes memory _signature
    ) public {
        require(verifyBySig(_signer, _message, _signature) == true, "MyVerifySignature: Invalid signature");
        value = _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }

    function verifyBySig(
        address _signer,
        string memory _message,
        bytes memory _signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recover(ethSignedMessageHash, _signature) == _signer;
    }

    function getMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function recover(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /// @dev signature length should be 65(v => 1 byte, r,s => 32 bytes => 1 + 32 + 32)
    /// @param _signature this is a pointer to signature.
    function splitSignature(bytes memory _signature)
        public
        pure
        returns (
            uint8 v,
            bytes32 r,
            bytes32 s
        )
    {
        require(_signature.length == 65);

        assembly {
            /// @dev move pointer to 32 bytes for half of signature: r
            r := mload(add(_signature, 32))

            /// @dev move pointer to 32 bytes for half of signature: s
            s := mload(add(_signature, 64))

            /// @dev move pointer to 32 bytes for recovery id, and assign 1 byte: v
            v := byte(0, mload(add(_signature, 96)))
        }
    }
}
