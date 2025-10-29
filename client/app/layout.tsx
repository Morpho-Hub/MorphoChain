import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MorphoChain — Finanzas Regenerativas",
  description:
    "Conectamos agricultores con inversionistas mediante la tokenización agrícola y métricas de impacto verificadas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="nav">
          <div className="container nav__inner">
            <div className="nav__brand">MorphoChain</div>
            <nav className="nav__links">
              <a href="/">Inicio</a>
              <a href="#mercado">Mercado</a>
              <a href="#educacion">Educación</a>
            </nav>
            <div className="nav__spacer" />
            <div className="nav__actions">
              <a className="btn btn--ghost" href="/login">Iniciar Sesión</a>
              <a className="btn btn--primary" href="/comenzar">Comenzar</a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="container footer__inner">
            <div>
              <div className="nav__brand">MorphoChain</div>
              <p className="muted" style={{ marginTop: 8 }}>
                Tokenizando el futuro regenerativo de Costa Rica con agricultura
                sostenible y blockchain.
              </p>
            </div>
            <div>
              <strong>Plataforma</strong>
              <div className="muted">Para Agricultores</div>
              <div className="muted">Para Inversores</div>
              <div className="muted">Mercado</div>
            </div>
            <div>
              <strong>Recursos</strong>
              <div className="muted">Documentación</div>
              <div className="muted">Informes de Impacto</div>
              <div className="muted">Soporte</div>
            </div>
            <div>
              <strong>Contacto</strong>
              <div className="muted">San José, Costa Rica</div>
              <div className="muted">hello@morphochain.cr</div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="container">© 2025 MorphoChain. Todos los derechos reservados.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
