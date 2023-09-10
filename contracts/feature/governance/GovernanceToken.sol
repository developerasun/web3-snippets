// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20, ERC20Permit, ERC20Votes {
    uint256 public maxSupply = uint256(1000000 * 10**decimals());

    constructor() ERC20("GovernanceToken", "GT") ERC20Permit("GovernanceToken") {
        // _msgSender is preferred over msg.sender
        _mint(_msgSender(), maxSupply);
    }

    /// @dev call _afterTokenTransfer to make sure voting checkpoint is updated  in ERC20Votes
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);

        /// @dev below lines are called in ERC20Votes' _afterTokenTransfer
        // super._afterTokenTransfer(from, to, amount);
        // _moveVotingPower(delegates(from), delegates(to), amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}
