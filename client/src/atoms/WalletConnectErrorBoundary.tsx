"use client";

import { useState, useEffect } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, SUPPORTED_CHAIN, BLOCKCHAIN_API_URL } from "@/config/web3";

interface WalletConnectErrorBoundaryProps {
  children?: React.ReactNode;
  className?: string;
}

export function WalletConnectErrorBoundary({ children, className }: WalletConnectErrorBoundaryProps) {
  const account = useActiveAccount();
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);
  const [faucetHash, setFaucetHash] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState<number>(1000);
  const [isBuying, setIsBuying] = useState(false);
  const [buyHash, setBuyHash] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined') {
      const ethWin = window as unknown as { ethereum?: unknown };
      const ethereum = ethWin.ethereum;
      setIsMetaMaskInstalled(!!ethereum);
    }
  }, []);

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">🦊</div>
        <h3 className="font-bold text-lg mb-2">MetaMask No Detectado</h3>
        <p className="text-gray-600 mb-4">
          Necesitas instalar MetaMask para conectarte
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Instalar MetaMask
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">Error de Conexión</h4>
              <p className="text-red-600 text-sm mb-2">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-700 hover:text-red-900 underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {children || (
        <ConnectButton
          client={client}
          chain={SUPPORTED_CHAIN}
          connectButton={{
            label: "Conectar Wallet",
            className: "!bg-[#26ade4] hover:!bg-[#1e8bb8] !text-white !font-semibold !px-8 !py-4 !rounded-xl transition-all !shadow-lg hover:!shadow-xl",
          }}
          connectModal={{
            title: "Conecta tu Wallet",
            size: "wide",
            welcomeScreen: {
              title: "MorphoChain",
              subtitle: "Plataforma de Inversión Agrícola Regenerativa",
              img: {
                src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
                width: 150,
                height: 150,
              },
            },
            termsOfServiceUrl: "https://morphochain.com/terms",
            privacyPolicyUrl: "https://morphochain.com/privacy",
          }}
          appMetadata={{
            name: "MorphoChain",
            description: "Plataforma de Inversión Agrícola Regenerativa con Blockchain",
            url: typeof window !== 'undefined' ? window.location.origin : "https://morphochain.com",
            logoUrl: "https://morphochain.com/logo.png",
          }}
          onConnect={(wallet) => {
            console.log("✅ Wallet conectada:", wallet.getAccount()?.address);
            setError(null);
          }}
          onDisconnect={() => {
            console.log("🔌 Wallet desconectada");
            setError(null);
            setFaucetHash(null);
            setBuyHash(null);
          }}
        />
      )}

      {account && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="text-sm text-green-600">
            ✅ Conectado: {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </div>
          <button
            disabled={isFaucetLoading}
            onClick={async () => {
              try {
                setError(null);
                setIsFaucetLoading(true);
                setFaucetHash(null);
                const res = await fetch(`${BLOCKCHAIN_API_URL}/token/faucet`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ toAddress: account.address })
                });
                const data = await res.json();
                if (!res.ok || !data.success) {
                  throw new Error(data?.error || 'No se pudo obtener MORPHO');
                }
                setFaucetHash(data.data.transactionHash);
              } catch (e) {
                const msg = e instanceof Error ? e.message : 'Error desconocido';
                setError(msg);
              } finally {
                setIsFaucetLoading(false);
              }
            }}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded"
          >
            {isFaucetLoading ? 'Enviando MORPHO…' : '🪙 Obtener MORPHO (testnet)'}
          </button>
          <button
            onClick={() => { setError(null); setShowBuyModal(true); setBuyHash(null); }}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
          >
            Comprar MORPHO
          </button>
          {faucetHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${faucetHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Ver transacción en Etherscan
            </a>
          )}
          {buyHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${buyHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Compra en Etherscan
            </a>
          )}
        </div>
      )}

      {/* Comprar MORPHO Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-2 border-[#26ade4]/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Comprar MORPHO</h3>
              <button onClick={() => setShowBuyModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Compra MORPHO en Sepolia (test). Se estima un costo en ETH simbólico para UX.</p>
            <div className="space-y-3">
              <label className="text-sm text-gray-700">Cantidad (MORPHO)</label>
              <input
                type="number"
                min={1}
                max={10000}
                className="w-full border rounded-lg px-3 py-2"
                value={buyAmount}
                onChange={(e) => setBuyAmount(Math.max(1, Math.min(10000, parseInt(e.target.value || '1', 10))))}
              />
              <div className="text-sm text-gray-600">
                Estimado en ETH: <span className="font-semibold">{(buyAmount * 0.000002).toFixed(6)} ETH</span>
              </div>
            </div>
            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancelar
              </button>
              <button
                disabled={isBuying}
                onClick={async () => {
                  if (!account) return;
                  try {
                    setError(null);
                    setIsBuying(true);
                    setBuyHash(null);
                    const res = await fetch(`${BLOCKCHAIN_API_URL}/token/buy`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ toAddress: account.address, amount: buyAmount })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) {
                      throw new Error(data?.error || 'No se pudo comprar MORPHO');
                    }
                    setBuyHash(data.data.transactionHash);
                    setShowBuyModal(false);
                  } catch (e) {
                    const msg = e instanceof Error ? e.message : 'Error desconocido';
                    setError(msg);
                  } finally {
                    setIsBuying(false);
                  }
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2"
              >
                {isBuying ? 'Comprando…' : 'Confirmar compra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
