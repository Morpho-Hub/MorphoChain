'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { Input } from '@/src/atoms';
import { AvatarUpload } from '@/src/molecules';
import Button from '@/src/atoms/button';
import { es } from '@/locales';

interface ProfileFormData {
  name: string;
  email: string;
  birthdate: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar: File | null;
}

const ProfileSettings: React.FC = () => {
  const t = es.profile;
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: 'Usuario Demo',
    email: 'usuario@morphochain.com',
    birthdate: '1990-01-01',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

    // Validar contraseñas si se está cambiando
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = t.errors.currentPasswordRequired;
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = t.errors.passwordMinLength;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t.errors.passwordMismatch;
      }
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
      // Aquí iría la lógica para guardar los cambios
      // Por ahora simulamos un delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSuccessMessage(t.successMessage);
      
      // Limpiar campos de contraseña después de guardar
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Error al guardar:', error);
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
              </div>

              {/* Cambiar Contraseña */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Lock className="w-5 h-5 text-primary" />
                  {t.changePassword}
                </h2>

                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-900 mb-2">
                      {t.currentPassword}
                    </label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder={es.placeholders.password}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={errors.currentPassword ? 'border-red-500' : ''}
                    />
                    {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                        {t.newPassword}
                      </label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder={es.placeholders.password}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={errors.newPassword ? 'border-red-500' : ''}
                      />
                      {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                        {t.confirmPassword}
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder={es.placeholders.password}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {t.passwordHint}
                  </p>
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
              className="bg-[#26ade4] hover:bg-[#1e8bb8] text-white rounded-lg px-6 py-3 shadow-morpho flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? t.saving : t.saveChanges}
            </button>
            <Button
              variant="white_bordered"
              className="!rounded-lg !px-6 !py-3"
              title={t.cancel}
              onClick={() => {
                // Reset form o navegar hacia atrás
                console.log('Cancelar');
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
