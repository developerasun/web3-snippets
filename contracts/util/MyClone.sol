// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/proxy/Clones.sol";

/// @dev Clone is a library used to deploy a minimal proxy contract
contract MyClone {

    /**
     * Prototyped in Remix, deployed to Goerli
     * Target contract to clone:   0x9c48eaFb553eF85Bc517F7d2b3c8e1Fa82a3f093
     * Cloner contract: 0xbb536Ba97AB6a6dE46B4018B768647d0140E125f
     * Cloned contract by the Cloner: 0xdDD97d41ED933D1156217F3510eC44E5C44F1A57
     */
    event CloneAddress(address indexed _clone);

    function genClone(address impl) external returns(address){
        address instance = Clones.clone(impl);
        emit CloneAddress(instance);
        return instance;
    }
}