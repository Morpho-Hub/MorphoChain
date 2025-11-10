"use client";

import { SimpleLogin } from "./SimpleLogin";

interface LoginRegisterProps {
  onNavigate: (page: string) => void;
  onLogin?: (role: "farmer" | "investor") => void;
}

export function LoginRegister({ onNavigate, onLogin }: LoginRegisterProps) {
  return <SimpleLogin />;
}
