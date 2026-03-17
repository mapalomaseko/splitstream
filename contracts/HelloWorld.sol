// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
// STUDENT 1 — WEEK 1 PRACTICE CONTRACT
// ============================================================
// Purpose: Test that the full pipeline works.
//          Deploy this first to confirm Student 3's setup is correct.
//
// TASKS:
// [ ] Deploy this to the local Hardhat network (Student 3 does the deploy)
// [ ] Confirm Student 2 can READ the 'message' variable from the frontend
// [ ] Delete this file before the final demo — it's just for practice
// ============================================================

contract HelloWorld {
    // A public variable — anyone can read this from the frontend
    string public message = "The blockchain art platform is alive!";

    // A function to update the message (good practice for write transactions)
    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }
}
