"use client";

import React, { createContext, useContext } from "react";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { CONTRACT_ADDRESSES, CHAIN_ID } from "@/config/web3";

interface Web3ContextType {
  address: string | undefined;
  isConnected: boolean;
  morphoBalance: string;
  ethBalance: string;
  chainId: number;
  contractAddresses: typeof CONTRACT_ADDRESSES;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const address = account?.address;
  const isConnected = !!account;
  
  // Balances - placeholder for now, will implement proper fetching
  const morphoBalance = "0";
  const ethBalance = "0";

  const value: Web3ContextType = {
    address,
    isConnected,
    morphoBalance,
    ethBalance,
    chainId: chain?.id || CHAIN_ID,
    contractAddresses: CONTRACT_ADDRESSES,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
