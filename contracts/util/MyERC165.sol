// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

interface IMyChecker {
    function getName() external view returns (string memory);
}

contract MyChecker is IMyChecker, ERC165 {
    address private immutable _CACHED_THIS = address(this);
    string private _CACHED_NAME = type(MyChecker).name;
    bytes4 private _CACHED_INTERFACE_ID = type(IMyChecker).interfaceId;

    uint256 public value = 0;

    using ERC165Checker for address;

    /// @notice a function that checks is a call is from the caller contract
    function getName() public view returns (string memory) {
        return _CACHED_NAME;
    }

    function getInterfaceID() public view returns (bytes4) {
        return _CACHED_INTERFACE_ID;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == _CACHED_INTERFACE_ID || super.supportsInterface(interfaceId);
    }

    function getMessageSender() public view returns (address) {
        return msg.sender;
    }

    function setValue(uint256 _value, bytes4 interfaceId) public {
        require(msg.sender.supportsInterface(interfaceId), "Should implement IMyChecker");
        value = _value;
    }
}

contract ThirdPartyContract {
    /// @dev transaction is done even when it is not successful
    function failingSetValue(
        address _myChecker,
        uint256 _value,
        bytes4 interfaceId
    ) public returns (bool, bytes memory) {
        (bool result, bytes memory data) = _myChecker.call(abi.encodeWithSelector(MyChecker.setValue.selector, _value, interfaceId));
        require(result, "op failing");
        return (result, data);
    }

    /// @dev transaction is done even when it is not successful
    function getMessageSender(address _myChecker) public view {
        (bool result, ) = _myChecker.staticcall(abi.encodeWithSelector(MyChecker.getMessageSender.selector));
        require(result, "op failing");
    }
}

contract ThirdPartyContract2 is IMyChecker, ERC165 {
    function successfulSetValue(
        address _myChecker,
        uint256 _value,
        bytes4 interfaceId
    ) public returns (bool, bytes memory) {
        (bool result, bytes memory data) = _myChecker.call(abi.encodeWithSelector(MyChecker.setValue.selector, _value, interfaceId));
        require(result, "op failing");
        return (result, data);
    }

    function getMessageSender(address _myChecker) public view {
        (bool result, ) = _myChecker.staticcall(abi.encodeWithSignature("getMessageSender()"));
        require(result, "op failing");
    }

    // overriding requirements
    function getName() public pure override returns (string memory) {
        return type(ThirdPartyContract2).name;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return type(IMyChecker).interfaceId == interfaceId || super.supportsInterface(interfaceId);
    }
}

contract MyInterfaceChecker is ERC721Holder {
    using ERC165Checker for address;

    bytes4 private InterfaceId_ERC721 = 0x80ac58cd;

    /**
     * @dev transfer an ERC721 token from this contract to someone else
     */
    function transferERC721(
        address token,
        address to,
        uint256 tokenId
    ) public {
        require(token.supportsInterface(InterfaceId_ERC721), "IS_NOT_721_TOKEN");
        IERC721(token).transferFrom(address(this), to, tokenId);
    }
}
