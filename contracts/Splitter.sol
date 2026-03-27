// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
// STUDENT 1 — MAIN DELIVERABLE
// ============================================================
// Purpose: Accept ETH payments and automatically split them
//          between registered artists based on their percentages.
//
// WEEK 1 TASKS:
// ✔ Define the Artist struct (address + percentage)
// ✔ Write the constructor to set up the artists array
// ✔ Add the receive() function so the contract can accept ETH
// ✔ Write distribute() — loops over artists, sends each their share
//
// WEEK 2 TASKS:
// ✔ Add a products mapping: productId => CID string
// ✔ Write registerProduct(string cid) — stores CID on-chain
// ✔ Write getArtistBalance(address) — so the dashboard can read balances
// ✔ Add events for audit trail
// ✔ Write tests in /test/Splitter.test.js
//
// KEY CONCEPT — distribute() logic:
//   share = (msg.value * artist.percentage) / 100
//
// ⚠️ IMPORTANT: Percentages must add up to exactly 100.
// ============================================================

contract Splitter {

    // ============================================================
    // STRUCTS
    // ============================================================

    struct Artist {
        address payable wallet;
        uint256 percentage;
        uint256 totalReceived; // track earnings (for dashboard)
    }

    struct Product {
        string cid;        // IPFS hash (cryptographic proof)
        address creator;
        uint256 price;
    }

    // ============================================================
    // STATE VARIABLES
    // ============================================================

    Artist[] public artists;

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    // ============================================================
    // EVENTS (IMMUTABLE AUDIT TRAIL)
    // ============================================================

    event ProductRegistered(uint256 indexed id, string cid, address creator, uint256 price);
    event ProductPurchased(uint256 indexed id, address buyer, uint256 amount);
    event PaymentDistributed(uint256 totalAmount);

    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    constructor(address[] memory _artists, uint256[] memory _percentages) {
        require(_artists.length == _percentages.length, "Mismatched inputs");

        uint256 totalPercentage = 0;

        for (uint256 i = 0; i < _artists.length; i++) {
            artists.push(Artist(payable(_artists[i]), _percentages[i], 0));
            totalPercentage += _percentages[i];
        }

        require(totalPercentage == 100, "Total must be 100%");
    }

    // ============================================================
    // RECEIVE FUNCTION (ACCEPT ETH)
    // ============================================================

    receive() external payable {
        distribute();
    }

    // ============================================================
    // CORE LOGIC — DISTRIBUTE PAYMENTS
    // ============================================================

    function distribute() public payable {
        uint256 total = msg.value;

        require(total > 0, "No ETH sent");

        for (uint256 i = 0; i < artists.length; i++) {
            uint256 share = (total * artists[i].percentage) / 100;

            artists[i].wallet.transfer(share);

            // Track earnings
            artists[i].totalReceived += share;
        }

        emit PaymentDistributed(total);
    }

    // ============================================================
    // PRODUCT REGISTRATION (WEEK 2)
    // ============================================================

    function registerProduct(string memory _cid, uint256 _price) public {
        require(_price > 0, "Price must be greater than 0");

        products[productCount] = Product({
            cid: _cid,
            creator: msg.sender,
            price: _price
        });

        emit ProductRegistered(productCount, _cid, msg.sender, _price);

        productCount++;
    }

    // ============================================================
    // PRODUCT PURCHASE
    // ============================================================

    function buyProduct(uint256 _productId) public payable {
        Product memory product = products[_productId];

        require(bytes(product.cid).length > 0, "Product does not exist");
        require(msg.value == product.price, "Incorrect price");

        // Distribute funds
        distribute();

        emit ProductPurchased(_productId, msg.sender, msg.value);
    }

    // ============================================================
    // VERIFICATION FUNCTIONS
    // ============================================================

    function getProduct(uint256 _id) public view returns (string memory, address, uint256) {
        Product memory p = products[_id];
        return (p.cid, p.creator, p.price);
    }

    function getArtistBalance(address _artist) public view returns (uint256) {
        for (uint256 i = 0; i < artists.length; i++) {
            if (artists[i].wallet == _artist) {
                return artists[i].totalReceived;
            }
        }
        return 0;
    }
}