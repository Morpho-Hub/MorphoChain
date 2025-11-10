"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { AuthProvider } from "@/contexts/AuthContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThirdwebProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThirdwebProvider>
  );
}
