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

      // --- NEW: FORCE SEPOLIA SWITCH ---
      // This ensures the popup says "Sepolia" and uses your 0.4 ETH balance
      await ensureSepolia(); 

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);

      // Setup Ethers Provider & Signer
      // Note: Using BrowserProvider for Ethers v6
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      
      // Safety check: ensure address isn't null/undefined before creating contract
      if (!contractAddress) {
        throw new Error("Contract address missing in .env file");
      }

      const splitterContract = new ethers.Contract(
        contractAddress,
        Splitter.abi, 
        signer
      );

      setContract(splitterContract);
      console.log("Wallet Connected to Sepolia:", address);

    } catch (error) {
      // Handle user rejection or network switch cancellation
      if (error.code === 4001) {
        console.error("User rejected the request.");
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
      // Ensure the price is a string before parsing to Ether
      const tx = await contract.registerProduct(cid, ethers.parseEther(priceInEth.toString()));
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

  const ensureSepolia = async () => {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  const sepoliaChainId = '0xaa36a7'; // Hex code for Sepolia

  if (chainId !== sepoliaChainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: sepoliaChainId }],
      });
    } catch (err) {
      // This error code means the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: sepoliaChainId,
            chainName: 'Sepolia Test Network',
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      }
    }
  }
};

  return (
    <Web3Context.Provider value={{
      walletAddress,
      connectWallet,
      registerProduct,
      buyProduct,
      getArtistBalance,
      ensureSepolia,
      isConnecting
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}