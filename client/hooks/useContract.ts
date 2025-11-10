"use client";

import { getContract } from "thirdweb";
import { client, CONTRACT_ADDRESSES, SUPPORTED_CHAIN } from "@/config/web3";
import MorphoCoinABI from "@/contracts/abis/MorphoCoin.json";
import PlantationManagerABI from "@/contracts/abis/PlantationManager.json";
import MorphoMarketplaceABI from "@/contracts/abis/MorphoMarketplace.json";

/**
 * Generic hook to get any contract instance
 */
export function useContract(contractAddress: string, abi: unknown) {
  return getContract({
    client,
    chain: SUPPORTED_CHAIN,
    address: contractAddress,
    abi: abi as any[],
  });
}

/**
 * Hook to get MorphoCoin contract
 */
export function useMorphoCoinContract() {
  return getContract({
    client,
    chain: SUPPORTED_CHAIN,
    address: CONTRACT_ADDRESSES.MORPHOCOIN,
    abi: MorphoCoinABI as any[],
  });
}

/**
 * Hook to get PlantationManager contract
 */
export function usePlantationManagerContract() {
  return getContract({
    client,
    chain: SUPPORTED_CHAIN,
    address: CONTRACT_ADDRESSES.PLANTATION_MANAGER,
    abi: PlantationManagerABI as any[],
  });
}

/**
 * Hook to get MorphoMarketplace contract
 */
export function useMorphoMarketplaceContract() {
  return getContract({
    client,
    chain: SUPPORTED_CHAIN,
    address: CONTRACT_ADDRESSES.MORPHO_MARKETPLACE,
    abi: MorphoMarketplaceABI as any[],
  });
}
