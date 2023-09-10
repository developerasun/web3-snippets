// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/// @dev ERC777 is not deployable in Remix IDE
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

/// @dev Remix IDE does not support ERC777 deployment (as of Aug, 2022)
contract MyFirstERC777 is ERC777 {
    /**
     * receive hook: prevent user error (revert if callee contract not implementing token interface)
     * decimals in ERC777 is fixed as 18
     * operator and token holder: operator can execute token transfer if authorized
     * operator can use: operatorSend, operatorBurn
     * operator access control is: authroizeOperator, isOperatorFor, revokeOperator
     * operator must have enough tokens and ether for transaction execution
     */

    event TokenReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event TokenSent(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);

    constructor(uint256 initialSupply, address[] memory defaultOperator) ERC777("MyFirst777", "MF", defaultOperator) {
        initERC1820Registry();
        _mint(msg.sender, initialSupply * uint256(10**decimals()), "", "");
    }

    function mint(
        address _account,
        uint256 _amount,
        bytes memory _userData,
        bytes memory _operatorData
    ) public {
        _mint(_account, _amount, _userData, _operatorData);
    }

    function getInterfaceId() external pure returns (bytes4) {
        return type(IERC777).interfaceId;
    }

    /**
     * * To receive ERC777, a receiving contract should implement IERC721Recipient and
     * * register the receiving contract as interface implementer to ERC1820Registry.
     */
    function initERC1820Registry() private {
        bytes32 recipientHash = _ERC1820_REGISTRY.interfaceHash("ERC777TokensRecipient");
        bytes32 senderHash = _ERC1820_REGISTRY.interfaceHash("ERC777TokensSender");
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), recipientHash, address(this));
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), senderHash, address(this));
    }

    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes memory userData,
        bytes memory operatorData
    ) public virtual {
        emit TokenReceived(operator, from, to, amount, userData, operatorData);
    }

    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public {
        emit TokenSent(operator, from, to, amount, userData, operatorData);
    }

    /// @dev should be able to check the received token
    function checkReceivedTokenBalance(address _token, address _account) public view returns (uint256) {
        IERC777 token = IERC777(_token);
        return token.balanceOf(_account);
    }

    /// @dev should be able to withdraw the received token
    function withdrawReceivedToken(
        address _token,
        address _to,
        uint256 _amount
    ) public {
        IERC777 token = IERC777(_token);
        token.send(_to, _amount, "");
    }
}
