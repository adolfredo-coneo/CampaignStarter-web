// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

/** 
 * @title CompaignFactory
 * @dev Implements Campaign Factory for campaign creation
 */
contract CompaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign =address(new Compaign(minimum, msg.sender));
        
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

/** 
 * @title Compaign
 * @dev Implements kickstarter like process along with campaign creation
 */
contract Compaign {
    struct Request {
      string description;
      uint value;
      address payable recipient;
      bool complete;
      uint approvalCount;
      mapping(address => bool) approvals;
    }
    
    address public manager;
    mapping(uint => Request) public requests;
    mapping(address => bool) approvers;
    uint public approversCount;
    uint public minimumContribution;
    uint public numRequests;
    
    
    
   modifier restricted() {
        require(manager == msg.sender);
        _;
   }    

   constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
   }
   
   function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
   }
   
   function createRequest(string memory description, uint value, address payable recipient) public restricted {
       Request storage newReq = requests[numRequests++];
       newReq.description = description;
       newReq.value = value;
       newReq.recipient = recipient;
       newReq.complete = false;
       newReq.approvalCount = 0;
   }
   
   function approveRequest(uint index) public {
      Request storage request = requests[index];
      
      require(approvers[msg.sender]);
      require(!request.approvals[msg.sender]);
      
      request.approvals[msg.sender] = true;
      request.approvalCount++;
   }
   
   function finalizeRequest(uint index) public restricted {
      Request storage request = requests[index];
      
      require(!request.complete);
      require(request.approvalCount > (approversCount / 2));
      
      request.recipient.transfer(request.value);
      request.complete = true;
   }
    
    
}
