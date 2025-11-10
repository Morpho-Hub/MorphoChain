import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/organisms/Navbar";
import { Footer } from "@/src/organisms/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "./providers";
import { Web3Provider } from "@/contexts/Web3Context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MorphoChain - Plataforma de Finanzas Regenerativas",
  description: "Conectando agricultores e inversores para un futuro sostenible",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Web3Provider>
            <AuthProvider>
              <Navbar />
              {children}
              <Footer />
            </AuthProvider>
          </Web3Provider>
        </Providers>
      </body>
    </html>
  );
}
