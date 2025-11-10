'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Wallet, Send, Download, Eye, Settings, LogOut, List } from 'lucide-react';
import { Input } from '@/src/atoms';
import { AvatarUpload } from '@/src/molecules';
import Button from '@/src/atoms/button';
import { es } from '@/locales';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface ProfileFormData {
  name: string;
  email: string;
  birthdate: string;
  phone: string;
  bio: string;
  avatar: File | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ProfileSettings: React.FC = () => {
  const t = es.profile;
  const { user, walletAddress, logout } = useAuth();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    birthdate: '',
    phone: '',
    bio: '',
    avatar: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthdate: user.birthdate || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: null,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = t.errors.nameRequired;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t.errors.emailRequired;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t.errors.emailInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrors({ email: 'Sesión expirada. Por favor inicia sesión de nuevo.' });
        return;
      }

      // Split name into firstName and lastName
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updateData = {
        firstName,
        lastName,
        phone: formData.phone,
        bio: formData.bio,
      };

      const response = await axios.put(
        `${API_URL}/users/me`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Perfil actualizado correctamente');
      }
    } catch (error: unknown) {
      console.error('Error al guardar:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = (error.response?.data as { message?: string })?.message || 'Error al actualizar el perfil';
        setErrors({ 
          email: errorMessage
        });
      } else {
        setErrors({ email: 'Error de conexión' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-morpho p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Grid Layout Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Columna Izquierda - Avatar y Nombre */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-6">
              <div className="w-full flex flex-col items-center">
                <AvatarUpload
                  onImageChange={handleAvatarChange}
                  size="xl"
                  userName={formData.name}
                />
              </div>
              
              {/* Nombre debajo del avatar */}
              <div className="w-full">
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  {t.fullName} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={es.placeholders.fullName}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
            </div>

            {/* Columna Derecha - Resto de información */}
            <div className="lg:col-span-8 space-y-8">
              {/* Información Personal */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                  <User className="w-5 h-5 text-primary" />
                  {t.personalInfo}
                </h2>

                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-900 mb-2">
                    {t.birthdate}
                  </label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className={errors.birthdate ? 'border-red-500' : ''}
                  />
                  {errors.birthdate && <p className="mt-1 text-sm text-red-500">{errors.birthdate}</p>}
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Mail className="w-5 h-5 text-primary" />
                  {t.contactInfo}
                </h2>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    {t.email} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={es.placeholders.email}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>

              {/* Información de Wallet */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Wallet className="w-5 h-5 text-primary" />
                  Gestión de Wallet
                </h2>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Tu Wallet</p>
                      <p className="font-mono text-xs text-gray-700 break-all">
                        {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : user?.walletAddress || 'No conectada'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowWalletMenu(!showWalletMenu)}
                      className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors border border-blue-300"
                    >
                      {showWalletMenu ? 'Ocultar' : 'Gestionar'}
                    </button>
                  </div>

                  {showWalletMenu && (
                    <div className="mt-4 pt-4 border-t border-blue-200 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => alert('Función Send - Próximamente')}
                          className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                        >
                          <Send className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Enviar</span>
                        </button>
                        <button
                          onClick={() => alert('Función Receive - Próximamente')}
                          className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                        >
                          <Download className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Recibir</span>
                        </button>
                        <button
                          onClick={() => alert('Ver Transacciones - Próximamente')}
                          className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                        >
                          <List className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Transacciones</span>
                        </button>
                        <button
                          onClick={() => alert('Ver Assets - Próximamente')}
                          className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Ver Assets</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => alert('Configuración Wallet - Próximamente')}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Configuración de Wallet</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('¿Estás seguro de que deseas desconectar tu wallet?')) {
                            try {
                              // Note: disconnect needs the wallet instance, we'll handle it differently
                              logout();
                              window.location.href = '/login-register';
                            } catch (error) {
                              console.error('Error disconnecting:', error);
                            }
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                      >
                        <LogOut className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-700">Desconectar Wallet</span>
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-600 mt-4">
                    💡 Esta wallet está vinculada a tu cuenta de forma permanente
                  </p>
                </div>
              </div>

              {/* Bio / Descripción */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                  <User className="w-5 h-5 text-primary" />
                  Sobre ti
                </h2>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-900 mb-2">
                    Biografía / Descripción
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Cuéntanos un poco sobre ti..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-green-800 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 shadow-lg flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isLoading ? t.saving : t.saveChanges}
            </button>
            <Button
              variant="white_bordered"
              className="!rounded-lg !px-6 !py-3"
              title={t.cancel}
              onClick={() => {
                // Reset form
                if (user) {
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    birthdate: '',
                    phone: '',
                    bio: '',
                    avatar: null,
                  });
                }
                setSuccessMessage('');
                setErrors({});
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
