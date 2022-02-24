// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract CrowdFunding{
  using Counters for Counters.Counter;
  Counters.Counter private _roundIds;
  uint private totalContributers;
  uint public totalRaised;
  address public owner;
  mapping(address => uint) public contributions;
  
  constructor(){
    owner = msg.sender;
  }

  struct Round{
    string name;
    string desc;
    uint roundId;
    uint minContribution;
    uint deadline;
    uint targetAmt;
    uint raisedAmt;
    bool completed;
    address payable recipient;
    uint contributers;
  }
  mapping(uint => Round) public idToRound;

  function createRound(
    string memory _name, 
    string memory _desc, 
    uint _minContribution,
    uint _deadline,
    uint _targetAmt,
    address payable _recipient
    
  ) public returns (uint) {
    _roundIds.increment();
    uint roundId = _roundIds.current();

    idToRound[roundId] = Round(
      _name, 
      _desc,
      roundId,
      _minContribution,
      block.timestamp + _deadline,
      _targetAmt,
      0,
      false,
      _recipient,
      0
    );
    
    // can emit an even as well
    return roundId;
  }

  function fundRound(uint _roundId) public payable {
    
    Round storage round = idToRound[_roundId];
    require(!round.completed, "round has been closed");
    require(round.minContribution <= msg.value, "Min contribution is not met");
    require(round.deadline >= block.timestamp, "deadline exceeded");

    round.recipient.transfer(msg.value);
    round.raisedAmt += msg.value;
    round.contributers += 1;
    console.log("=================== raised amt ===================", round.raisedAmt);
    totalRaised += msg.value;
    contributions[msg.sender] += msg.value;

    if(round.raisedAmt > round.targetAmt){
      round.completed = true;
    }

    if(contributions[msg.sender] == 0){
      totalContributers += 1;
    }
  }

}