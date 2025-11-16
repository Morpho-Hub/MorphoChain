'use client';

import React, { useState, useEffect } from 'react';
import { Download, ShoppingBag, Calendar, FileText } from 'lucide-react';
import { Button, Card, Heading, Text, Badge, Separator } from '@/src/atoms';
import { ReceiptModal } from '@/src/organisms';
import type { ReceiptData } from '@/src/organisms/Receipt';
import { es } from '@/locales';
import { useRouter } from 'next/navigation';
import { transactionService } from '@/src/services';
import { useAuth } from '@/contexts/AuthContext';

export default function PurchasesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<ReceiptData[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  
  const t = es.purchases;

  // Load purchases from backend
  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setLoading(true);
        const response = await transactionService.getMyTransactions();
        
        if (response.success && response.data) {
          // Filter only purchase transactions and format them as ReceiptData
          const purchaseReceipts = response.data
            .filter(tx => tx.type === 'product-purchase')
            .map(tx => {
              const metadata = tx.metadata || {};
              
              return {
                orderNumber: `MCH-${tx._id.slice(-8)}`,
                date: tx.createdAt || new Date().toISOString(),
                buyerName: user ? `${user.firstName} ${user.lastName}` : 'Usuario',
                buyerEmail: user?.email || '',
                sellerName: metadata.sellerName || 'Agricultor',
                farmName: metadata.farmName || 'Finca',
                farmLocation: metadata.farmLocation || 'Costa Rica',
                products: metadata.products || [],
                subtotal: metadata.subtotal || tx.amount,
                regenerativeReward: metadata.regenerativeReward || 0,
                total: tx.amount,
                status: tx.status === 'completed' ? 'paid' as const : 'pending' as const,
              };
            });
          
          setPurchases(purchaseReceipts);
        }
      } catch (error) {
        console.error('Error loading purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [user]);

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

  const filteredPurchases = purchases.filter(purchase => {
    if (filterStatus === 'all') return true;
    return purchase.status === filterStatus;
  });

  const handleViewReceipt = (purchase: ReceiptData) => {
    setSelectedReceipt(purchase);
    setShowReceipt(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Text className="text-xl">Cargando compras...</Text>
      </div>
    );
  }

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
