// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/ISBTReward.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteManager is Ownable {
    address private immutable sbtRewardAddress;
    address private immutable governanceTokenAddress;
    
    mapping(uint256 => uint256) private reputationMultipliers; // SBT Tier => Multiplier (e.g., 1=1.1x, 2=1.5x)
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Proposal ID => User Address => Voted

    struct Proposal {
        uint256 id;
        uint256 againstVotes;
        uint256 forVotes;
        bool active;
    }

    Proposal[] public proposals;

    constructor(address _sbtReward, address _governanceToken) {
        sbtRewardAddress = _sbtReward;
        governanceTokenAddress = _governanceToken;

        // Example multipliers: Tier 1 gives 10% extra weight, Tier 2 gives 50% extra
        reputationMultipliers[1] = 110; 
        reputationMultipliers[2] = 150; 
        reputationMultipliers[3] = 200; // 2x weight
    }

    function createProposal() external {
        uint256 proposalId = proposals.length;
        proposals.push(Proposal(proposalId, 0, 0, true));
    }

    function getVotingPower(address _user) public view returns (uint256) {
        uint256 stakedTokens = IERC20(governanceTokenAddress).balanceOf(_user);
        
        ISBTReward sbt = ISBTReward(sbtRewardAddress);
        uint256 highestSBTLevel = sbt.getHighestSBTLevel(_user);

        uint256 multiplier = reputationMultipliers[highestSBTLevel];
        if (multiplier == 0) {
            multiplier = 100; // Default multiplier is 100 (1x)
        }

        // Voting Power = (Staked Tokens * Multiplier) / 100
        return (stakedTokens * multiplier) / 100; 
    }

    function vote(uint256 _proposalId, bool _support) external {
        require(proposals[_proposalId].active, "Proposal is not active");
        require(!hasVoted[_proposalId][msg.sender], "Already voted on this proposal");

        uint256 power = getVotingPower(msg.sender);
        require(power > 0, "No voting power");

        if (_support) {
            proposals[_proposalId].forVotes += power;
        } else {
            proposals[_proposalId].againstVotes += power;
        }

        hasVoted[_proposalId][msg.sender] = true;
    }

    // Add functions for closing proposals, executing results, etc.
}
