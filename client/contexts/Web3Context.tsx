"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useActiveAccount, useActiveWalletChain, useConnect } from "thirdweb/react";
import { CONTRACT_ADDRESSES, CHAIN_ID } from "@/config/web3";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/config/web3";

interface Web3ContextType {
  address: string | undefined;
  isConnected: boolean;
  morphoBalance: string;
  ethBalance: string;
  chainId: number;
  contractAddresses: typeof CONTRACT_ADDRESSES;
  connectWithGoogle: () => Promise<string | undefined>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const { connect, isConnecting } = useConnect();
  const address = account?.address;
  const isConnected = !!account;
  
  // Balances - placeholder for now, will implement proper fetching
  const morphoBalance = "0";
  const ethBalance = "0";

  // Connect wallet with Google using Thirdweb In-App Wallet
  const connectWithGoogle = async (): Promise<string | undefined> => {
    try {
      const wallet = inAppWallet();
      
      const connectedWallet = await connect(async () => {
        await wallet.connect({
          client,
          strategy: "google",
          mode: "redirect",
          redirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/login-register`,
        });
        return wallet;
      });

      // Get the account from the connected wallet
      const walletAccount = connectedWallet?.getAccount();
      return walletAccount?.address;
    } catch (error) {
      console.error("Error connecting with Google:", error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    // Disconnect is handled via useDisconnect hook in components
    console.log('Disconnect wallet called - use useDisconnect hook in component');
  };

  const value: Web3ContextType = {
    address,
    isConnected,
    morphoBalance,
    ethBalance,
    chainId: chain?.id || CHAIN_ID,
    contractAddresses: CONTRACT_ADDRESSES,
    connectWithGoogle,
    disconnectWallet,
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
