'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/src/atoms';
import { ImageUpload } from '@/src/molecules';
import { es } from '@/locales';

export interface ProductListing {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  status?: 'draft' | 'active' | 'out-of-stock' | 'discontinued' | 'pending';
  images?: string[];
  description?: string;
  category?: string;
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
  name?: string;
  stock?: string;
  unit?: string;
  price?: string;
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
    name: listing?.name || '',
    stock: listing?.stock || 0,
    unit: listing?.unit || '',
    price: listing?.price || 0,
    description: listing?.description || '',
    category: listing?.category || '',
    images: listing?.images || [],
  });

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }
    if (!formData.stock || formData.stock <= 0) {
      newErrors.stock = 'El stock debe ser mayor a 0';
    }
    if (!formData.unit.trim()) {
      newErrors.unit = 'La unidad de medida es requerida';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: formData.name,
        stock: formData.stock,
        unit: formData.unit,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        images: formData.images,
        status: 'active',
      });
    }
  };

  const totalValue = formData.stock * formData.price;

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
          {/* Imágenes del Producto */}
          <ImageUpload
            images={formData.images}
            onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
            maxImages={5}
            label="Imágenes del Producto"
          />

          {/* Nombre del Producto */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej: Café Orgánico"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26ade4] border-gray-300"
            >
              <option value="">Selecciona una categoría</option>
              <option value="café">Café</option>
              <option value="cacao">Cacao</option>
              <option value="banana">Banana/Plátano</option>
              <option value="piña">Piña</option>
              <option value="frutas">Frutas</option>
              <option value="vegetales">Vegetales</option>
              <option value="granos">Granos</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Descripción del Producto
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe las características de tu producto..."
              rows={3}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26ade4] border-gray-300 resize-none"
            />
          </div>

          {/* Stock y Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Stock Disponible <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Ej: 100"
                min="0"
                step="1"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Unidad de Medida <span className="text-red-500">*</span>
              </label>
              <Input
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder="Ej: kg, lb, unidad"
                className={errors.unit ? 'border-red-500' : ''}
              />
              {errors.unit && (
                <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Precio y Valor Total */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Precio por {formData.unit || 'unidad'} <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ej: 25.00"
                min="0"
                step="0.01"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Valor Total Inventario
              </label>
              <div className="px-4 py-2 rounded-lg font-semibold text-black" style={{ backgroundColor: 'rgba(209, 231, 81, 0.25)' }}>
                ${totalValue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 gradient-green text-black rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Agregar Producto'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-black hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListingForm;
