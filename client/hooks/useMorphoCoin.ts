"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useMorphoCoinContract } from "./useContract";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { toWei } from "thirdweb/utils";

export function useMorphoCoin() {
  const account = useActiveAccount();
  const address = account?.address;
  const contract = useMorphoCoinContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transfer tokens to another address (Thirdweb v5)
   */
  const transfer = async (toAddress: string, amount: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Debug wallet connection state
      console.log('🔍 Verificando estado de wallet:', {
        account: account ? 'Existe' : 'No existe',
        address: address || 'Sin dirección',
        contract: contract ? 'Contrato cargado' : 'Sin contrato',
      });
      
      if (!address) {
        console.error('❌ Error: No hay dirección de wallet detectada');
        console.log('Account completo:', account);
        throw new Error("Por favor conecta tu wallet para continuar");
      }
      
      if (!contract) {
        throw new Error("Contrato MORPHO no disponible");
      }
      
      if (!account) {
        throw new Error("Cuenta no inicializada");
      }

      const amountInWei = toWei(amount);
      
      const transaction = prepareContractCall({
        contract,
        method: "function transfer(address to, uint256 amount) returns (bool)",
        params: [toAddress, amountInWei],
      });

      await sendTransaction({
        transaction,
        account,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error transferring tokens";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy methods commented out - use backend API instead
  // const getBalance = async (walletAddress?: string): Promise<string> => { ... }
  // const getAvailableBalance = async (walletAddress?: string): Promise<string> => { ... }
  // const getFrozenBalance = async (walletAddress?: string): Promise<string> => { ... }
  // const approve = async (spenderAddress: string, amount: string): Promise<void> => { ... }
  // const getTokenInfo = async () => { ... }

  return {
    contract,
    isLoading,
    error,
    transfer,
  };
}
