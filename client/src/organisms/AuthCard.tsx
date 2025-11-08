import React, { FC } from "react";
import Card from "@/src/atoms/Card";
import GoogleSignInForm from "./GoogleSignInForm";
import ProfileForm from "./ProfileForm";

interface AuthCardProps {
  showAccountForm: boolean;
  selectedRole: "farmer" | "investor";
  onRoleChange: (role: "farmer" | "investor") => void;
  onGoogleAuth: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
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
}

const AuthCard: FC<AuthCardProps> = ({
  showAccountForm,
  selectedRole,
  onRoleChange,
  onGoogleAuth,
  onSubmit,
  onBack,
  texts,
  placeholders,
  className = "",
}) => {
  return (
    <Card className={`p-8 rounded-3xl shadow-morpho-lg border-2 border-[#d1e751]/30 ${className}`}>
      {!showAccountForm ? (
        <GoogleSignInForm
          title={texts.welcomeTitle}
          subtitle={texts.welcomeSubtitle}
          buttonText={texts.signInWithGoogle}
          infoBannerText={texts.blockchainDescription}
          onGoogleAuth={onGoogleAuth}
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
        />
      )}
    </Card>
  );
};

export default AuthCard;
