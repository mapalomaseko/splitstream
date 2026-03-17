// ============================================================
// STUDENT 2 — UTILITY HELPERS
// ============================================================
// Small helper functions used across the app.
// These are pure JS utilities — no React, no blockchain calls.
//
// TASKS:
// [ ] Write formatAddress() — shortens 0x1234...5678 for display
// [ ] Write formatEth() — converts wei to readable ETH string
// [ ] Write isValidAddress() — checks if a string is a valid ETH address
// ============================================================

import { ethers } from 'ethers';

// Shortens a wallet address for display: 0x1234...5678
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Converts ETH string to Wei (for sending transactions)
export function toWei(ethAmount) {
  return ethers.parseEther(ethAmount.toString());
}

// Converts Wei to ETH string (for displaying balances)
export function fromWei(weiAmount) {
  return ethers.formatEther(weiAmount);
}

// Checks if a string is a valid Ethereum address
export function isValidAddress(address) {
  return ethers.isAddress(address);
}
