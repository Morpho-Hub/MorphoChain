"use client";

import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

interface TransactionStatusProps {
  status: "pending" | "success" | "error" | "idle";
  txHash?: string;
  message?: string;
  className?: string;
}

export function TransactionStatus({
  status,
  txHash,
  message,
  className = "",
}: TransactionStatusProps) {
  if (status === "idle") {
    return null;
  }

  const openInExplorer = () => {
    if (txHash) {
      window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank");
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg ${className} ${
        status === "pending"
          ? "bg-blue-900/20 border border-blue-500/30"
          : status === "success"
          ? "bg-green-900/20 border border-green-500/30"
          : "bg-red-900/20 border border-red-500/30"
      }`}
    >
      {status === "pending" && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
      {status === "success" && <CheckCircle className="w-5 h-5 text-green-400" />}
      {status === "error" && <XCircle className="w-5 h-5 text-red-400" />}

      <div className="flex-1">
        <p
          className={`font-medium ${
            status === "pending"
              ? "text-blue-300"
              : status === "success"
              ? "text-green-300"
              : "text-red-300"
          }`}
        >
          {status === "pending" && "Transacción en proceso..."}
          {status === "success" && "¡Transacción exitosa!"}
          {status === "error" && "Error en la transacción"}
        </p>
        {message && <p className="text-sm text-gray-400 mt-1">{message}</p>}
        {txHash && (
          <button
            onClick={openInExplorer}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
          >
            Ver en Etherscan
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
