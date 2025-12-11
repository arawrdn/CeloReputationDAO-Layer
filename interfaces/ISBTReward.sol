// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISBTReward {
    function hasSBT(address _user, uint256 _sbtTierId) external view returns (bool);
    function getHighestSBTLevel(address _user) external view returns (uint256);
}
