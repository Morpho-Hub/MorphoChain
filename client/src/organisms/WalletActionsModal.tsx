'use client';

import React, { useEffect, useState } from 'react';
import { X, Send, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { useActiveAccount } from 'thirdweb/react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';
import { blockchainService } from '@/src/services/blockchainService';

interface WalletActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'send' | 'receive' | 'transactions' | 'assets' | 'settings' | null;
}

export const WalletActionsModal: React.FC<WalletActionsModalProps> = ({
  isOpen,
  onClose,
  action,
}) => {
  const account = useActiveAccount();
  const { walletAddress: authWallet, user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [sendForm, setSendForm] = useState({
    to: '',
    amount: '',
    token: 'ETH',
  });
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [morphoBalances, setMorphoBalances] = useState<{ total: string; available: string; frozen: string}>({ total: '0', available: '0', frozen: '0' });

  // Compute address and run hooks unconditionally to preserve hook order across renders
  const walletAddress = (account?.address || authWallet || user?.walletAddress || '') as string;

  useEffect(() => {
    const fetchEth = async () => {
      try {
        if (!walletAddress) return;
        const res = await blockchainService.getEthBalance(walletAddress);
        if (res.success && res.data) {
          setEthBalance(res.data.balance);
        }
      } catch (e) {
        // keep default
      }
    };
    const fetchMorpho = async () => {
      try {
        if (!walletAddress) return;
        const res = await blockchainService.getTokenBalance(walletAddress);
        if (res.success && res.data) {
          setMorphoBalances({
            total: res.data.totalBalance,
            available: res.data.availableBalance,
            frozen: res.data.frozenBalance,
          });
        }
      } catch (e) {
        // keep default
      }
    };
    fetchEth();
    fetchMorpho();
  }, [walletAddress]);

  // After hooks, bail out early if modal is not open
  if (!isOpen || !action) return null;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying address:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual send functionality
    alert(`Enviar ${sendForm.amount} ${sendForm.token} a ${sendForm.to}`);
    onClose();
  };

  const renderContent = () => {
    switch (action) {
      case 'send':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Enviar</h3>
                <p className="text-sm text-gray-600">Envía tokens desde tu wallet</p>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de destino
                </label>
                <input
                  type="text"
                  value={sendForm.to}
                  onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.000001"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                    placeholder="0.0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={sendForm.token}
                    onChange={(e) => setSendForm({ ...sendForm, token: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ETH">ETH</option>
                    <option value="MORPHO">MORPHO</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Verifica cuidadosamente la dirección antes de enviar. Las transacciones son irreversibles.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button

                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Enviar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        );

      case 'receive':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recibir</h3>
                <p className="text-sm text-gray-600">Comparte tu dirección para recibir tokens</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
              <div className="bg-white p-6 rounded-lg inline-block mb-4 shadow-lg">
                <QRCodeSVG
                  value={walletAddress}
                  size={192}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-2">Tu dirección de wallet:</p>
              <div className={`bg-white p-3 rounded-lg break-all font-mono text-sm mb-4 ${walletAddress ? 'text-gray-900' : 'text-gray-400'}`}>
                {walletAddress || 'No conectada'}
              </div>

              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar Dirección
                  </>
                )}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Comparte esta dirección para recibir tokens en Sepolia testnet
              </p>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Transacciones</h3>
                <p className="text-sm text-gray-600">Historial de transacciones</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Sin transacciones recientes</span>
                </div>
                <p className="text-xs text-gray-500">
                  Tus transacciones aparecerán aquí cuando realices operaciones
                </p>
              </div>

              <a
                href={`https://sepolia.etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
                Ver en Etherscan
              </a>
            </div>
          </div>
        );

      case 'assets':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Mis Assets</h3>
                <p className="text-sm text-gray-600">Tokens y NFTs en tu wallet</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">Sepolia ETH</span>
                  <span className="text-sm text-gray-600">{Number(ethBalance).toFixed(4)} ETH</span>
                </div>
                <p className="text-xs text-gray-500">Red: Sepolia Testnet</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">MorphoCoin (MORPHO)</span>
                  <span className="text-sm text-gray-600">{Number(morphoBalances.available || morphoBalances.total).toFixed(4)} MORPHO</span>
                </div>
                <p className="text-xs text-gray-500">Token ERC-20</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">
                  💡 Obtén tokens de prueba en el{' '}
                  <a
                    href="https://sepoliafaucet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    faucet de Sepolia
                  </a>
                </p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Configuración</h3>
                <p className="text-sm text-gray-600">Opciones de tu wallet</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Red Blockchain</h4>
                <p className="text-sm text-gray-600 mb-3">Conectado a Sepolia Testnet</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Estado: Activo</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Información de la Cuenta</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proveedor:</span>
                    <span className="text-gray-900 font-medium">Thirdweb</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="text-gray-900 font-medium">In-App Wallet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Autenticación:</span>
                    <span className="text-gray-900 font-medium">Google OAuth</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  🔒 Tu wallet está cifrada y protegida por Thirdweb
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
