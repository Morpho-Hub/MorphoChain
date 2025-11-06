'use client';

import React, { useState } from 'react';
import { Package, Plus, Minus, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button, Badge, Input, Text, Heading } from '@/src/atoms';
import { es } from '@/locales';

export interface ProductInventory {
  id: string;
  name: string;
  farmName: string;
  farmId: string;
  currentStock: number;
  unit: string;
  price: number;
  lastUpdated: string;
  lowStockThreshold?: number;
}

interface ProductInventoryCardProps {
  product: ProductInventory;
  onUpdateStock: (productId: string, newStock: number) => void;
}

const ProductInventoryCard: React.FC<ProductInventoryCardProps> = ({ product, onUpdateStock }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stockInput, setStockInput] = useState(product.currentStock.toString());
  const [action, setAction] = useState<'add' | 'remove' | 'set'>('set');
  
  const t = es.inventory;

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStockStatus = () => {
    if (product.currentStock === 0) return 'outOfStock';
    if (product.lowStockThreshold && product.currentStock <= product.lowStockThreshold) return 'lowStock';
    return 'inStock';
  };

  const handleUpdateStock = () => {
    const value = parseInt(stockInput) || 0;
    let newStock = product.currentStock;

    switch (action) {
      case 'add':
        newStock = product.currentStock + value;
        break;
      case 'remove':
        newStock = Math.max(0, product.currentStock - value);
        break;
      case 'set':
        newStock = value;
        break;
    }

    onUpdateStock(product.id, newStock);
    setIsEditing(false);
    setStockInput(newStock.toString());
  };

  const stockStatus = getStockStatus();
  const stockVariant: "danger" | "warning" | "success" = stockStatus === 'outOfStock' ? 'danger' : stockStatus === 'lowStock' ? 'warning' : 'success';

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-morpho transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d1e751' }}>
              <Package className="w-6 h-6 text-black" />
            </div>
            <div>
              <Heading level={3} className="text-lg">{product.name}</Heading>
              <Text variant="caption" className="text-gray-600">{product.farmName}</Text>
            </div>
          </div>
        </div>
        <Badge variant={stockVariant}>
          {stockStatus === 'outOfStock' ? t.outOfStock : stockStatus === 'lowStock' ? t.lowStock : t.inStock}
        </Badge>
      </div>

      {/* Stock Info */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
        <div>
          <Text variant="small" className="text-gray-600 mb-1">{t.currentStock}</Text>
          <div className="flex items-baseline gap-2">
            <Heading level={2} className="text-2xl">{product.currentStock}</Heading>
            <Text variant="caption" className="text-gray-600">{product.unit}</Text>
          </div>
        </div>
        <div>
          <Text variant="small" className="text-gray-600 mb-1">{t.price}</Text>
          <Heading level={3} className="text-xl">{formatCurrency(product.price)}</Heading>
          <Text variant="caption" className="text-gray-600">/ {product.unit}</Text>
        </div>
        <div>
          <Text variant="small" className="text-gray-600 mb-1">Valor Total</Text>
          <Heading level={3} className="text-xl text-[#26ade4]">
            {formatCurrency(product.currentStock * product.price)}
          </Heading>
        </div>
      </div>

      {/* Last Updated */}
      <Text variant="caption" className="text-gray-600 mb-4">
        {t.lastUpdated}: {formatDate(product.lastUpdated)}
      </Text>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="space-y-4 p-4 rounded-lg border-2" style={{ borderColor: '#d1e751', backgroundColor: '#d1e75110' }}>
          {/* Action Selector */}
          <div className="flex gap-2">
            <Button
              title={t.addStock}
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => setAction('add')}
              variant={action === 'add' ? 'blue' : 'white_bordered'}
              className="flex-1 rounded-lg py-2 text-sm"
            />
            <Button
              title={t.removeStock}
              icon={<Minus className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => setAction('remove')}
              variant={action === 'remove' ? 'blue' : 'white_bordered'}
              className="flex-1 rounded-lg py-2 text-sm"
            />
            <Button
              title={t.setStock}
              icon={<Edit2 className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => setAction('set')}
              variant={action === 'set' ? 'blue' : 'white_bordered'}
              className="flex-1 rounded-lg py-2 text-sm"
            />
          </div>

          {/* Stock Input */}
          <div>
            <Text variant="small" className="mb-2">
              {action === 'add' ? 'Cantidad a agregar' : action === 'remove' ? 'Cantidad a reducir' : t.newStock}
            </Text>
            <Input
              type="number"
              min="0"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              placeholder="0"
              className="w-full"
            />
            {action !== 'set' && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                {action === 'add' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <Text variant="caption">
                  Nuevo stock: <span className="font-semibold">
                    {action === 'add' 
                      ? product.currentStock + (parseInt(stockInput) || 0)
                      : Math.max(0, product.currentStock - (parseInt(stockInput) || 0))
                    } {product.unit}
                  </span>
                </Text>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              title={t.confirm}
              onClick={handleUpdateStock}
              variant="blue"
              className="flex-1 bg-[#d1e751] hover:bg-[#d1e751]/90 text-black rounded-lg py-3"
            />
            <Button
              title={t.cancel}
              onClick={() => {
                setIsEditing(false);
                setStockInput(product.currentStock.toString());
                setAction('set');
              }}
              variant="white_bordered"
              className="flex-1 rounded-lg py-3"
            />
          </div>
        </div>
      ) : (
        <Button
          title={t.updateStock}
          icon={<Edit2 className="w-4 h-4" />}
          iconPosition="left"
          onClick={() => setIsEditing(true)}
          variant="blue"
          className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-lg py-3"
        />
      )}
    </div>
  );
};

export default ProductInventoryCard;
