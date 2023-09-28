// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev should emit Labeled when labeled
 * @dev should emit UnLabeled when unlabeled
 */
interface IERC9999 {
    event Labeled(bytes32 index);
    event UnLabled(bytes32 index);

    function label(bytes32 index) external returns(bool);
    function unlabel(bytes32 index) external returns(bool);
}