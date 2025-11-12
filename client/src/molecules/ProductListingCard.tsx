'use client';

import React from 'react';
import { Calendar, Package, Trash2, Edit2 } from 'lucide-react';
import { Chip } from '@/src/atoms';
import { es } from '@/locales';
import type { ProductListing } from '@/src/organisms/ProductListingForm';

interface ProductListingCardProps {
  listing: ProductListing;
  onEdit?: (listing: ProductListing) => void;
  onDelete?: (listingId: string) => void;
}

const ProductListingCard: React.FC<ProductListingCardProps> = ({ listing, onEdit, onDelete }) => {
  const t = es.productListing;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status?: string) => {
    const statusMap: Record<string, string> = {
      'draft': 'Borrador',
      'active': 'Activo',
      'out-of-stock': 'Sin stock',
      'discontinued': 'Descontinuado',
      'pending': 'Pendiente'
    };
    return statusMap[status || 'draft'] || 'Desconocido';
  };

  const getStatusVariant = (status?: string): 'success' | 'warning' | 'default' => {
    if (status === 'active') return 'success';
    if (status === 'out-of-stock' || status === 'discontinued') return 'warning';
    return 'default';
  };

  const totalValue = listing.stock * listing.price;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-morpho transition-all">
      {/* Header con imagen o icono */}
      <div className="relative h-32 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden">
        {listing.images && listing.images.length > 0 ? (
          <img 
            src={listing.images[0]} 
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-16 h-16 text-green-600" />
        )}
        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          <Chip
            label={getStatusLabel(listing.status)}
            variant={getStatusVariant(listing.status)}
            size="sm"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Header con nombre */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-black mb-1">
            {listing.name}
          </h3>
        </div>

        {/* Información de cantidad y precio */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(77, 188, 233, 0.15)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-gray-600" />
              <p className="text-xs font-medium text-gray-600">Stock</p>
            </div>
            <p className="text-lg font-bold text-black">
              {listing.stock} {listing.unit}
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(209, 231, 81, 0.15)' }}>
            <p className="text-xs font-medium text-gray-600 mb-1">
              Precio/{listing.unit}
            </p>
            <p className="text-lg font-bold text-black">
              {formatCurrency(listing.price)}
            </p>
          </div>
        </div>

        {/* Total value y acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Valor Total</p>
            <p className="text-xl font-bold text-black">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(listing)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                style={{ color: 'var(--morpho-blue)' }}
                title="Editar producto"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(listing.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar producto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingCard;
