'use client';

import React from 'react';
import { Calendar, Package, Trash2 } from 'lucide-react';
import { Chip } from '@/src/atoms';
import { es } from '@/locales';
import type { ProductListing } from '@/src/organisms/ProductListingForm';

interface ProductListingCardProps {
  listing: ProductListing;
  onDelete?: (listingId: string) => void;
}

const ProductListingCard: React.FC<ProductListingCardProps> = ({ listing, onDelete }) => {
  const t = es.productListing;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalValue = listing.quantity * listing.pricePerUnit;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-morpho transition-all">
      {/* Imagen principal */}
      <div className="relative h-48 bg-gray-200">
        {listing.images && listing.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.images[0]}
            alt={listing.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          <Chip
            label={listing.available ? t.available : t.soldOut}
            variant={listing.available ? 'success' : 'warning'}
            size="sm"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Header con nombre */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-black mb-1">
            {listing.productName}
          </h3>
          <p className="text-sm text-gray-600">{listing.farmName}</p>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Información de cantidad y precio */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(77, 188, 233, 0.15)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-gray-600" />
              <p className="text-xs font-medium text-gray-600">{t.quantity}</p>
            </div>
            <p className="text-lg font-bold text-black">
              {listing.quantity} {listing.unit}
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(209, 231, 81, 0.15)' }}>
            <p className="text-xs font-medium text-gray-600 mb-1">
              {t.pricePerUnit}
            </p>
            <p className="text-lg font-bold text-black">
              {formatCurrency(listing.pricePerUnit)}
            </p>
          </div>
        </div>

        {/* Fecha de cosecha */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Cosecha: {formatDate(listing.harvestDate)}</span>
        </div>

        {/* Total value y acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600">{t.totalValue}</p>
            <p className="text-xl font-bold text-black">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <button
            onClick={() => onDelete?.(listing.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t.deleteConfirm}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListingCard;
