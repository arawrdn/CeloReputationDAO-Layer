// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/ISBTReward.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBTReward is ERC721, Ownable, ISBTReward {
    mapping(address => uint256) private userHighestSBTLevel;

    constructor() ERC721("CeloReputationSBT", "CRSBT") {
        // Assume basic ERC721 setup is here
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal pure override {
        require(from == address(0) || to == address(0), "CRSBT: Tokens are non-transferable (Soulbound)");
    }

    function mintSBT(address _to, uint256 _tierId) external onlyOwner {
        // Assume token ID mapping/logic is here, for simplicity we use _tierId to update the level
        
        uint256 nextTokenId = 1; // Placeholder for actual ID
        _safeMint(_to, nextTokenId); 
        userHighestSBTLevel[_to] = _tierId; 
    }

    function hasSBT(address _user, uint256 _sbtTierId) external view override returns (bool) {
        return userHighestSBTLevel[_user] >= _sbtTierId;
    }

    function getHighestSBTLevel(address _user) external view override returns (uint256) {
        return userHighestSBTLevel[_user];
    }
}
