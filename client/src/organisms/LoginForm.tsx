"use client";

import React, { FC } from "react";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import Button from "@/src/atoms/button";
import FormField from "@/src/molecules/FormField";

interface LoginFormProps {
  title: string;
  subtitle: string;
  labels: {
    email: string;
    password: string;
  };
  placeholders: {
    email: string;
    password: string;
  };
  submitButtonText: string;
  registerLinkText: string;
  onSubmit: (e: React.FormEvent) => void;
  onToggleRegister: () => void;
  className?: string;
  loginData?: {
    email: string;
    password: string;
  };
  onLoginChange?: (field: string, value: string) => void;
  loading?: boolean;
  error?: string;
}

const LoginForm: FC<LoginFormProps> = ({
  title,
  subtitle,
  labels,
  placeholders,
  submitButtonText,
  registerLinkText,
  onSubmit,
  onToggleRegister,
  className = "",
  loginData,
  onLoginChange,
  loading,
  error,
}) => {
  const isGoogleAccountError = error?.toLowerCase().includes('google');
  const handleLoginModeChange = () => onToggleRegister();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <Heading level={2} className="mb-2">
          {title}
        </Heading>
        <Text variant="body">{subtitle}</Text>
      </div>

      {error && (
        <div className={`border px-4 py-3 rounded mb-4 ${
          isGoogleAccountError 
            ? 'bg-blue-500/10 border-blue-500 text-blue-500'
            : 'bg-red-500/10 border-red-500 text-red-500'
        }`}>
          <p>{error}</p>
          {isGoogleAccountError && (
            <button
              type="button"
              onClick={handleLoginModeChange}
              className="block mt-2 underline font-semibold hover:opacity-80"
            >
              → Volver a inicio de sesión con Google
            </button>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          id="login-email"
          label={labels.email}
          type="email"
          placeholder={placeholders.email}
          value={loginData?.email || ""}
          onChange={(e) => onLoginChange?.("email", e.target.value)}
          required
        />

        <FormField
          id="login-password"
          label={labels.password}
          type="password"
          placeholder={placeholders.password}
          value={loginData?.password || ""}
          onChange={(e) => onLoginChange?.("password", e.target.value)}
          required
        />

        <Button
          title={submitButtonText}
          variant="blue"
          className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-6"
          disabled={loading}
        />
      </form>

      <button
        onClick={onToggleRegister}
        className="w-full text-sm text-[#000000]/70 hover:text-[#000000]"
      >
        {registerLinkText}
      </button>
    </div>
  );
};

export default LoginForm;
