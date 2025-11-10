import React, { FC } from "react";
import Card from "@/src/atoms/Card";
import GoogleSignInForm from "./GoogleSignInForm";
import LoginForm from "./LoginForm";
import ProfileForm from "./ProfileForm";

interface AuthCardProps {
  showAccountForm: boolean;
  isLoginMode: boolean;
  selectedRole: "farmer" | "investor";
  onRoleChange: (role: "farmer" | "investor") => void;
  onSubmit: (e: React.FormEvent) => void;
  onLogin: (e: React.FormEvent) => void;
  onBack: () => void;
  onToggleMode: () => void;
  texts: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    signInWithGoogle: string;
    blockchainDescription: string;
    accountDetailsTitle: string;
    accountDetailsSubtitle: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    accountType: string;
    farmer: string;
    investor: string;
    isCompanyInvestor: string;
    companyName: string;
    yes: string;
    no: string;
    completeProfile: string;
    backToAuth: string;
  };
  placeholders: {
    fullName: string;
    email: string;
    password: string;
    companyName: string;
  };
  className?: string;
  loading?: boolean;
  error?: string;
  formData?: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  loginData?: {
    email: string;
    password: string;
  };
  onFormChange?: (field: string, value: string) => void;
  onLoginChange?: (field: string, value: string) => void;
}

const AuthCard: FC<AuthCardProps> = ({
  showAccountForm,
  isLoginMode,
  selectedRole,
  onRoleChange,
  onSubmit,
  onLogin,
  onBack,
  onToggleMode,
  texts,
  placeholders,
  className = "",
  loading,
  error,
  formData,
  loginData,
  onFormChange,
  onLoginChange,
}) => {
  return (
    <Card className={`p-8 rounded-3xl shadow-morpho-lg border-2 border-[#d1e751]/30 ${className}`}>
      {!showAccountForm && !isLoginMode ? (
        <GoogleSignInForm
          title={texts.welcomeTitle}
          subtitle={texts.welcomeSubtitle}
          buttonText={texts.signInWithGoogle}
          infoBannerText={texts.blockchainDescription}
          loginLinkText="¿Ya tienes cuenta? Inicia sesión"
          onToggleLogin={onToggleMode}
        />
      ) : isLoginMode ? (
        <LoginForm
          title="Iniciar Sesión"
          subtitle="Accede a tu cuenta de MorphoChain"
          labels={{
            email: texts.email,
            password: texts.password,
          }}
          placeholders={placeholders}
          submitButtonText="Iniciar Sesión"
          registerLinkText="¿No tienes cuenta? Regístrate con Google"
          onSubmit={onLogin}
          onToggleRegister={onToggleMode}
          loginData={loginData}
          onLoginChange={onLoginChange}
          loading={loading}
          error={error}
        />
      ) : (
        <ProfileForm
          title={texts.accountDetailsTitle}
          subtitle={texts.accountDetailsSubtitle}
          labels={{
            fullName: texts.fullName,
            email: texts.email,
            password: texts.password,
            confirmPassword: texts.confirmPassword,
            accountType: texts.accountType,
            farmer: texts.farmer,
            investor: texts.investor,
            isCompanyInvestor: texts.isCompanyInvestor,
            companyName: texts.companyName,
            yes: texts.yes,
            no: texts.no,
          }}
          placeholders={placeholders}
          submitButtonText={texts.completeProfile}
          backButtonText={texts.backToAuth}
          selectedRole={selectedRole}
          onRoleChange={onRoleChange}
          onSubmit={onSubmit}
          onBack={onBack}
          formData={formData}
          onFormChange={onFormChange}
        />
      )}
    </Card>
  );
};

export default AuthCard;
