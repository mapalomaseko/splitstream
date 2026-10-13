const hre = require("hardhat");

// Parses a comma-separated env var into a list of trimmed, non-empty values.
const parseList = (value) => (value || "").split(",").map((item) => item.trim()).filter(Boolean);

async function getArtistConfig() {
  const addresses = parseList(process.env.ARTIST_ADDRESSES);
  const percentages = parseList(process.env.ARTIST_PERCENTAGES).map(Number);

  if (addresses.length > 0) {
    return { addresses, percentages };
  }

  if (hre.network.name === "sepolia") {
    throw new Error("Set ARTIST_ADDRESSES and ARTIST_PERCENTAGES in .env before deploying to Sepolia");
  }

  // Local fallback: use Hardhat's built-in test accounts #1–#3
  const [, a1, a2, a3] = await hre.ethers.getSigners();
  return { addresses: [a1.address, a2.address, a3.address], percentages: [40, 30, 30] };
}

async function main() {
  const { addresses, percentages } = await getArtistConfig();

  console.log(`Deploying Splitter to ${hre.network.name}...`);
  addresses.forEach((address, i) => console.log(`  ${address}  ${percentages[i]}%`));

  // The constructor reverts unless both lists have the same length and percentages add up to 100
  const Splitter = await hre.ethers.getContractFactory("Splitter");
  const splitter = await Splitter.deploy(addresses, percentages);
  await splitter.waitForDeployment();

  const address = await splitter.getAddress();
  const receipt = await splitter.deploymentTransaction().wait();

  console.log("✅ Splitter deployed to:", address);
  console.log("👉 Set these in frontend/.env:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log(`   NEXT_PUBLIC_DEPLOY_BLOCK=${receipt.blockNumber}`);
  console.log(`   NEXT_PUBLIC_ARTIST_ADDRESSES=${addresses.join(",")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
