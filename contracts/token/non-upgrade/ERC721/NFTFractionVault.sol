// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol"; // make this contract ERC721 receivable

contract NFTFractionVault is ERC20, Ownable, ERC20Permit, ERC721Holder {
    IERC721 public collection;
    bool public initialized = false;
    bool public forSale = false;
    bool public canRedeem = false;
    uint256 public tokenId;
    uint256 public salePrice;

    constructor() ERC20("NFTFractionVault", "MTK") ERC20Permit("NFTFractionVault") {}

    function initialize(
        address _collection,
        uint256 _tokenId,
        uint256 _amount
    ) external onlyOwner {
        require(!initialized, "Already initialized");
        require(_amount > 0, "Not enough amount");
        collection = IERC721(_collection);

        // user send their NFT to this contract
        collection.safeTransferFrom(msg.sender, address(this), _tokenId);
        tokenId = _tokenId;
        initialized = true;

        // then get ERC20 token in return as reward
        _mint(msg.sender, _amount);
    }

    function putForSale(uint256 price) external onlyOwner {
        salePrice = price;
        forSale = true;
    }

    function purchase() external payable {
        require(forSale, "Not for sale");
        require(msg.value >= salePrice, "Not enough ether");
        collection.transferFrom(address(this), msg.sender, tokenId);
        forSale = false;
        canRedeem = true;
    }

    function redeem(uint256 _amount) external {
        require(canRedeem, "Redemption not available");
        uint256 totalEther = address(this).balance;
        uint256 toRedeem = (_amount * totalEther) / totalSupply();

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(toRedeem);
    }
}
