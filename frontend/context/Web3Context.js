// ============================================================
// STUDENT 2 — WALLET CONNECTION CONTEXT
// ============================================================
// This file manages the wallet connection state for the entire app.
// Any component that needs the wallet address or provider imports from here.
//
// WEEK 1 TASKS:
// [ ] Write connectWallet() — calls window.ethereum.request({ method: 'eth_requestAccounts' })
// [ ] Store the wallet address in React state with useState
// [ ] Export walletAddress and connectWallet so other components can use them
// [ ] Test that clicking Connect Wallet shows the address on screen
//
// WEEK 2 TASKS:
// [ ] Write buyProduct(productId, priceInEth) — triggers MetaMask payment popup
// [ ] Write registerProduct(cid, priceInEth) — stores CID on the contract
// [ ] Write getArtistBalance(address) — reads balance from contract (no gas needed)
// [ ] Add error handling for: user rejects MetaMask, wrong network, no MetaMask installed
//
// HOW TO USE IN OTHER COMPONENTS:
//   import { useWeb3 } from '../context/Web3Context'
//   const { walletAddress, connectWallet } = useWeb3()
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Splitter from '../abi/Splitter.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {

  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // TODO: Write connectWallet function
  const connectWallet = async () => {
    // 1. Check MetaMask is installed [cite 15, 92]
    if (!window.ethereum) { 
      alert("Please install MetaMask to interact with this app"); 
      return; 
    }

    try {
      // 2. Request account access [cite 11, 35]
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);

      // 3. Set up Ethers provider [cite 15, 38]
      const _provider = new ethers.BrowserProvider(window.ethereum);
      
      // 4. Get the signer for future write transactions [cite 15]
      const _signer = await _provider.getSigner();

      // 5. Create contract instance (S3A will provide the address via .env) [cite 39, 41]
      const _contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, 
        Splitter, 
        _signer
      );

      setProvider(_provider);
      setContract(_contract);
      
    } catch (error) {
      console.error("User rejected the connection:", error);
    }
  };

  // TODO: Write registerProduct function (Week 2)
  const registerProduct = async (cid, priceInEth) => {
    // if (!contract) { alert("Connect wallet first"); return; }
    // const tx = await contract.registerProduct(cid, ethers.parseEther(priceInEth));
    // await tx.wait(); // waits for blockchain confirmation
    // return tx.hash;
  };

  // TODO: Write buyProduct function (Week 2)
  const buyProduct = async (productId, priceInEth) => {
    // if (!contract) { alert("Connect wallet first"); return; }
    // const tx = await contract.buyProduct(productId, {
    //   value: ethers.parseEther(priceInEth)
    // });
    // await tx.wait();
    // return tx.hash;
  };

  // TODO: Write getArtistBalance function (Week 2)
  const getArtistBalance = async (address) => {
    // if (!contract) return "0";
    // const balance = await contract.getArtistBalance(address);
    // return ethers.formatEther(balance);
  };

  return (
    <Web3Context.Provider value={{
      walletAddress,
      connectWallet,
      registerProduct,
      buyProduct,
      getArtistBalance,
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
