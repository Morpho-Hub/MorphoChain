"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { usePlantationManagerContract } from "./useContract";

// NOTE: This hook uses deprecated Thirdweb v4 .call() API
// It is kept for legacy reference but is not actively used
// The app now uses backend APIs for plantation/farm operations

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
  const account = useActiveAccount();
  const address = account?.address;
  const contract = usePlantationManagerContract();
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // All legacy methods have been removed
  // Use backend API endpoints instead for plantation/farm operations

  return {
    contract,
    isLoading,
    error,
  };
}
