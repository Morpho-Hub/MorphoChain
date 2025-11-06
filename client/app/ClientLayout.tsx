'use client';

import Navbar from "@/src/organisms/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
}
