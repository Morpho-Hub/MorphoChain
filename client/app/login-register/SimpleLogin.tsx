"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectButton, useActiveAccount, useDisconnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client, SUPPORTED_CHAIN } from "@/config/web3";
import { Card } from "@/src/atoms";
import { BrandingSection } from "@/src/organisms";
import { es } from "@/locales";
import { User, Briefcase, LogOut } from "lucide-react";

export function SimpleLogin() {
  const router = useRouter();
  const { isLoggedIn, user, needsOnboarding, completeOnboarding, walletAddress, loading } = useAuth();
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  
  const t = es.auth;
  const statsLabels = es.stats;
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    name: "",
    email: "",
    role: "investor" as "investor" | "farmer",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAccountSwitch, setShowAccountSwitch] = useState(false);

  const stats = [
    { value: "250+", label: statsLabels.farmers },
    { value: "$2.4M", label: statsLabels.funded },
    { value: "12K", label: statsLabels.co2 },
  ];

  // Check if user is already logged in
  useEffect(() => {
    if (!loading && isLoggedIn && user) {
      // Redirect based on role
      if (user.role === "farmer") {
        router.push("/panel-agricultor");
      } else {
        router.push("/investor-dashboard");
      }
    }
  }, [isLoggedIn, user, loading, router]);

  // Show onboarding form when wallet connects and needs onboarding
  useEffect(() => {
    if (needsOnboarding && walletAddress && !loading) {
      setShowOnboarding(true);
    }
  }, [needsOnboarding, walletAddress, loading]);

  // Clear auto-connect flag on mount to force manual connection
  useEffect(() => {
    // Set a flag to prevent auto-connect on this page
    sessionStorage.setItem('prevent-auto-connect', 'true');
    
    return () => {
      // Clean up the flag when leaving the page
      sessionStorage.removeItem('prevent-auto-connect');
    };
  }, []);

  // Show account switch option when wallet is already connected
  useEffect(() => {
    if (account && !loading && !isLoggedIn && !needsOnboarding) {
      setShowAccountSwitch(true);
    } else {
      setShowAccountSwitch(false);
    }
  }, [account, loading, isLoggedIn, needsOnboarding]);

  const handleSwitchAccount = async () => {
    try {
      console.log('🔄 Switching account...');
      
      // Disconnect wallet if connected
      if (account) {
        disconnect(account);
      }
      
      // Clear all storage completely
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear IndexedDB (where Thirdweb stores wallet data)
      if ('indexedDB' in window) {
        try {
          // Delete all Thirdweb related databases
          const databases = await window.indexedDB.databases?.();
          if (databases) {
            for (const db of databases) {
              if (db.name && (db.name.includes('thirdweb') || db.name.includes('walletconnect') || db.name.includes('idb-keyval'))) {
                console.log('🗑️ Deleting database:', db.name);
                window.indexedDB.deleteDatabase(db.name);
              }
            }
          }
        } catch (e) {
          console.warn('Could not clear IndexedDB:', e);
        }
      }
      
      // Clear all cookies (including Thirdweb/Google OAuth)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Also clear Google OAuth session by redirecting through logout
      // This forces Google to ask for account selection next time
      try {
        const googleLogoutUrl = 'https://accounts.google.com/Logout';
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = googleLogoutUrl;
        document.body.appendChild(iframe);
        setTimeout(() => document.body.removeChild(iframe), 1000);
      } catch (e) {
        console.warn('Could not clear Google session:', e);
      }
      
      setShowAccountSwitch(false);
      
      console.log('✅ Storage cleared, reloading...');
      
      // Force a complete reload to clear all state
      setTimeout(() => {
        window.location.href = '/login-register';
      }, 1200);
    } catch (error) {
      console.error('Error switching account:', error);
      window.location.href = '/login-register';
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!onboardingData.name || !onboardingData.email) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(onboardingData.email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setSubmitting(true);

    try {
      const result = await completeOnboarding(onboardingData);

      if (result.success) {
        // User created, will redirect via useEffect
      } else {
        setError(result.error || "Error al completar perfil");
      }
    } catch {
      setError("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <BrandingSection
            subtitle={t.welcomeSubtitle}
            imageUrl="https://images.unsplash.com/photo-1592864554447-5e40d96e2b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBoYW5kcyUyMHNvaWx8ZW58MXx8fHwxNzYwNjc2MTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            imageAlt="Farmer hands with soil"
            stats={stats}
          />

          {/* Right Side - Auth Forms */}
          <Card className="p-8">
            {!showOnboarding ? (
              // Login View
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Bienvenido a MorphoChain
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Plataforma blockchain para inversión agrícola sostenible
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Inicia sesión con Google
                    </h3>
                    <p className="text-sm text-gray-600">
                      Autenticación segura y rápida
                    </p>
                  </div>

                  {showAccountSwitch && account ? (
                    // Account already connected - show switch option
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-gray-900">Cuenta conectada</p>
                            <p className="text-xs text-gray-600 font-mono break-all">
                              {account.address.slice(0, 6)}...{account.address.slice(-4)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleSwitchAccount}
                        className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        ¿No eres tú? Cambiar cuenta
                      </button>
                    </div>
                  ) : (
                    // No account connected - show connect button
                    <div className="flex justify-center">
                      <ConnectButton
                        client={client}
                        chain={SUPPORTED_CHAIN}
                        autoConnect={false}
                        connectButton={{
                          label: "Conectar con Google",
                          className: "!bg-white !text-gray-900 !font-semibold !px-8 !py-4 !rounded-lg hover:!bg-gray-50 !shadow-lg !border-2 !border-gray-200 transition-all",
                        }}
                        connectModal={{
                          title: "Iniciar Sesión",
                          size: "compact",
                          welcomeScreen: {
                            title: "MorphoChain",
                            subtitle: "Conecta con Google para continuar",
                          },
                        }}
                        wallets={[
                          inAppWallet({
                            auth: {
                              options: ["google"],
                            },
                          }),
                        ]}
                      />
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-gray-500 space-y-1">
                  <p className="font-medium">🔒 Conexión segura y cifrada</p>
                  <p>Al conectar aceptas nuestros Términos de Servicio y Política de Privacidad</p>
                </div>
              </div>
            ) : (
              // Onboarding Form
              <form onSubmit={handleOnboardingSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Completa tu Perfil</h2>
                  <p className="text-gray-600">
                    Cuéntanos un poco sobre ti
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={onboardingData.name}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={onboardingData.email}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cuenta *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setOnboardingData(prev => ({ ...prev, role: "investor" }))}
                      className={`p-6 border-2 rounded-lg transition-all flex flex-col items-center gap-3 ${
                        onboardingData.role === "investor"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400 hover:shadow"
                      }`}
                      disabled={submitting}
                    >
                      <div className={`p-3 rounded-full ${
                        onboardingData.role === "investor" ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        <Briefcase className={`w-6 h-6 ${
                          onboardingData.role === "investor" ? "text-blue-600" : "text-gray-600"
                        }`} />
                      </div>
                      <div className="font-semibold text-gray-900">Inversor</div>
                      <p className="text-xs text-gray-600 text-center">
                        Invierte en proyectos agrícolas
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardingData(prev => ({ ...prev, role: "farmer" }))}
                      className={`p-6 border-2 rounded-lg transition-all flex flex-col items-center gap-3 ${
                        onboardingData.role === "farmer"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400 hover:shadow"
                      }`}
                      disabled={submitting}
                    >
                      <div className={`p-3 rounded-full ${
                        onboardingData.role === "farmer" ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        <User className={`w-6 h-6 ${
                          onboardingData.role === "farmer" ? "text-blue-600" : "text-gray-600"
                        }`} />
                      </div>
                      <div className="font-semibold text-gray-900">Agricultor</div>
                      <p className="text-xs text-gray-600 text-center">
                        Gestiona tus cultivos
                      </p>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Wallet conectada:</p>
                  <p className="font-mono break-all">{walletAddress}</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {submitting ? "Creando cuenta..." : "Completar Registro"}
                </button>
              </form>
            )}
          </Card>
        
        </div>
      </div>
    </div>
  );
}
