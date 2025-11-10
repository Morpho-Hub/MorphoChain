"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { Coins } from "lucide-react";

interface TokenBalanceProps {
  className?: string;
  showIcon?: boolean;
}

export function TokenBalance({ className = "", showIcon = true }: TokenBalanceProps) {
  const { morphoBalance, isConnected } = useWeb3();

  if (!isConnected) {
    return null;
  }

  const balance = parseFloat(morphoBalance || "0");
  const displayBalance = balance.toFixed(2);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Coins className="w-5 h-5 text-green-500" />}
      <span className="font-semibold">{displayBalance} MORPHO</span>
    </div>
  );
}
