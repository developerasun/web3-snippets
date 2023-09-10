// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/** 
 @dev merkle tree example. only verified account can change value in NFT contract
 @dev using merkletree can reduce the number of on-chain transaction by setting merkle root hash once
 @dev and then compare a proof of target leaf

 * root: root hash computed off-chain. use merkletreejs and ethersjs for this.
 * proof: a bytes32 array containing sibling hashes from leaf to root
 * leaf: target to verify
*/

contract WhitelistSale is ERC721 {
    uint256 public value = 0;
    bytes32 public merkleRoot;

    constructor(bytes32 _merkleRoot) ERC721("WhitelistSale", "WS") {
        merkleRoot = _merkleRoot;
    }

    function setValueByMerkleTree(
        uint256 _value,
        bytes32[] memory proof,
        bytes32 leaf
    ) public {
        require(verify(proof, leaf) == true, "WhitelistSale: Non-whiltelist");
        value = _value;
    }

    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     */
    function verify(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
}
