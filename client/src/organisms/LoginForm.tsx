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
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <Heading level={2} className="mb-2">
          {title}
        </Heading>
        <Text variant="body">{subtitle}</Text>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
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
          type="submit"
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
