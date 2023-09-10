// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract MyFirstERC1155 is ERC1155, ERC1155Holder {

    /// @dev below represents each token
    // see OZ ERC1155 tutorials 
    // uint256 public constant GOLD = 0;
    // uint256 public constant SILVER = 1;
    // uint256 public constant THORS_HAMMER = 2;
    // uint256 public constant SWORD = 3;
    // uint256 public constant SHIELD = 4;

    enum TokenList {
        GOLD, 
        SILVER, 
        THORS_HAMMER,
        SWORD,
        SHIELD
    }

    /**

     # DECIMALS 

        * ERC721, ERC1155 do not have decimals
     
     # MINT

        * If 100 tokens should be minted, 
        * wrong: _mint(msg.sender, GOLD, 100 * uint256(10 ** decimals()))
        * correct: _mint(msg.sender, GOLD, 10 ** 2)

     # METADATA

        * Metadata URI is queried using public uri function
        * and the uri function alaways returns a _uri regardless of parameters: "https://game.example/api/item/{id}.json"
        * demanding client to replace an actual token id. 
        * The token is in lowercase hexadecimal (with no 0x prefix) and leading zero padded to 64 hex characters.
        * e.g: to fetch token id 2 json file, you will have to request like below.
            https://game.example/api/item/0000000000000000000000000000000000000000000000000000000000000002.json

     # TOKEN TRANSFER

        * Just like ERC777, ERC 1155 also has a receive hook.
        * Remember that you need to indenpendently implmenent both token receivability
        * and token withdrawability. Otherwise, 
            1) the token sent would be lost
            2) the token received would get stuck.
    
     */
    constructor(string memory _uri) ERC1155(_uri) {
        _mint(msg.sender, convertToUint(TokenList.GOLD), 10**18, ""); // fungible
        _mint(msg.sender, convertToUint(TokenList.SILVER), 10**27, ""); // fungible
        _mint(msg.sender, convertToUint(TokenList.THORS_HAMMER), 1, ""); // non-fungible
        _mint(msg.sender, convertToUint(TokenList.SWORD), 10**9, ""); // fungible
        _mint(msg.sender, convertToUint(TokenList.SHIELD), 10**9, ""); // fungible
    }

    function convertToUint(TokenList _token) private pure returns(uint256) {
        return uint256(_token);
    }

    /**

     # Token receive inheritance

        MyFirstERC1155 <=== ERC1155Holder <=== ERC1155Receiver <=== IERC1155Receiver
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Receiver) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }
}