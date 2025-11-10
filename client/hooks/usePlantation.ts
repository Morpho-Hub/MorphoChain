"use client";

import { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { usePlantationManagerContract } from "./useContract";

export interface PlantationData {
  tokenId: string;
  owner: string;
  name: string;
  location: string;
  landSize: string;
  cropType: string;
  registrationDate: string;
  isActive: boolean;
}

export function usePlantation() {
  const address = useAddress();
  const contract = usePlantationManagerContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Register a new plantation
   */
  const registerPlantation = async (
    name: string,
    location: string,
    landSize: number,
    cropType: string
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract || !address) {
        throw new Error("Wallet not connected");
      }

      const tx = await contract.call("registerPlantation", [
        name,
        location,
        landSize,
        cropType,
      ]);

      // Return transaction hash or tokenId
      return tx.receipt.transactionHash;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error registering plantation";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get plantation details by tokenId
   */
  const getPlantation = async (tokenId: number): Promise<PlantationData | null> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) return null;

      const data = await contract.call("getPlantation", [tokenId]);

      return {
        tokenId: data.tokenId.toString(),
        owner: data.owner,
        name: data.name,
        location: data.location,
        landSize: data.landSize.toString(),
        cropType: data.cropType,
        registrationDate: new Date(data.registrationDate.toNumber() * 1000).toISOString(),
        isActive: data.isActive,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting plantation";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get plantations owned by a wallet
   */
  const getPlantationsByWallet = async (walletAddress?: string): Promise<PlantationData[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const targetAddress = walletAddress || address;
      if (!contract || !targetAddress) return [];

      const tokenIds = await contract.call("getPlantationByWallet", [targetAddress]);

      const plantations = await Promise.all(
        tokenIds.map(async (tokenId: unknown) => {
          const data = await contract.call("getPlantation", [tokenId]);
          return {
            tokenId: data.tokenId.toString(),
            owner: data.owner,
            name: data.name,
            location: data.location,
            landSize: data.landSize.toString(),
            cropType: data.cropType,
            registrationDate: new Date(data.registrationDate.toNumber() * 1000).toISOString(),
            isActive: data.isActive,
          };
        })
      );

      return plantations;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting plantations";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get total number of registered plantations
   */
  const getTotalPlantations = async (): Promise<number> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) return 0;

      const total = await contract.call("getTotalPlantations");
      return total.toNumber();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting total plantations";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get plantation statistics
   */
  const getPlantationStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) return null;

      const stats = await contract.call("getPlantationStats");

      return {
        totalPlantations: stats.totalPlantations.toNumber(),
        activePlantations: stats.activePlantations.toNumber(),
        totalLandSize: stats.totalLandSize.toNumber(),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting plantation stats";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract,
    isLoading,
    error,
    registerPlantation,
    getPlantation,
    getPlantationsByWallet,
    getTotalPlantations,
    getPlantationStats,
  };
}
