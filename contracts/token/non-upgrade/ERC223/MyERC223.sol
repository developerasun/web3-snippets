// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract MyERC223 {
    /**
    * * The weakness of ERC20

    * * 1) It can be lost
    * ERC20 token can be lost if sent to a contract without a proper token protocol.
    * For example, below are the list of tokens that lost tons of ERC20 tokens.

    * 1. QTUM $1.2M
    * 2. EOS $1.1M
    * 3. GNT $0.25M

    Above functions neither does implement a proper token protocol nor does have a
    transfer function. 

    * * 2) Receiving smart contract cannot react to incoming ERC20 token transfer.

    * TODO see EIP223 author github here: https://github.com/Dexaran/ERC223-token-standard
     */
}
