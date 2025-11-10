'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import Button from '@/src/atoms/button';
import { UserMenu } from '@/src/molecules';
import { es } from '@/locales';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const t = es.navbar;
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    router.push('/login-register');
  };
  
  const menuLinks = [
    { label: es.userMenu.market, href: '/mercado' },
    { label: es.userMenu.investment, href: '/inversion' },
    { label: es.userMenu.information, href: '/' },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-16">
          {/* Logo - Absolute left */}
          <Link href="/" className="absolute left-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full gradient-earth flex items-center justify-center shadow-morpho">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              MorphoChain
            </span>
          </Link>

          {/* Center - Navigation Links (only when logged in) */}
          {mounted && isLoggedIn && (
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

          {/* Right side - Auth buttons or User Menu - Absolute right */}
          <div className="absolute right-0 flex items-center gap-3">
            {mounted && isLoggedIn ? (
              <UserMenu avatarUrl={user?.avatar} userName={user?.name || 'Usuario'} />
            ) : (
              <Button
                title="Conectar"
                variant="blue"
                onClick={handleGetStarted}
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !rounded-lg !px-8 !py-2.5 shadow-lg !font-semibold"
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
