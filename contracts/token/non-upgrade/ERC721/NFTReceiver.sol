// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTReceiver is ERC721 {
    constructor() ERC721("NFTReceiver", "LN") {}

    struct NFT {
        address operator;
        address from;
        uint256 tokenId;
        bytes data;
    }

    mapping(uint256 => NFT) public nftList; // tokenId => NFT

    /**
     * this will inherit supportsInterface and tokenURI
     * always use _safeMint whenever possible.
     */
    function mint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    /**
     * receive NFT and store it in mapping.
     * when transferring NFT, there are two assumptions.
     * 1) msg.sender must transfer the token to the contract where IERC721Receiver is implemented
     * 2) msg.sender must transfer the token using safeTransferFrom.
     * return IERC721Receiver.onERC721Received.selector must return this value.
     * You can simply receive and do nothing like below.
            function onERC721Received(
                address,
                address,
                uint256,
                bytes memory) public virtual override returns (bytes4) {
                    return this.onERC721Received.selector;
            }
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) private returns (bytes4) {
        NFT memory nft = NFT({operator: operator, from: from, tokenId: tokenId, data: data});
        nftList[tokenId] = nft;
        return IERC721Receiver.onERC721Received.selector; // must return this value.
    }
}
