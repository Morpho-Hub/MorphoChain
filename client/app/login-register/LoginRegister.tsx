"use client";

import { useState, useEffect } from "react";
import { BrandingSection, AuthCard } from "@/src/organisms";
import { es } from "@/locales";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { authService } from "@/src/services";

interface LoginRegisterProps {
  onNavigate: (page: string) => void;
  onLogin?: (role: "farmer" | "investor") => void;
}

export function LoginRegister({ onNavigate, onLogin }: LoginRegisterProps) {
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false); // Toggle between login and register
  const [role, setRole] = useState<"farmer" | "investor">("farmer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [googleWalletAddress, setGoogleWalletAddress] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const account = useActiveAccount();
  const router = useRouter();

  const t = es.auth;
  const p = es.profile;
  const statsLabels = es.stats;
  const placeholders = es.placeholders;

  // Detect when wallet is connected via Thirdweb ConnectButton
  useEffect(() => {
    if (account?.address && !showAccountForm && !googleWalletAddress && !isLoginMode) {
      setGoogleWalletAddress(account.address);
      setShowAccountForm(true);
    }
  }, [account?.address, showAccountForm, googleWalletAddress, isLoginMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!loginData.email || !loginData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        // Get user data to determine role
        const userResponse = await authService.getMe();
        if (userResponse.success && userResponse.data) {
          const userRole = (userResponse.data as any).role;
          
          if (onLogin) {
            onLogin(userRole);
          }
          
          // Navigate based on user role
          if (userRole === "farmer") {
            router.push("/panel-agricultor");
          } else {
            router.push("/investor-dashboard");
          }
        }
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Register the user with wallet address from Google
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: role,
        walletAddress: googleWalletAddress || account?.address, // Use Google wallet or connected wallet
      });

      if (result.success) {
        // Call onLogin callback if provided
        if (onLogin) {
          onLogin(role);
        }
        
        // Navigate to appropriate dashboard
        if (role === "farmer") {
          router.push("/panel-agricultor");
        } else {
          router.push("/investor-dashboard");
        }
      } else {
        // Si el usuario ya existe (409 Conflict), intentar hacer login automático
        if (result.statusCode === 409 || result.error?.toLowerCase().includes("already")) {
          // Intentar login automático con las credenciales proporcionadas
          const loginResult = await login(formData.email, formData.password);
          
          if (loginResult.success) {
            // Get user data to determine role
            const userResponse = await authService.getMe();
            if (userResponse.success && userResponse.data) {
              const userRole = (userResponse.data as any).role;
              
              if (onLogin) {
                onLogin(userRole);
              }
              
              // Navigate based on user role
              if (userRole === "farmer") {
                router.push("/panel-agricultor");
              } else {
                router.push("/investor-dashboard");
              }
              return; // Salir después del login exitoso
            }
          }
          
          // Si el login falla, mostrar mensaje y cambiar a modo login
          setError("Ya tienes una cuenta. Por favor inicia sesión.");
          setShowAccountForm(false);
          setIsLoginMode(true);
          setLoginData({
            email: formData.email,
            password: "",
          });
        } else {
          setError(result.error || "Error al registrarse");
        }
      }
    } catch (err) {
      setError("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const stats = [
    { value: "250+", label: statsLabels.farmers },
    { value: "$2.4M", label: statsLabels.funded },
    { value: "12K", label: statsLabels.co2 },
  ];

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
          <AuthCard
            showAccountForm={showAccountForm}
            isLoginMode={isLoginMode}
            selectedRole={role}
            onRoleChange={setRole}
            onSubmit={handleCompleteProfile}
            onLogin={handleLogin}
            onBack={() => {
              setShowAccountForm(false);
              setIsLoginMode(false);
            }}
            onToggleMode={() => setIsLoginMode(!isLoginMode)}
            loading={loading}
            error={error}
            formData={formData}
            loginData={loginData}
            onFormChange={handleFormChange}
            onLoginChange={handleLoginChange}
            texts={{
              welcomeTitle: t.welcomeTitle,
              welcomeSubtitle: t.welcomeSubtitle,
              signInWithGoogle: t.signInWithGoogle,
              blockchainDescription: t.blockchainDescription,
              accountDetailsTitle: t.accountDetailsTitle,
              accountDetailsSubtitle: t.accountDetailsSubtitle,
              fullName: t.fullName,
              email: t.email,
              password: t.password,
              confirmPassword: t.confirmPassword,
              accountType: t.accountType,
              farmer: t.farmer,
              investor: t.investor,
              isCompanyInvestor: p.isCompanyInvestor,
              companyName: p.companyName,
              yes: p.yes,
              no: p.no,
              completeProfile: t.completeProfile,
              backToAuth: t.backToAuth,
            }}
            placeholders={placeholders}
          />
        </div>
      </div>
    </div>
  );
}
