// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "@openzeppelin/contracts/token/ERC20/utils/TokenTimelock.sol";
 
 /// @notice This is a working example of token being locked for some time
 /// @dev checked in Remix environment. requires test codes later.

contract MyTokenTimelock is TokenTimelock {

    /**
     * token 
     * Typical delay(block.timestamp + release time) is one day to three days for security reason.
     */    
    constructor(IERC20 token, address beneficiary, uint256 releaseTime) TokenTimelock(token, beneficiary, releaseTime) {}

    /// @param _token token address to lock
    /// @return check msg.sender's balance
    function getSenderTokenBalance(IERC20 _token) external view returns(uint256) {
        return _token.balanceOf(msg.sender);
    }

    /**
     * Before release, the token balance of this contract should be increased as much as
     * the amount of token being locked. Note that the balance is about token balance, not Ether one.
     * 
     * Once released:
     * contract token balance: decreased as much
     * token holder balance: increased as much
     */
    function getThisContractTokenBalance(IERC20 _token) external view returns(uint256) {
        return _token.balanceOf(address(this));
    }
}