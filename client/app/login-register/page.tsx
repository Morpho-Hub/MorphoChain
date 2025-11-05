"use client";

import { LoginRegister } from "../LoginRegister";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogin = (role: "farmer" | "investor") => {
    // Simular datos del usuario (en producción vendrían del formulario)
    const userData = {
      name: "Juan Pérez",
      email: "juan.perez@morphochain.com",
      role: role,
    };

    // Login con el contexto
    login(userData);

    console.log(`User logged in as: ${role}`);
    
    // Redirect según el rol
    if (role === "farmer") {
      router.push("/panel-agricultor");
    } else {
      router.push("/panel-inversor");
    }
  };

  return <LoginRegister onNavigate={handleNavigate} onLogin={handleLogin} />;
}
