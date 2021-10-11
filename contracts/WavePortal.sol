// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint totalWaves;
    uint private seed;

    //This stores the wallet address, time, and message from the smart contract wave.
    event NewWave(address indexed from, uint timestamp, string message);

    //This struct is titled " Wave". This is a custom datatype to customize the data we want to hold inside
    //the smart contract.
    struct Wave {
        string message; //The message the user sent.
        address waver; //The address of the user who waved.
        uint timestamp; //The timestamp when the user waved.
    }

    //This declares a variable named "waves" that lets you store an array of structs.
    //This stores every wave users send.
    Wave[] waves;

    //This is an address => unit mapping, meaning I can associate
    //an address with an number. In this case, I'm storing the address
    //with the last time the user waved at us.
    mapping(address => uint) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
    }

    function wave(string memory _message) public {
        //Makes sure the current timestamp is at least 15minutes greater than the
        //last timestamp stored.
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Wait 15m");
        //Updates the current user's timestamp.
        lastWavedAt[msg.sender] = block.timestamp;
        //The wave function requires a string called message. This is the message users will
        //send from the frontend.
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);
        console.log("Got Message: %s", _message);
        //This is where the wave data is stored in the array.
        waves.push(Wave(_message, msg.sender, block.timestamp));
        //Creates a random pseudo random number in the range 100.
        uint randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %s", randomNumber);
        //Sets the generated random number as the seed for the next wave.
        seed = randomNumber;
        //Gives a 50% chance that the user wins a prize.
        if(randomNumber < 50) {
            console.log("%s won!", msg.sender);
            //Sends the set Ethereum prize amount to users.
            uint prizeAmount = 0.0001 ether;
            //This checks that the Ethereum prize amount is less than the smart contract balance.
            //If the Ethereum prize amount is less than the smart contract balance, it sends the Ethereum 
            //prize amount.
            require(prizeAmount <= address(this).balance, "This contract needs more money!");
            (bool success,) = (msg.sender).call{value: prizeAmount}("");//This sends the Ethereum prize amount.
            require(success, "Sorry but, this failed.");//Thus confirms or denies the transaction.
     }
        //This allows the UI to update automatically after an event.
        emit NewWave(msg.sender, block.timestamp, _message);
        
    }
        //This returns the struct array waves, making them easy to retieve from the website.
        function getAllWaves() view public returns (Wave[] memory) {
        return waves;
        }

        function getTotalWaves() view public returns (uint) {
        return totalWaves;
        }
    
}
