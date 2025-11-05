"use client";

import { LoginRegister } from "../LoginRegister";
import { useRouter } from "next/navigation";

export default function LoginRegisterPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogin = (role: "farmer" | "investor") => {
    console.log(`User logged in as: ${role}`);
    // Redirect to appropriate dashboard
    if (role === "farmer") {
      router.push("/farmer-dashboard");
    } else {
      router.push("/investor-dashboard");
    }
  };

  return <LoginRegister onNavigate={handleNavigate} onLogin={handleLogin} />;
}
