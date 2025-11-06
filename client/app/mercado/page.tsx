"use client";

import { Marketplace } from "./Marketplace";
import { useRouter } from "next/navigation";

export default function MarketplacePage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  return <Marketplace onNavigate={handleNavigate} />;
}
