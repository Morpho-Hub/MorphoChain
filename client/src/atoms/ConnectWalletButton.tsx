"use client";

import { ConnectButton } from "thirdweb/react";
import { client, SUPPORTED_CHAIN } from "@/config/web3";

interface ConnectWalletButtonProps {
  className?: string;
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  return (
    <div className={className}>
      <ConnectButton
        client={client}
        chain={SUPPORTED_CHAIN}
        connectButton={{
          label: "Conectar Wallet",
        }}
        connectModal={{
          title: "Conecta tu Wallet",
          welcomeScreen: {
            title: "MorphoChain",
            subtitle: "Plataforma de Inversión Agrícola con Blockchain",
          },
        }}
      />
    </div>
  );
}
