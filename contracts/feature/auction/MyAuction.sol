// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _tokenId) external;
}

contract MyAuction {
    event Start(uint256 indexed startedAt);
    event Bid(address indexed bidder, uint256 amount);
    event Withdraw(address sender, uint256 balance);
    event End(address winner, uint256 finalPrice);

    IERC721 public immutable nft;
    uint256 public immutable tokenId;

    address payable public immutable seller;
    address public owner;

    /// @dev uint32 can save up to 100 years
    uint32 public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint256 public highestBid;
    mapping (address=>uint256) public bids;

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _; 
    }

    constructor (address _nft, uint256 _tokenId, uint256 _startingBid) {
        nft = IERC721(_nft);
        tokenId = _tokenId;
        seller = payable(msg.sender);
        highestBid = _startingBid;
        owner = msg.sender;
    }

    function startAuction() external {
        require(msg.sender == seller, "not seller");
        require(!started, "started");

        started = true;
        uint256 _startedAt = block.timestamp;

        /// @dev block.timestamp is uint256 typee
        endAt = uint32(block.timestamp + 60 seconds);

        nft.transferFrom(seller, address(this), tokenId);
        emit Start(_startedAt);
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "Auction ended");

        /// @dev msg.value: if bidder place a bid, that value should be higher than previous highest bid.
        require(highestBid < msg.value, "should be higher than last bid");

        if (highestBidder != address(0)) {
            /**
             * only one person wins auction. the bids map stores funds bet but not eligible for winning auction
             * and then later used to withdraw those funds bet
             * 
             */ 
            bids[highestBidder] += highestBid;
        }        

        /// @dev update bid information
        highestBid = msg.value;
        highestBidder = msg.sender; // when auction ends, nft will be transferred to bidder

        emit Bid(highestBidder, highestBid);
    }

    function withdraw() external onlyOwner {
        uint256 bal = bids[msg.sender];
        bids[msg.sender] = 0; // prevent reentrancy
        // withdraw best practice
        (bool success, ) = payable(msg.sender).call{value: bal}("");
        require(success, "withdrawl failed");
        emit Withdraw(msg.sender, bal); 
    }

    function endAuction() external {
        require(started, "not started");

        /// @dev default ended value is false
        require(!ended, "ended already"); 
        require(block.timestamp > endAt, "Auction not ended yet"); 

        ended = true;

        if (highestBidder != address(0)) {
            /// @dev send a NFT to bidder by transferring token id 
            nft.transferFrom(address(this), highestBidder, tokenId);

            /// @dev send ether to seller in exchange of NFT
            seller.transfer(highestBid);
        } else {
            /// @dev if zero address, send NFT back to seller
            nft.transferFrom(address(this), seller, tokenId);
        }

        emit End(highestBidder, highestBid);
    }
}