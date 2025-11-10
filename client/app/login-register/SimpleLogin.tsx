"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client, SUPPORTED_CHAIN } from "@/config/web3";
import { Card } from "@/src/atoms";
import { BrandingSection } from "@/src/organisms";
import { es } from "@/locales";

export function SimpleLogin() {
  const router = useRouter();
  const { isLoggedIn, user, needsOnboarding, completeOnboarding, walletAddress, loading } = useAuth();
  
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
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{t.welcomeTitle}</h2>
                  <p className="text-gray-600 mb-6">
                    {t.blockchainDescription}
                  </p>
                </div>

                <div className="flex justify-center">
                  <ConnectButton
                    client={client}
                    chain={SUPPORTED_CHAIN}
                    connectButton={{
                      label: t.signInWithGoogle,
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

                <div className="text-center text-sm text-gray-500">
                  <p>Al conectar aceptas nuestros</p>
                  <p>Términos de Servicio y Política de Privacidad</p>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className={`p-4 border-2 rounded-lg transition-all ${
                        onboardingData.role === "investor"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={submitting}
                    >
                      <div className="text-2xl mb-2">💰</div>
                      <div className="font-semibold">Inversor</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardingData(prev => ({ ...prev, role: "farmer" }))}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        onboardingData.role === "farmer"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={submitting}
                    >
                      <div className="text-2xl mb-2">🌾</div>
                      <div className="font-semibold">Agricultor</div>
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
