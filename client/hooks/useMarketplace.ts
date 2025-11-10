"use client";

import { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { useMorphoMarketplaceContract } from "./useContract";
import { ethers } from "ethers";

export interface ListingData {
  listingId: string;
  seller: string;
  productName: string;
  quantity: string;
  pricePerUnit: string;
  totalPrice: string;
  isActive: boolean;
  createdAt: string;
}

export function useMarketplace() {
  const address = useAddress();
  const contract = useMorphoMarketplaceContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new listing
   */
  const createListing = async (
    productName: string,
    quantity: number,
    pricePerUnit: string
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract || !address) {
        throw new Error("Wallet not connected");
      }

      const priceInWei = ethers.utils.parseEther(pricePerUnit);
      const tx = await contract.call("createListing", [productName, quantity, priceInWei]);

      return tx.receipt.transactionHash;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error creating listing";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Buy from a listing
   */
  const buyFromListing = async (listingId: number, quantity: number): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract || !address) {
        throw new Error("Wallet not connected");
      }

      // Get listing to calculate required tokens
      const listing = await contract.call("getListing", [listingId]);
      const pricePerUnit = listing.pricePerUnit;
      const totalCost = pricePerUnit.mul(quantity);

      const tx = await contract.call("buyFromListing", [listingId, quantity], {
        value: totalCost,
      });

      return tx.receipt.transactionHash;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error buying from listing";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancel a listing
   */
  const cancelListing = async (listingId: number): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract || !address) {
        throw new Error("Wallet not connected");
      }

      const tx = await contract.call("cancelListing", [listingId]);
      return tx.receipt.transactionHash;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error canceling listing";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get listing details
   */
  const getListing = async (listingId: number): Promise<ListingData | null> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) return null;

      const data = await contract.call("getListing", [listingId]);

      return {
        listingId: data.listingId.toString(),
        seller: data.seller,
        productName: data.productName,
        quantity: data.quantity.toString(),
        pricePerUnit: ethers.utils.formatEther(data.pricePerUnit),
        totalPrice: ethers.utils.formatEther(data.pricePerUnit.mul(data.quantity)),
        isActive: data.isActive,
        createdAt: new Date(data.createdAt.toNumber() * 1000).toISOString(),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting listing";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get all active listings
   */
  const getActiveListings = async (): Promise<ListingData[]> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) return [];

      const listingIds = await contract.call("getActiveListings");

      const listings = await Promise.all(
        listingIds.map(async (listingId: unknown) => {
          const data = await contract.call("getListing", [listingId]);
          return {
            listingId: data.listingId.toString(),
            seller: data.seller,
            productName: data.productName,
            quantity: data.quantity.toString(),
            pricePerUnit: ethers.utils.formatEther(data.pricePerUnit),
            totalPrice: ethers.utils.formatEther(data.pricePerUnit.mul(data.quantity)),
            isActive: data.isActive,
            createdAt: new Date(data.createdAt.toNumber() * 1000).toISOString(),
          };
        })
      );

      return listings;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting active listings";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get listings by seller
   */
  const getSellerListings = async (sellerAddress?: string): Promise<ListingData[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const targetAddress = sellerAddress || address;
      if (!contract || !targetAddress) return [];

      const listingIds = await contract.call("getSellerListings", [targetAddress]);

      const listings = await Promise.all(
        listingIds.map(async (listingId: unknown) => {
          const data = await contract.call("getListing", [listingId]);
          return {
            listingId: data.listingId.toString(),
            seller: data.seller,
            productName: data.productName,
            quantity: data.quantity.toString(),
            pricePerUnit: ethers.utils.formatEther(data.pricePerUnit),
            totalPrice: ethers.utils.formatEther(data.pricePerUnit.mul(data.quantity)),
            isActive: data.isActive,
            createdAt: new Date(data.createdAt.toNumber() * 1000).toISOString(),
          };
        })
      );

      return listings;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting seller listings";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculate purchase cost with platform fee
   */
  const calculatePurchaseCost = async (
    pricePerUnit: string,
    quantity: number
  ): Promise<{ totalCost: string; platformFee: string; sellerReceives: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) throw new Error("Contract not loaded");

      const priceInWei = ethers.utils.parseEther(pricePerUnit);
      const result = await contract.call("calculatePurchaseCost", [priceInWei, quantity]);

      return {
        totalCost: ethers.utils.formatEther(result.totalCost),
        platformFee: ethers.utils.formatEther(result.platformFee),
        sellerReceives: ethers.utils.formatEther(result.sellerReceives),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error calculating cost";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get marketplace statistics
   */
  const getMarketplaceStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!contract) return null;

      const stats = await contract.call("getMarketplaceStats");

      return {
        totalListings: stats.totalListings.toNumber(),
        activeListings: stats.activeListings.toNumber(),
        totalVolume: ethers.utils.formatEther(stats.totalVolume),
        platformFee: stats.platformFee.toNumber() / 100, // Convert basis points to percentage
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error getting marketplace stats";
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
    createListing,
    buyFromListing,
    cancelListing,
    getListing,
    getActiveListings,
    getSellerListings,
    calculatePurchaseCost,
    getMarketplaceStats,
  };
}
