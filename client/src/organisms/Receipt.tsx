'use client';

import React from 'react';
import { Badge, Separator, Text, Heading } from '@/src/atoms';
import { es } from '@/locales';

export interface PurchaseProduct {
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface ReceiptData {
  orderNumber: string;
  date: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  farmName: string;
  farmLocation: string;
  products: PurchaseProduct[];
  subtotal: number;
  regenerativeReward: number;
  total: number;
  status: 'paid' | 'pending';
}

interface ReceiptProps {
  data: ReceiptData;
}

const Receipt: React.FC<ReceiptProps> = ({ data }) => {
  const t = es.receipt;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto" id="receipt-content" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#26ade4' }}>
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <Heading level={1} className="text-3xl">MorphoChain</Heading>
        </div>
        <Text variant="caption" className="text-gray-600">{t.subtitle}</Text>
      </div>

      {/* Order Info */}
      <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#f9fafb' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="small" className="text-gray-600 mb-1">{t.orderNumber}</Text>
            <Text className="font-semibold">#{data.orderNumber}</Text>
          </div>
          <div className="text-right">
            <Text variant="small" className="text-gray-600 mb-1">{t.date}</Text>
            <Text className="font-semibold">{formatDate(data.date)}</Text>
          </div>
        </div>
      </div>

      {/* Buyer & Seller Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <Text variant="small" className="text-gray-600 mb-2">{t.buyer}</Text>
          <Text className="font-semibold">{data.buyerName}</Text>
          <Text variant="caption" className="text-gray-600">{data.buyerEmail}</Text>
        </div>
        <div>
          <Text variant="small" className="text-gray-600 mb-2">{t.seller}</Text>
          <Text className="font-semibold">{data.sellerName}</Text>
          <Text variant="caption" className="text-gray-600">{t.farm}: {data.farmName}</Text>
          <Text variant="caption" className="text-gray-600">{data.farmLocation}</Text>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Products */}
      <div className="mb-6">
        <Text className="font-semibold mb-4">{t.products}</Text>
        <div className="space-y-3">
          {data.products.map((product, index) => (
            <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <Text className="font-medium">{product.name}</Text>
                <Text variant="caption" className="text-gray-600">
                  {product.quantity} {product.unit} × {formatCurrency(product.unitPrice)}
                </Text>
              </div>
              <Text className="font-semibold">
                {formatCurrency(product.quantity * product.unitPrice)}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <Text className="text-gray-600">{t.subtotal}</Text>
          <Text className="font-medium">{formatCurrency(data.subtotal)}</Text>
        </div>
        <div className="flex justify-between">
          <Text className="text-green-600">{t.regenerativeReward}</Text>
          <Text className="font-medium text-green-600">+{formatCurrency(data.regenerativeReward)}</Text>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <Heading level={3}>{t.total}</Heading>
          <Heading level={2} className="text-[#26ade4]">{formatCurrency(data.total)}</Heading>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-lg p-4 mb-6 text-center" style={{ backgroundColor: '#f9fafb' }}>
        <Text variant="small" className="text-gray-600 mb-2">{t.status}</Text>
        <Badge variant={data.status === 'paid' ? 'success' : 'warning'}>
          {data.status === 'paid' ? t.statusPaid : t.statusPending}
        </Badge>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-200">
        <Text variant="caption" className="text-gray-600">{t.footer}</Text>
      </div>
    </div>
  );
};

export default Receipt;
