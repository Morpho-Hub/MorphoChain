'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { es } from '@/locales';

interface AvatarUploadProps {
  /**
   * URL inicial del avatar
   */
  initialAvatar?: string;
  /**
   * Callback cuando se selecciona una nueva imagen
   */
  onImageChange?: (file: File | null) => void;
  /**
   * Tamaño del avatar
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Nombre del usuario para mostrar iniciales
   */
  userName?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  initialAvatar,
  onImageChange,
  size = 'xl',
  userName = 'Usuario',
}) => {
  const t = es.profile;
  const [preview, setPreview] = useState<string | null>(initialAvatar || null);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange?.(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange?.(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-morpho-lg`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Avatar preview"
              fill
              className="object-cover"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2">
                <button
                  onClick={handleRemove}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  type="button"
                  title={t.removePhoto}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full gradient-earth flex flex-col items-center justify-center relative group">
            {/* Iniciales del usuario */}
            <span className={`${textSizes[size]} font-bold text-white`}>
              {getInitials(userName)}
            </span>
            
            {/* Overlay de hover */}
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-all">
                <Camera className="text-white" size={iconSizes[size]} />
              </div>
            )}
          </div>
        )}
      </div>

      <label
        htmlFor="avatar-upload"
        className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
      >
        <Camera className="w-4 h-4" />
        {preview ? t.changePhoto : t.uploadPhoto}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      
      {preview && (
        <button
          onClick={handleRemove}
          className="text-sm text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
          type="button"
        >
          <X className="w-4 h-4" />
          {t.removePhoto}
        </button>
      )}
    </div>
  );
};

export default AvatarUpload;
