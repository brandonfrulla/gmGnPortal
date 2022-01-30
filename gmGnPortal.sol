// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract gmGnPortal {

    uint256 numGMs;
    uint256 numGNs;

    event NewGm(address indexed from, uint256 timestamp, string message);
    event NewGn(address indexed from, uint256 timestamp, string message);

    struct Gm {
        address gmer;
        string message;
        uint256 timestamp;
    }

    struct Gn {
        address gner;
        string message;
        uint256 timestamp;
    }

    Gm[] gms;
    Gn[] gns;

    constructor() {
        console.log("Deploying smart contract...");
    }

    function sayGM(string memory _message) public {
        numGMs += 1;
        console.log("%s has GM-d w/ message %s", msg.sender, _message);
        gms.push(Gm(msg.sender, _message, block.timestamp));
        emit NewGm(msg.sender, block.timestamp, _message);
    }

    function sayGN(string memory _message) public {
        numGNs += 1;
        console.log("%s has GN-d w/ message %s", msg.sender, _message);
        gns.push(Gn(msg.sender, _message, block.timestamp));
        emit NewGn(msg.sender, block.timestamp, _message);
    }

    function getAllGMs() public view returns (Gm[] memory) {
        return gms;
    }

    function getAllGNs() public view returns (Gn[] memory) {
        return gns;
    }


    function getTotalGMs() public view returns (uint256) {
        console.log("We have %d total GMs!", numGMs);
        return numGMs;
    }

    function getTotalGNs() public view returns (uint256) {
        console.log("We have %d total GNs!", numGNs);
        return numGNs;
    }
}