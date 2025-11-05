'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import Button from '@/src/atoms/button';
import UserMenu from '@/src/molecules/UserMenu';

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
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  const handleGetStarted = () => {
    setIsLoggedIn(true);
    if (onGetStarted) {
      onGetStarted();
    }
  };
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

          {/* Right side - Auth buttons or User Menu */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <UserMenu avatarUrl={avatarUrl} userName={userName} />
            ) : (
              <Button
                title="Comenzar"
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
