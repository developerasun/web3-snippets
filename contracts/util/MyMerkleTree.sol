// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * merkle tree data structure enables a user to ensure that
 * a certain data is included in a set of data.

 * how it works
 * 1. There are pending transactions sent to network
 * 2. Create a merkle tree and calculate merkle root hash
 * 3. The root hash is included into a block
 * 4. User can ensure if his/her tx is included or not by calculating root hash

 */
contract MyMerkleTree {
    /**
     * Assume that you have a merkle tree like below
     *   6
     *  4 5
     * 1 2 3

           7
         5   6 
     => 1 2 3 4
     left: current hash, right: proof element. e.g) 1: current hash 2: proof element
     */

    /// @param proof cryptographic proofs, array of hashes
    /// @param root merkle tree root
    /// @param leaf merkle tree leaves, an element in the hash array
    /// @param index index of the array
    /// @return a result of data integrity
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf,
        uint256 index
    ) public pure returns (bool) {
        bytes32 _hash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            if (index % 2 == 0) {
                _hash = keccak256(abi.encodePacked(_hash, proof[i]));
            } else {
                _hash = keccak256(abi.encodePacked(proof[i], _hash));
            }
            index = index / 2; // get quotient of two and round down to nearest integer
        }

        return _hash == root;
    }

    function verifyWithOZ(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) public pure returns (bool) {
        
        return MerkleProof.verify(proof, root, leaf);
    }
}

contract TestMerkleProof {
    bytes32[] public hashes;

    constructor() {
        /**
         * 4 transactions => 6 merkle tree leaves
         *    6
         *  4   5
         * 1 2 3 4
         * thus the arrya hashes' length becomes 6.
         */
        string[4] memory transactions = ["alice -> bob", "bob -> dave", "carol -> alice", "dave -> bob"];

        for (uint256 i = 0; i < transactions.length; i++) {
            hashes.push(keccak256(abi.encodePacked(transactions[i])));
        }

        uint256 n = transactions.length;
        uint256 offset = 0;

        // if n == 5
        // 0, 1,2,3 => 0, 2
        // n = 2, offset = 5
        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                hashes.push(keccak256(abi.encodePacked(hashes[offset + i], hashes[offset + i + 1])));
            }
            offset += n;
            n = n / 2;
        }
    }

    function getRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }

    /* verify
    3rd leaf
    0xdca3326ad7e8121bf9cf9c12333e6b2271abe823ec9edfe42f813b1e768fa57b

    root
    0xcc086fcc038189b4641db2cc4f1de3bb132aefbd65d510d817591550937818c7

    index
    2

    proof
    0x8da9e1c820f9dbd1589fd6585872bc1063588625729e7ab0797cfc63a00bd950
    0x995788ffc103b987ad50f5e5707fd094419eb12d9552cc423bd0cd86a3861433
    */
}
