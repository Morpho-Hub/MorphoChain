"use client";

import { ThirdwebProvider, AutoConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { AuthProvider } from "@/contexts/AuthContext";
import { client, SUPPORTED_CHAIN } from "@/config/web3";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThirdwebProvider>
      <AutoConnect
        client={client}
        chain={SUPPORTED_CHAIN}
        wallets={[
          createWallet("io.metamask"),
          createWallet("com.coinbase.wallet"),
          createWallet("me.rainbow"),
        ]}
      />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThirdwebProvider>
  );
}
