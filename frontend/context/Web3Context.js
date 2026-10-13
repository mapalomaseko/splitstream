import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Splitter from '../abi/Splitter.json';

const Web3Context = createContext();

// Parses a comma-separated env var into a list of trimmed, non-empty values.
const parseList = (value) => (value || '').split(',').map((item) => item.trim()).filter(Boolean);

// Wallets that see the artist dashboard (the payout addresses the contract was deployed with).
const ARTIST_ADDRESSES = parseList(process.env.NEXT_PUBLIC_ARTIST_ADDRESSES).map((address) => address.toLowerCase());

// Product IDs to hide from the marketplace (e.g. test uploads).
const HIDDEN_PRODUCT_IDS = parseList(process.env.NEXT_PUBLIC_HIDDEN_PRODUCT_IDS);

const DEPLOYMENT_BLOCK = Number.parseInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || '0', 10) || 0;

const normalizeAddress = (address) => (address || '').toLowerCase();

export function Web3Provider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [salesActivity, setSalesActivity] = useState(0);

  // Connects MetaMask, switches it to Sepolia and creates a signer-backed contract instance.
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed. Please install it to use SplitStream.");
      return;
    }

    try {
      setIsConnecting(true);

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

  // Stores an IPFS CID and its price on-chain.
  const registerProduct = async (cid, priceInEth) => {
    if (!contract) throw new Error("Wallet not connected");

    try {
      // The contract expects the price in wei
      const tx = await contract.registerProduct(cid, ethers.parseEther(priceInEth.toString()));
      await tx.wait(); // Wait for block confirmation
      return tx.hash;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Pays for a product; the contract splits the ETH between the artists.
  const buyProduct = async (productId, priceInEth) => {
    if (!contract) throw new Error("Wallet not connected");

    try {
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

  // Total ETH an artist has received from the contract so far.
  const getArtistBalance = async (address) => {
    if (!contract || !address) return "0";
    try {
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
    setIsArtist(ARTIST_ADDRESSES.includes(connected));
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
    if (!contract) return [];

    try {
      const allProducts = [];
      // Grab total product count from the contract
      const count = await contract.productCount();
      const totalProducts = Number(count);

      for (let id = 0; id < totalProducts; id++) {
        try {
          const data = await contract.getProduct(id);

          // data[0] = CID, data[1] = Owner, data[2] = Price
          allProducts.push({
            id: id.toString(),
            cid: data[0],
            owner: data[1],
            price: ethers.formatEther(data[2]),
            title: `Artwork #${id}`, // The contract doesn't store titles
          });
        } catch (err) {
          console.error(`Failed to fetch product ${id}:`, err);
        }
      }

      return allProducts.filter((p) => !HIDDEN_PRODUCT_IDS.includes(p.id));
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