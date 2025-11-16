'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import Button from '@/src/atoms/button';
import { UserMenu } from '@/src/molecules';
import { es } from '@/locales';
import { useAuth } from '@/contexts/AuthContext';
import { BLOCKCHAIN_API_URL } from '@/config/web3';

const Navbar: React.FC = () => {
  const t = es.navbar;
  const router = useRouter();
  const { isLoggedIn, user, walletAddress } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [morphoAvailable, setMorphoAvailable] = useState<number | null>(null);
  const [ethBalance, setEthBalance] = useState<number | null>(null);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState(1000);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buyHash, setBuyHash] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch balances when wallet changes
  useEffect(() => {
    let timer: number | undefined;
    const fetchBalances = async () => {
      if (!walletAddress) return;
      try {
        setLoadingBalances(true);
        const [tokenRes, ethRes] = await Promise.all([
          fetch(`${BLOCKCHAIN_API_URL}/token/balance/${walletAddress}`),
          fetch(`${BLOCKCHAIN_API_URL}/eth/balance/${walletAddress}`),
        ]);
        const tokenData = await tokenRes.json();
        const ethData = await ethRes.json();
        const available = Number(tokenData?.data?.availableBalance ?? tokenData?.data?.totalBalance ?? 0);
        const eth = Number(ethData?.data?.balance ?? 0);
        setMorphoAvailable(available);
        setEthBalance(eth);
      } catch (e) {
        // Silent fail to not disrupt navbar
      } finally {
        setLoadingBalances(false);
      }
    };

    fetchBalances();
    // Refresh every 30s
    if (typeof window !== 'undefined') {
      timer = window.setInterval(fetchBalances, 30000);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [walletAddress]);

  const handleGetStarted = () => {
    router.push('/login-register');
  };
  
  const menuLinks = [
    { label: es.userMenu.market, href: '/mercado' },
    { label: es.userMenu.investment, href: '/inversion' },
    { label: es.userMenu.information, href: '/' },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-16">
          {/* Logo - Absolute left */}
          <Link href="/" className="absolute left-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full gradient-earth flex items-center justify-center shadow-morpho">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              MorphoChain
            </span>
          </Link>

          {/* Center - Navigation Links (only when logged in) */}
          {mounted && isLoggedIn && (
            <div className="hidden md:flex items-center gap-8">
              {menuLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-700 hover:text-[#26ade4] font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side - Balances + User Menu or Connect */}
          <div className="absolute right-0 flex items-center gap-4">
            {mounted && isLoggedIn && walletAddress ? (
              <>
                {/* Balance pill */}
                <div className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🪙</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {loadingBalances || morphoAvailable === null ? '—' : Math.floor(morphoAvailable).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Morpho</span>
                  </div>
                  <div className="w-px h-5 bg-gray-300"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">Ξ</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {loadingBalances || ethBalance === null ? '—' : ethBalance.toFixed(4)}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Eth</span>
                  </div>
                </div>
                {/* Buy button - compact */}
                <button
                  onClick={() => { setBuyError(null); setShowBuyModal(true); setBuyHash(null); }}
                  className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                  title="Comprar MORPHO"
                >
                  <span>+</span>
                  <span>MORPHO</span>
                </button>
                <UserMenu 
                  avatarUrl={user?.profilePicture || user?.avatar} 
                  userName={user ? `${user.firstName} ${user.lastName}` : 'Usuario'} 
                />
              </>
            ) : (
              <Button
                title="Conectar"
                variant="blue"
                onClick={handleGetStarted}
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !rounded-lg !px-8 !py-2.5 shadow-lg !font-semibold"
              />
            )}
          </div>
        </div>
      </div>

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
            {buyError && <div className="mt-3 text-sm text-red-600">{buyError}</div>}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancelar
              </button>
              <button
                disabled={buying}
                onClick={async () => {
                  if (!walletAddress) return;
                  try {
                    setBuyError(null);
                    setBuying(true);
                    setBuyHash(null);
                    const res = await fetch(`${BLOCKCHAIN_API_URL}/token/buy`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ toAddress: walletAddress, amount: buyAmount })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) {
                      throw new Error(data?.error || 'No se pudo comprar MORPHO');
                    }
                    setBuyHash(data.data.transactionHash);
                    setShowBuyModal(false);
                    // refresh balances
                    try {
                      const tokenRes = await fetch(`${BLOCKCHAIN_API_URL}/token/balance/${walletAddress}`);
                      const tokenData = await tokenRes.json();
                      const available = Number(tokenData?.data?.availableBalance ?? tokenData?.data?.totalBalance ?? 0);
                      setMorphoAvailable(available);
                    } catch {}
                  } catch (e) {
                    const msg = e instanceof Error ? e.message : 'Error desconocido';
                    setBuyError(msg);
                  } finally {
                    setBuying(false);
                  }
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2"
              >
                {buying ? 'Comprando…' : 'Confirmar compra'}
              </button>
            </div>
            {buyHash && (
              <div className="mt-3 text-center">
                <a
                  href={`https://sepolia.etherscan.io/tx/${buyHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Ver transacción en Etherscan
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
