// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
// STUDENT 1 — MAIN DELIVERABLE
// ============================================================
// Purpose: Accept ETH payments and automatically split them
//          between registered artists based on their percentages.
//
// WEEK 1 TASKS:
// [ ] Define the Artist struct (address + percentage)
// [ ] Write the constructor to set up the artists array
// [ ] Add the receive() function so the contract can accept ETH
// [ ] Write distribute() — loops over artists, sends each their share
//
// WEEK 2 TASKS:
// [ ] Add a products mapping: productId => CID string
// [ ] Write registerProduct(string cid) — stores CID on-chain
// [ ] Write getArtistBalance(address) — so the dashboard can read balances
// [ ] Write tests in /test/Splitter.test.js for every function
//
// KEY CONCEPT — distribute() logic:
//   share = (msg.value * artist.percentage) / 100
//   payable(artist.wallet).transfer(share)
//
// ⚠️  IMPORTANT: Percentages must add up to exactly 100.
//     Add a check in the constructor that reverts if they don't.
// ============================================================

contract Splitter {

    // TODO: Define Artist struct here
    // struct Artist {
    //     address payable wallet;
    //     uint256 percentage;
    // }

    // TODO: Declare artists array here

    // TODO: Declare products mapping here

    // TODO: Write constructor here

    // TODO: Write registerProduct() here

    // TODO: Write distribute() here

    // TODO: Write receive() here — marks contract as payable
    // receive() external payable {
    //     distribute();
    // }
}
