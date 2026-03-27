// ============================================================
// STUDENT 2 (S2M) — WALLET & TRANSACTION LEAD
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
// S3A provides this ABI after running 'npx hardhat compile' 
import Splitter from '../abi/Splitter.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * WEEK 1: Connect Wallet Logic [cite: 36, 143]
   * Asks MetaMask to connect and stores the signer for transactions.
   */
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed. Please install it to use SplitStream.");
      return;
    }

    try {
      setIsConnecting(true);
      // Request account access [cite: 39]
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);

      // Setup Ethers Provider & Signer [cite: 16, 124]
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance using S3A's env variable 
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const splitterContract = new ethers.Contract(
        contractAddress,
        Splitter.abi, // Ensure you reference the .abi property [cite: 21]
        signer
      );

      setContract(splitterContract);
      console.log("Wallet Connected:", address);
    } catch (error) {
      // Error handling for user rejection [cite: 71, 93]
      if (error.code === 4001) {
        console.error("User rejected the connection request.");
      } else {
        console.error("Connection error:", error);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * WEEK 2: Register Product [cite: 18, 143]
   * Takes CID from S4S and saves it on-chain via S1K's contract.
   */
  const registerProduct = async (cid, priceInEth) => {
    if (!contract) throw new Error("Wallet not connected");

    try {
      // priceInEth is converted to Wei for the contract [cite: 143]
      const tx = await contract.registerProduct(cid, ethers.parseEther(priceInEth));
      await tx.wait(); // Wait for block confirmation [cite: 80]
      return tx.hash;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  /**
   * WEEK 2: Buy Product [cite: 68, 143]
   * Triggers MetaMask popup for the buyer.
   */
  const buyProduct = async (productId, priceInEth) => {
    if (!contract) throw new Error("Wallet not connected");

    try {
      // Sends ETH to the contract's buy function [cite: 116, 163]
      const tx = await contract.buyProduct(productId, {
        value: ethers.parseEther(priceInEth)
      });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Purchase failed:", error);
      throw error;
    }
  };

  /**
   * WEEK 2: Get Artist Balance [cite: 25, 143]
   * Reads "Pending Balance" directly from the contract (no gas cost).
   */
  const getArtistBalance = async (address) => {
    if (!contract || !address) return "0";
    try {
      // Call the mapping in Splitter.sol [cite: 155, 202]
      const balance = await contract.getArtistBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0";
    }
  };

  // Listen for account changes (Optional but professional)
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0] || '');
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      walletAddress,
      connectWallet,
      registerProduct,
      buyProduct,
      getArtistBalance,
      isConnecting
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}