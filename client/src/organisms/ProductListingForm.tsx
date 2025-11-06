'use client';

import React, { useState } from 'react';
import { X, Upload, Calendar } from 'lucide-react';
import { Input } from '@/src/atoms';
import { es } from '@/locales';

export interface ProductListing {
  id: string;
  farmId: string;
  farmName: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  harvestDate: string;
  description: string;
  images: string[];
  certifications?: string[];
  available: boolean;
}

interface ProductListingFormProps {
  farmId: string;
  farmName: string;
  listing?: ProductListing;
  onSave: (listing: Omit<ProductListing, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

interface FormErrors {
  productName?: string;
  quantity?: string;
  unit?: string;
  pricePerUnit?: string;
  harvestDate?: string;
  description?: string;
}

const ProductListingForm: React.FC<ProductListingFormProps> = ({
  farmId,
  farmName,
  listing,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const t = es.productListing;

  const [formData, setFormData] = useState({
    productName: listing?.productName || '',
    quantity: listing?.quantity || 0,
    unit: listing?.unit || '',
    pricePerUnit: listing?.pricePerUnit || 0,
    harvestDate: listing?.harvestDate || '',
    description: listing?.description || '',
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(listing?.images || []);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericValue = name === 'quantity' || name === 'pricePerUnit' ? Number(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: numericValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Crear previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = t.errors.nameRequired;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = t.errors.quantityPositive;
    }
    if (!formData.unit.trim()) {
      newErrors.unit = t.errors.unitRequired;
    }
    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = t.errors.pricePositive;
    }
    if (!formData.harvestDate) {
      newErrors.harvestDate = t.errors.harvestDateRequired;
    }
    if (!formData.description.trim()) {
      newErrors.description = t.errors.descriptionRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        farmId,
        farmName,
        productName: formData.productName,
        quantity: formData.quantity,
        unit: formData.unit,
        pricePerUnit: formData.pricePerUnit,
        harvestDate: formData.harvestDate,
        description: formData.description,
        images: imagePreviewUrls,
        available: true,
      });
    }
  };

  const totalValue = formData.quantity * formData.pricePerUnit;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">
                {listing ? t.editProductListing : t.addProductListing}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Finca: {farmName}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Nombre del Producto */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t.productName} <span className="text-red-500">*</span>
            </label>
            <Input
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder={t.placeholders.productName}
              className={errors.productName ? 'border-red-500' : ''}
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-500">{errors.productName}</p>
            )}
          </div>

          {/* Cantidad y Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t.quantity} <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder={t.placeholders.quantity}
                min="0"
                step="1"
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t.unit} <span className="text-red-500">*</span>
              </label>
              <Input
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder={t.placeholders.unit}
                className={errors.unit ? 'border-red-500' : ''}
              />
              {errors.unit && (
                <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Precio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t.pricePerUnit} <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="pricePerUnit"
                value={formData.pricePerUnit}
                onChange={handleInputChange}
                placeholder={t.placeholders.pricePerUnit}
                min="0"
                step="0.01"
                className={errors.pricePerUnit ? 'border-red-500' : ''}
              />
              {errors.pricePerUnit && (
                <p className="mt-1 text-sm text-red-500">{errors.pricePerUnit}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t.totalValue}
              </label>
              <div className="px-4 py-2 rounded-lg font-semibold text-black" style={{ backgroundColor: 'rgba(209, 231, 81, 0.25)' }}>
                ${totalValue.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Fecha de Cosecha */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t.harvestDate} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleInputChange}
                className={errors.harvestDate ? 'border-red-500' : ''}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.harvestDate && (
              <p className="mt-1 text-sm text-red-500">{errors.harvestDate}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t.productDescription} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t.placeholders.productDescription}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26ade4] ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Imágenes del Producto */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t.productImages} <span className="text-red-500">*</span>
            </label>
            
            {/* Preview de imágenes */}
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-3">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Producto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#26ade4] transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">{es.farmForm.dragOrClick}</p>
              <p className="text-xs text-gray-500">{es.farmForm.imageFormats}</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 gradient-green text-black rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? t.saving : t.publish}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-black hover:bg-gray-50 transition-all"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListingForm;
