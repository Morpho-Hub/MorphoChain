"use client";

import { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { useMorphoCoinContract } from "./useContract";
import { ethers } from "ethers";

export function useMorphoCoin() {
  const address = useAddress();
  const contract = useMorphoCoinContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get token balance for an address
   */
  const getBalance = async (walletAddress?: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const targetAddress = walletAddress || address;
      if (!contract || !targetAddress) return "0";

      const balance = await contract.call("balanceOf", [targetAddress]);
      return ethers.utils.formatEther(balance);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting balance";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get available (unfrozen) balance
   */
  const getAvailableBalance = async (walletAddress?: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const targetAddress = walletAddress || address;
      if (!contract || !targetAddress) return "0";

      const balance = await contract.call("getAvailableBalance", [targetAddress]);
      return ethers.utils.formatEther(balance);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting available balance";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get frozen balance
   */
  const getFrozenBalance = async (walletAddress?: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const targetAddress = walletAddress || address;
      if (!contract || !targetAddress) return "0";

      const balance = await contract.call("getFrozenBalance", [targetAddress]);
      return ethers.utils.formatEther(balance);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting frozen balance";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Transfer tokens to another address
   */
  const transfer = async (toAddress: string, amount: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract || !address) {
        throw new Error("Wallet not connected");
      }

      const amountInWei = ethers.utils.parseEther(amount);
      await contract.call("transfer", [toAddress, amountInWei]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error transferring tokens";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Approve spender to use tokens
   */
  const approve = async (spenderAddress: string, amount: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract || !address) {
        throw new Error("Wallet not connected");
      }

      const amountInWei = ethers.utils.parseEther(amount);
      await contract.call("approve", [spenderAddress, amountInWei]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error approving tokens";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get token info (name, symbol, decimals, supply)
   */
  const getTokenInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) return null;

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.call("name"),
        contract.call("symbol"),
        contract.call("decimals"),
        contract.call("totalSupply"),
      ]);

      return {
        name,
        symbol,
        decimals: decimals.toString(),
        totalSupply: ethers.utils.formatEther(totalSupply),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting token info";
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
    getBalance,
    getAvailableBalance,
    getFrozenBalance,
    transfer,
    approve,
    getTokenInfo,
  };
}
