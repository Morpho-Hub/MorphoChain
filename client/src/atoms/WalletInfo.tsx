"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface WalletInfoProps {
  className?: string;
}

export function WalletInfo({ className = "" }: WalletInfoProps) {
  const { address, isConnected, ethBalance } = useWeb3();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) {
    return null;
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInExplorer = () => {
    window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank");
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">Wallet Conectada</span>
        <div className="flex gap-2">
          <button
            onClick={copyAddress}
            className="text-gray-400 hover:text-white transition-colors"
            title={copied ? "¡Copiado!" : "Copiar dirección"}
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={openInExplorer}
            className="text-gray-400 hover:text-white transition-colors"
            title="Ver en Etherscan"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="font-mono font-semibold text-white mb-3">{shortAddress}</div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Balance ETH:</span>
        <span className="font-semibold text-white">
          {parseFloat(ethBalance || "0").toFixed(4)} ETH
        </span>
      </div>
    </div>
  );
}
