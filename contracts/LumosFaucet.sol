// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract LumosFaucet {
    address owner; //contract deployer
    IERC20 token; //token address

    uint256 public withdrawalAmount = 3000000000000000000;

    mapping(address => uint256) lastAccessTime;

    constructor(IERC20 _tokenAddress) {
        owner = msg.sender;
        token = _tokenAddress;
    }

    function requestTokens() external {
        require(token.balanceOf(address(this)) >= withdrawalAmount,"Low faucet balance");
        require(block.timestamp >= lastAccessTime[msg.sender] + 24 hours, " Try again after 24 hours");

        lastAccessTime[msg.sender] = block.timestamp;
        token.transfer(msg.sender, withdrawalAmount);
    }

    function setWithdrawalAmount(uint256 amount) external  {
        require(msg.sender == owner,  "Only owner" );
        withdrawalAmount = amount * (10**18);
    }

    function isAccessibleToMint() external view returns(bool){
        if(block.timestamp >= lastAccessTime[msg.sender] + 24 hours){
            return true;
        }
        return false;
    }

    receive() external payable {}
}