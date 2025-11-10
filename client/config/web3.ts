import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";

// Thirdweb Client
// Para desarrollo: puedes obtener un clientId gratis en https://thirdweb.com/dashboard
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id-for-development",
});

// Supported Chains
export const SUPPORTED_CHAIN = sepolia;

// Contract Addresses (Sepolia)
export const CONTRACT_ADDRESSES = {
  MORPHOCOIN: "0x6e81691b381255bf0d2056c6a4017a53bb3a421c",
  PLANTATION_MANAGER: "0xef67f46539f4e5d6991cab46153a109c00c3ba00",
  MORPHO_MARKETPLACE: "0x35ac5e4061090849bcc26d507a4188dbb4557d66",
} as const;

// Chain ID
export const CHAIN_ID = 11155111; // Sepolia

// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Blockchain API URL
export const BLOCKCHAIN_API_URL = `${API_BASE_URL}/blockchain`;
