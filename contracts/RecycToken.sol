// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RecycToken is ERC20 {
    mapping(address => string) private usernames; // Mapping of wallet addresses to usernames

    constructor() ERC20("Recycle Credit", "RC") {}

    //  Struct to store recycling history (amount, timestamp, item)
    struct RecyclingRecord {
        uint256 amount;
        uint256 timestamp;
        string item; //  Added item name
    }

    //  Mapping to store user recycling history
    mapping(address => RecyclingRecord[]) private recyclingHistory;

    //  Allow any user to earn tokens and store the recycling record
    function rewardUser(address user, uint256 amount, string memory item) public {
        _mint(user, amount);
        recyclingHistory[user].push(RecyclingRecord(amount, block.timestamp, item));
    }

    // Retrieve a user's recycling history
    function getRecyclingHistory(address user) public view returns (RecyclingRecord[] memory) {
        return recyclingHistory[user];
    }

    // Set or update username for a wallet address
    function setUsername(string memory _username) public {
        usernames[msg.sender] = _username;
    }

    // Get username associated with a wallet address
    function getUsername(address user) public view returns (string memory) {
        return usernames[user];
    }

    // Redeem tokens
    function redeemTokens(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to redeem");
        _burn(msg.sender, amount);
    }
}
