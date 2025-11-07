"use client";

import { useState } from "react";
import { BrandingSection, AuthCard } from "@/src/organisms";
import { es } from "@/locales";

interface LoginRegisterProps {
  onNavigate: (page: string) => void;
  onLogin: (role: "farmer" | "investor") => void;
}

export function LoginRegister({ onNavigate, onLogin }: LoginRegisterProps) {
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [role, setRole] = useState<"farmer" | "investor">("farmer");

  const t = es.auth;
  const statsLabels = es.stats;
  const placeholders = es.placeholders;

  const handleGoogleAuth = () => {
    // Mock Google authentication
    setShowAccountForm(true);
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Call onLogin callback with selected role
    onLogin(role);
    // Navigate to appropriate dashboard
    if (role === "farmer") {
      onNavigate("panel-agricultor");
    } else {
      onNavigate("investor-dashboard");
    }
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
            selectedRole={role}
            onRoleChange={setRole}
            onGoogleAuth={handleGoogleAuth}
            onSubmit={handleCompleteProfile}
            onBack={() => setShowAccountForm(false)}
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
