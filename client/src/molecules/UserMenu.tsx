'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { es } from '@/locales';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  /**
   * URL de la imagen del avatar del usuario
   */
  avatarUrl?: string;
  /**
   * Nombre del usuario
   */
  userName?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ avatarUrl, userName = 'Usuario' }) => {
  const t = es.userMenu;
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push('/');
  };

  // Menu items dinámicos según el rol del usuario
  const menuItems = [
    { label: t.profile, href: '/perfil' },
    ...(user?.role === 'farmer' ? [{ label: 'Panel de Agricultor', href: '/panel-agricultor' }] : []),
    ...(user?.role === 'investor' ? [{ label: 'Panel de Inversor', href: '/panel-inversor' }] : []),
  ];

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full gradient-earth hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#26ade4] focus:ring-offset-2 shadow-morpho"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={userName}
            width={40}
            height={40}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay para cerrar el menú al hacer click fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-200" />
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              onClick={handleLogout}
            >
              {t.logout}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
