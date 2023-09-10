// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @author @developerasun
/// @dev Dynamic data feeds generation with factory pattern
contract DataFeedFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _feedId;

    mapping(uint256 => AggregatorV3Interface) public feeds;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331

     * Aggregator: USDC/ETH
     * Address: 0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838

     * Aggregator: DAI/ETH
     * Address: 0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541
     *
     * Network: Mainnet
     * Aggregator: ETH/USD
     * Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
     *
     * Aggregator: USDC/ETH
     * Address: 0x986b5E1e1755e3C2440e960477f25201B0a8bbD4
     *
     * Aggregator: DAI/ETH
     * Address: 0x773616E4d11A78F511299002da57A0a94577F1f4

     * Network: Rinkeby
     * Aggregator: ETH/USD
     * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

     * Aggregator: USDC/ETH
     * Address: 0x986b5E1e1755e3C2440e960477f25201B0a8bbD4

     * Aggregator: DAI/ETH
     * Address: 0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D

     */
    function initDataFeeds(address _feed) external {
        AggregatorV3Interface feed = AggregatorV3Interface(_feed);
        uint256 current = Counters.current(_feedId);
        feeds[current] = feed;
        Counters.increment(_feedId);
    }

    /// @dev Overloading get price
    function getPrice(uint256 feedId) external view returns (int256) {
        //   (uint80 roundID, int256 price, uint256 startedAt, uint256 timeStamp, uint80 answeredInRound) = priceFeed.latestRoundData();
        (, int256 price, , , ) = feeds[feedId].latestRoundData();
        return price;
    }

    /**
     * @notice Returns the Price Feed address
     * @return Price Feed address
     */
    function getPriceFeed(uint256 feedId) public view returns (AggregatorV3Interface) {
        return feeds[feedId];
    }

    /**
     * @return Price Feed decimals
     */
    function getDecimals(uint256 feedId) external view returns (uint8) {
        return feeds[feedId].decimals();
    }

    function getVersion(uint256 feedId) external view returns (uint256) {
        return feeds[feedId].version();
    }

    /**
     * @return Price Feed name. e.g ETH / USD
     */
    function getDescription(uint256 feedId) external view returns (string memory) {
        return feeds[feedId].description();
    }
}
