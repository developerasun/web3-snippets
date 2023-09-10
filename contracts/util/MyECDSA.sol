// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @dev hashing and signing: EIP 191, EIP 712
contract MyECDSA {
    using ECDSA for bytes32;

    /**
     * * Verify if a recovered address is the same with the message signer.
     * get signature with ethers js, for example, 
     const hashedMessage = ethers.utils.hashMessage('jake') // hashedData
     const signature = address.signMessage(hashedMessage)

     * metamask/eth-sig-util's personal sign appends eth sign prefix: \x19Ethereum Signed Message:\n32
     * ethers.utils.hashMessage appends eth sign prefix: \x19Ethereum Signed Message:\n 
     
     */
    function verify(
        bytes32 hashedData,
        bytes memory signature,
        address messageSigner
    ) public pure returns (bool) {
        // toEthSignedMessageHash: adds ethereum sign prefix
        // In Solidity, the prefix is: '\x19Ethereum Signed Message:\n32' for bytes32 hash,
        // or '\x19Ethereum Signed Message:\n' for bytes memory hash
        bytes32 signedMessage = ECDSA.toEthSignedMessageHash(hashedData);
        address recoveredAddress = signedMessage.recover(signature);
        return recoveredAddress == messageSigner ? true : false;
    }
}
