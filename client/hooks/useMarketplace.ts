"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useMorphoMarketplaceContract } from "./useContract";

// NOTE: This hook uses deprecated Thirdweb v4 .call() API
// It is kept for legacy reference but is not actively used
// The app now uses backend APIs for marketplace operations

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
  const account = useActiveAccount();
  const address = account?.address;
  const contract = useMorphoMarketplaceContract();
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // All legacy methods (createListing, buyFromListing, etc.) have been removed
  // Use backend API endpoints instead for marketplace operations

  return {
    contract,
    isLoading,
    error,
  };
}
