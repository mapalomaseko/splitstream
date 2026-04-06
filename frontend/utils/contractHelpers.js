
import { ethers } from 'ethers';

/**
 * Shortens a wallet address for display: 0x1234...5678
 * Used by S4S in Navbar.js and ConnectWallet.js.
 */
export function formatAddress(address) {
  if (!address || typeof address !== 'string') return '';
  // Ensures the string is long enough to slice
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Converts ETH string/number to Wei (BigInt)
 * Essential for buyProduct() and registerProduct() transactions[cite: 143].
 */
export function toWei(ethAmount) {
  if (!ethAmount) return 0n;
  try {
    return ethers.parseEther(ethAmount.toString());
  } catch (error) {
    console.error("Invalid ETH amount for conversion:", error);
    return 0n;
  }
}

/**
 * Converts Wei (BigInt) to a readable ETH string
 * Used for displaying the "Pending Balance" in the Artist Dashboard[cite: 25, 143].
 */
export function fromWei(weiAmount) {
  if (!weiAmount) return "0.0";
  try {
    return ethers.formatEther(weiAmount);
  } catch (error) {
    console.error("Invalid Wei amount for conversion:", error);
    return "0.0";
  }
}

/**
 * Checks if a string is a valid Ethereum address
 * Useful for validating artist addresses before S1K's contract tries to use them.
 */
export function isValidAddress(address) {
  return ethers.isAddress(address);
}

/**
 * Formats a decimal number to a fixed decimal place for cleaner UI
 * (Handy for S4S when displaying prices in the marketplace)
 */
export function formatDisplayEth(weiAmount, decimals = 4) {
  const eth = fromWei(weiAmount);
  return parseFloat(eth).toFixed(decimals);
}