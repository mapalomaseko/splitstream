// ============================================================
// STUDENT 4 — PAGE 2: CREATOR UPLOAD
// ============================================================
// Artists use this page to upload their work and register it on-chain.
//
// THE FULL FLOW THIS PAGE HANDLES:
// 1. Artist fills in title, price, and selects a file
// 2. Artist clicks Upload
// 3. File is sent to Pinata → Pinata returns a CID
// 4. CID + price is sent to the smart contract via registerProduct()
// 5. MetaMask pops up for the artist to confirm
// 6. Success message shown with transaction hash
//
// WEEK 1 TASKS:
// [ ] Build the form UI (title, price, file input, submit button)
// [ ] Set up Pinata SDK (npm install @pinata/sdk)
// [ ] Upload a test file manually and log the CID to console
//
// WEEK 2 TASKS:
// [ ] Connect the Upload button to Pinata upload function
// [ ] After getting CID, call registerProduct() from Web3Context
// [ ] Show loading state while transaction confirms
// [ ] Show success state with Etherscan link after confirmation
// ============================================================

import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function Upload() {
  const { walletAddress, connectWallet, registerProduct } = useWeb3();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | confirming | success | error

  const handleUpload = async () => {
    // TODO: Validate inputs
    // TODO: Upload file to Pinata and get CID
    // TODO: Call registerProduct(cid, price)
    // TODO: Update status states throughout
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1>Upload Your Artwork</h1>

      {/* TODO: Show connect wallet prompt if not connected */}

      {/* TODO: Build the upload form */}
      <div>
        <input placeholder="Artwork Title" onChange={e => setTitle(e.target.value)} />
        <input placeholder="Price in ETH" onChange={e => setPrice(e.target.value)} />
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload & Register</button>
      </div>

      {/* TODO: Show status messages */}
      {status === 'success' && <p>Successfully registered on-chain!</p>}
    </main>
  );
}
