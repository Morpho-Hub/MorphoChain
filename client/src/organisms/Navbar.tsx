'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import Button from '@/src/atoms/button';
import { UserMenu } from '@/src/molecules';
import { es } from '@/locales';

interface NavbarProps {
  /**
   * Indica si el usuario está autenticado
   */
  isLoggedIn?: boolean;
  /**
   * URL del avatar del usuario (opcional)
   */
  avatarUrl?: string;
  /**
   * Nombre del usuario
   */
  userName?: string;
  /**
   * Callback para el botón "Comenzar"
   */
  onGetStarted?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn: initialIsLoggedIn = false,
  avatarUrl,
  userName = 'Usuario',
  onGetStarted,
}) => {
  const t = es.navbar;
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  const handleGetStarted = () => {
    setIsLoggedIn(true);
    if (onGetStarted) {
      onGetStarted();
    }
  };
  const menuLinks = [
    { label: es.userMenu.market, href: '/mercado' },
    { label: es.userMenu.investment, href: '/inversion' },
    { label: es.userMenu.information, href: '/informacion' },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full gradient-earth flex items-center justify-center shadow-morpho">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              MorphoChain
            </span>
          </Link>

          {/* Center - Navigation Links (only when logged in) */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-8">
              {menuLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-700 hover:text-[#26ade4] font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side - Auth buttons or User Menu */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <UserMenu avatarUrl={avatarUrl} userName={userName} />
            ) : (
              <Button
                title={t.getStarted}
                variant="blue"
                onClick={handleGetStarted}
                className="!bg-[#26ade4] hover:!bg-[#1e8bb8] !text-white !rounded-full !px-6 shadow-morpho"
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
