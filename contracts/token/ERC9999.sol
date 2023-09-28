// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC9999} from "../interface/IERC9999.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract ERC9999 is IERC9999, ERC165 {

    mapping (bytes32 => bool) _isLabeled;

    bytes4 private _MAGIC_VALUE; // 0x3e97de51
    
    constructor ()  {
        _MAGIC_VALUE = type(IERC9999).interfaceId;
    }

    function getInterfaceId() public view returns(bytes4) {
        return _MAGIC_VALUE;
    }

    function label(bytes32 index) external virtual override returns(bool) {
        return _isLabeled[index];
    }
    function unlabel(bytes32 index) external virtual override returns(bool) {
        return _isLabeled[index];
    }

    function supportsInterface(bytes4 interfaceId) public view override returns(bool) {
        return interfaceId == type(IERC9999).interfaceId || super.supportsInterface(interfaceId);
    }
}