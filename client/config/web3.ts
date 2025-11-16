import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";

// Thirdweb Client
// Para desarrollo: puedes obtener un clientId gratis en https://thirdweb.com/dashboard
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id-for-development",
});

// Supported Chains
export const SUPPORTED_CHAIN = sepolia;

// Contract Addresses (Sepolia) - DEBEN COINCIDIR CON backend/.env
export const CONTRACT_ADDRESSES = {
  MORPHOCOIN: "0xa0943426e598d223852023e7879d92c704791e62",
  PLANTATION_MANAGER: "0xde4822ea001c21f8dbd5d37c290808d877e9166f",
  MORPHO_MARKETPLACE: "0x7eaa1f39cfbb0a128a7cdf5a74c3e0c6378b6b9b",
} as const;

// Chain ID
export const CHAIN_ID = 11155111; // Sepolia

// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Blockchain API URL
export const BLOCKCHAIN_API_URL = `${API_BASE_URL}/blockchain`;
