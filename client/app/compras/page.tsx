'use client';

import React, { useState } from 'react';
import { Download, ShoppingBag, Calendar, FileText } from 'lucide-react';
import { Button, Card, Heading, Text, Badge, Separator } from '@/src/atoms';
import { ReceiptModal } from '@/src/organisms';
import type { ReceiptData } from '@/src/organisms/Receipt';
import { es } from '@/locales';
import { useRouter } from 'next/navigation';

// Mock data - En producción esto vendría de una API o localStorage
const mockPurchases: ReceiptData[] = [
  {
    orderNumber: 'MCH-12345678',
    date: '2025-01-15T10:30:00Z',
    buyerName: 'María González',
    buyerEmail: 'maria@example.com',
    sellerName: 'Juan Pérez',
    farmName: 'Finca Verde - Plantación de Café',
    farmLocation: 'Cartago, Costa Rica',
    products: [
      { name: 'Café Verde Premium', quantity: 5, unitPrice: 18, unit: 'lb' },
      { name: 'Café Tostado Artesanal', quantity: 3, unitPrice: 22, unit: 'lb' },
    ],
    subtotal: 156,
    regenerativeReward: 7.8, // 5% recompensa
    total: 163.8,
    status: 'paid',
  },
  {
    orderNumber: 'MCH-12345679',
    date: '2025-01-10T14:20:00Z',
    buyerName: 'María González',
    buyerEmail: 'maria@example.com',
    sellerName: 'María Rodríguez',
    farmName: 'Cacao del Sol - Cacao Orgánico',
    farmLocation: 'Limón, Costa Rica',
    products: [
      { name: 'Cacao en Grano Premium', quantity: 10, unitPrice: 15, unit: 'lb' },
    ],
    subtotal: 150,
    regenerativeReward: 7.5, // 5% recompensa
    total: 157.5,
    status: 'paid',
  },
  {
    orderNumber: 'MCH-12345680',
    date: '2024-12-28T09:15:00Z',
    buyerName: 'María González',
    buyerEmail: 'maria@example.com',
    sellerName: 'Carlos Jiménez',
    farmName: 'Cooperativa de Banano Tropical',
    farmLocation: 'Puntarenas, Costa Rica',
    products: [
      { name: 'Banano Orgánico Premium', quantity: 20, unitPrice: 12, unit: 'caja' },
    ],
    subtotal: 240,
    regenerativeReward: 12, // 5% recompensa
    total: 252,
    status: 'paid',
  },
];

export default function PurchasesPage() {
  const router = useRouter();
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  
  const t = es.purchases;

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
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredPurchases = mockPurchases.filter(purchase => {
    if (filterStatus === 'all') return true;
    return purchase.status === filterStatus;
  });

  const handleViewReceipt = (purchase: ReceiptData) => {
    setSelectedReceipt(purchase);
    setShowReceipt(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Heading level={1} className="text-4xl">{t.title}</Heading>
          <Text className="text-lg text-gray-600">{t.subtitle}</Text>
        </div>

        {/* Filters */}
        <Card className="p-4 rounded-xl border-2 border-[#d1e751]/30">
          <div className="flex gap-3">
            <Button
              title={t.filters.all}
              onClick={() => setFilterStatus('all')}
              variant={filterStatus === 'all' ? 'blue' : 'white_bordered'}
              className="rounded-lg px-6"
            />
            <Button
              title={t.filters.paid}
              onClick={() => setFilterStatus('paid')}
              variant={filterStatus === 'paid' ? 'blue' : 'white_bordered'}
              className="rounded-lg px-6"
            />
            <Button
              title={t.filters.pending}
              onClick={() => setFilterStatus('pending')}
              variant={filterStatus === 'pending' ? 'blue' : 'white_bordered'}
              className="rounded-lg px-6"
            />
          </div>
        </Card>

        {/* Purchases List */}
        {filteredPurchases.length === 0 ? (
          <Card className="p-12 rounded-2xl border-2 border-gray-200 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <Heading level={2} className="mb-2">{t.empty}</Heading>
            <Text className="text-gray-600 mb-6">{t.emptySubtitle}</Text>
            <Button
              title={t.goToMarket}
              onClick={() => router.push('/mercado')}
              variant="blue"
              className="bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl px-8 py-4"
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <Card
                key={purchase.orderNumber}
                className="p-6 rounded-xl border-2 border-gray-200 hover:shadow-morpho transition-shadow"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left Side - Purchase Info */}
                  <div className="flex-1 space-y-3">
                    {/* Order Number & Date */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <Text className="font-semibold">
                          {t.orderNumber} #{purchase.orderNumber}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <Text variant="caption">{formatDate(purchase.date)}</Text>
                      </div>
                      <Badge variant={purchase.status === 'paid' ? 'success' : 'warning'}>
                        {purchase.status === 'paid' ? es.receipt.statusPaid : es.receipt.statusPending}
                      </Badge>
                    </div>

                    {/* Farm */}
                    <div>
                      <Text className="font-medium text-black">{purchase.farmName}</Text>
                      <Text variant="caption" className="text-gray-600">
                        {t.farm}: {purchase.sellerName} • {purchase.farmLocation}
                      </Text>
                    </div>

                    {/* Products */}
                    <div>
                      <Text variant="small" className="text-gray-600 mb-1">
                        {t.products} ({purchase.products.length}):
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        {purchase.products.map((product, idx) => (
                          <Badge key={idx} variant="default">
                            {product.name} ({product.quantity} {product.unit})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Total & Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <Text variant="small" className="text-gray-600 mb-1">
                        {t.total}
                      </Text>
                      <Heading level={2} className="text-[#26ade4]">
                        {formatCurrency(purchase.total)}
                      </Heading>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        title={t.viewReceipt}
                        icon={<FileText className="w-4 h-4" />}
                        iconPosition="left"
                        onClick={() => handleViewReceipt(purchase)}
                        variant="white_bordered"
                        className="rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setSelectedReceipt(null);
          }}
          receiptData={selectedReceipt}
        />
      )}
    </div>
  );
}
