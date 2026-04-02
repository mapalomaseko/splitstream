// ============================================================
// STUDENT 2 (S2M) — WALLET & TRANSACTION LEAD
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
// S3A provides this ABI after running 'npx hardhat compile' 
import Splitter from '../abi/Splitter.json';

const Web3Context = createContext();
const TEAM_ARTIST_ADDRESSES = [
  '0x8F2eDFfB8a634929616B853B7d1743dC7A7eDbEF',
  '0xAE9e2CD45cAce72d144a606c73320d318a49F4D0',
  '0xF9d984985935e72Ae3F0055775B7d72dc37fb53f',
].map((address) => address.toLowerCase());

const DEPLOYMENT_BLOCK = Number.parseInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || '0', 10) || 0;

const normalizeAddress = (address) => (address || '').toLowerCase();

export function Web3Provider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [salesActivity, setSalesActivity] = useState(0);

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

  // Keep role state in sync with the active account.
  useEffect(() => {
    const connected = normalizeAddress(walletAddress);
    setIsArtist(TEAM_ARTIST_ADDRESSES.includes(connected));
  }, [walletAddress]);

  // Initialize a read-only contract on load so marketplace works without wallet
  useEffect(() => {
    const initReadOnlyContract = () => {
      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        if (!contractAddress) return;
        
        let provider;
        if (typeof window !== 'undefined' && window.ethereum) {
          provider = new ethers.BrowserProvider(window.ethereum);
        } else {
          // Fallback to a public RPC if the user has no MetaMask
          provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
        }

        const readOnlyContract = new ethers.Contract(
          contractAddress,
          Splitter.abi, 
          provider
        );
        
        setContract(prev => prev || readOnlyContract);
      } catch (err) {
        console.error("Failed to initialize read-only contract:", err);
      }
    };

    initReadOnlyContract();

    let handleAccountsChanged;
    if (typeof window !== 'undefined' && window.ethereum) {
      handleAccountsChanged = (accounts) => {
        setWalletAddress(accounts[0] || '');
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum && handleAccountsChanged) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // Listen for purchases so UI can refresh dashboard and collection data in near real-time.
  useEffect(() => {
    if (!contract || !contract.on) return;

    const handleProductPurchased = () => {
      setSalesActivity((prev) => prev + 1);
    };

    contract.on('ProductPurchased', handleProductPurchased);

    return () => {
      if (contract.off) {
        contract.off('ProductPurchased', handleProductPurchased);
      }
    };
  }, [contract]);

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

const getProducts = async () => {
  console.log("1. getProducts function called!"); // Is the function even running?
  console.log("2. Current contract state:", contract); // Is it null or an object?

  if (!contract) {
    console.log("3. Error: Contract is null, exiting getProducts");
    return [];
  }
  
    try {
      const allProducts = [];
      // Grab total product count from the contract
      const count = await contract.productCount();
      const totalProducts = Number(count);
      
      console.log(`Found ${totalProducts} products to fetch.`);

      for (let id = 0; id < totalProducts; id++) {
        console.log("Fetching ID:", id);
        try {
          // Calling the singular 'getProduct' with the current ID
          const data = await contract.getProduct(id);
          
          // data[0] = CID, data[1] = Owner, data[2] = Price
          allProducts.push({
            id: id.toString(),
            cid: data[0],
            owner: data[1],
            price: ethers.formatEther(data[2]),
            title: `Artwork #${id}`, // Since the ABI doesn't show a title
            // A product is sold if the contract's "owner/creator" is updated or isn't tracked properly, 
            // but for now we follow the structure
          });
        } catch (err) {
          console.log(`Failed to fetch product ${id}:`, err);
        }
      }
      
      console.log("Fetched Products:", allProducts);
      return allProducts;
  } catch (error) {
    console.error("Marketplace fetch error:", error);
    return [];
  }
};

const getPurchaseEvents = async () => {
  if (!contract) return [];

  try {
    const filter = contract.filters.ProductPurchased();
    const logs = await contract.queryFilter(filter, DEPLOYMENT_BLOCK, 'latest');

    return logs.map((log) => {
      const productId = Number(log.args?.id ?? log.args?.[0] ?? 0);
      const buyer = log.args?.buyer ?? log.args?.[1] ?? '';
      const amount = log.args?.amount ?? log.args?.[2] ?? 0;

      return {
        productId,
        buyer,
        amountEth: ethers.formatEther(amount),
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      };
    });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return [];
  }
};

const getBuyerPurchases = async (buyerAddress) => {
  if (!buyerAddress) return [];

  try {
    const [events, allProducts] = await Promise.all([
      getPurchaseEvents(),
      getProducts(),
    ]);

    const targetBuyer = normalizeAddress(buyerAddress);
    const productMap = new Map(allProducts.map((product) => [Number(product.id), product]));

    return events
      .filter((sale) => normalizeAddress(sale.buyer) === targetBuyer)
      .map((sale) => {
        const product = productMap.get(sale.productId);
        if (!product) return null;

        return {
          ...product,
          txHash: sale.txHash,
          buyer: sale.buyer,
          purchasedPrice: sale.amountEth,
          purchasedAtBlock: sale.blockNumber,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.purchasedAtBlock - a.purchasedAtBlock);
  } catch (error) {
    console.error('Error building buyer collection:', error);
    return [];
  }
};

const getArtistDashboardStats = async (artistAddress) => {
  if (!artistAddress) {
    return {
      artistProducts: [],
      worksUploaded: 0,
      totalSales: 0,
      revenueReceived: '0',
    };
  }

  try {
    const [allProducts, events, revenueReceived] = await Promise.all([
      getProducts(),
      getPurchaseEvents(),
      getArtistBalance(artistAddress),
    ]);

    const normalizedArtist = normalizeAddress(artistAddress);
    const artistProducts = allProducts.filter(
      (product) => normalizeAddress(product.owner) === normalizedArtist
    );

    const artistProductIds = new Set(artistProducts.map((product) => Number(product.id)));
    const totalSales = events.filter((sale) => artistProductIds.has(sale.productId)).length;

    return {
      artistProducts,
      worksUploaded: artistProducts.length,
      totalSales,
      revenueReceived,
    };
  } catch (error) {
    console.error('Error building artist dashboard stats:', error);
    return {
      artistProducts: [],
      worksUploaded: 0,
      totalSales: 0,
      revenueReceived: '0',
    };
  }
};



  return (
    <Web3Context.Provider value={{
      walletAddress,
      isArtist,
      connectWallet,
      registerProduct,
      buyProduct,
      getArtistBalance,
      ensureSepolia,
      getProducts,
      getBuyerPurchases,
      getArtistDashboardStats,
      getPurchaseEvents,
      contract,
      isConnecting,
      salesActivity,
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}