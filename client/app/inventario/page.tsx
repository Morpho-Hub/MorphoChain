'use client';

import React, { useState, useEffect } from 'react';
import { Package, Search, TrendingUp } from 'lucide-react';
import { Heading, Text, Card, Button, Select } from '@/src/atoms';
import { SearchBar, ProductInventoryCard } from '@/src/molecules';
import type { ProductInventory } from '@/src/molecules/ProductInventoryCard';
import { es } from '@/locales';
import { useRouter } from 'next/navigation';
import { productService, farmService } from '@/src/services';

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarm, setSelectedFarm] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');
  const [loading, setLoading] = useState(true);
  
  const t = es.inventory;

  // Load products from backend
  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        
        if (response.success && response.data) {
          const formattedInventory: ProductInventory[] = response.data.map(product => {
            const farm = typeof product.farm === 'object' ? product.farm : null;
            
            return {
              id: product._id,
              name: product.name,
              farmName: farm?.name || 'Finca',
              farmId: typeof product.farm === 'string' ? product.farm : farm?._id || '',
              currentStock: product.stock,
              unit: product.unit,
              price: product.price,
              lastUpdated: product.updatedAt || new Date().toISOString(),
              lowStockThreshold: 30, // Default threshold
            };
          });
          
          setInventory(formattedInventory);
        }
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  // Get unique farms
  const farms = Array.from(new Set(inventory.map(p => p.farmName))).map(name => ({
    value: name,
    label: name,
  }));
  const farmOptions = [{ value: 'all', label: t.allFarms }, ...farms];

  // Filter inventory
  const filteredInventory = inventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFarm = selectedFarm === 'all' || product.farmName === selectedFarm;
    
    let matchesStatus = true;
    if (filterStatus === 'outOfStock') matchesStatus = product.currentStock === 0;
    else if (filterStatus === 'lowStock') matchesStatus = product.currentStock > 0 && !!product.lowStockThreshold && product.currentStock <= product.lowStockThreshold;
    else if (filterStatus === 'inStock') matchesStatus = product.currentStock > (product.lowStockThreshold || 0);
    
    return matchesSearch && matchesFarm && matchesStatus;
  });

  // Calculate statistics
  const totalProducts = inventory.length;
  const totalValue = inventory.reduce((sum, p) => sum + (p.currentStock * p.price), 0);
  const lowStockCount = inventory.filter(p => p.lowStockThreshold && p.currentStock > 0 && p.currentStock <= p.lowStockThreshold).length;
  const outOfStockCount = inventory.filter(p => p.currentStock === 0).length;

  const handleUpdateStock = (productId: string, newStock: number) => {
    setInventory(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, currentStock: newStock, lastUpdated: new Date().toISOString() }
          : p
      )
    );
    // TODO: Sync with backend
    console.log(`Updated product ${productId} to stock ${newStock}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Heading level={1} className="text-4xl">{t.title}</Heading>
          <Text className="text-lg text-gray-600">{t.subtitle}</Text>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#26ade4' }}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text variant="small" className="text-gray-600">Total Productos</Text>
                <Heading level={2} className="text-2xl">{totalProducts}</Heading>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text variant="small" className="text-gray-600">Valor Total</Text>
                <Heading level={2} className="text-2xl">{formatCurrency(totalValue)}</Heading>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border-2 border-yellow-200 bg-yellow-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f59e0b' }}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text variant="small" className="text-gray-600">Stock Bajo</Text>
                <Heading level={2} className="text-2xl">{lowStockCount}</Heading>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border-2 border-red-200 bg-red-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <Text variant="small" className="text-gray-600">Agotados</Text>
                <Heading level={2} className="text-2xl">{outOfStockCount}</Heading>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 rounded-xl border-2 border-[#d1e751]/30">
          <div className="space-y-4">
            {/* Search */}
            <SearchBar
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Farm Filter */}
              <Select
                options={farmOptions}
                value={selectedFarm}
                onChange={(e) => setSelectedFarm(e.target.value)}
                className="lg:w-1/3"
              />

              {/* Status Filters */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  title={t.filters.all}
                  onClick={() => setFilterStatus('all')}
                  variant={filterStatus === 'all' ? 'blue' : 'white_bordered'}
                  className="rounded-lg px-6"
                />
                <Button
                  title={t.filters.inStock}
                  onClick={() => setFilterStatus('inStock')}
                  variant={filterStatus === 'inStock' ? 'blue' : 'white_bordered'}
                  className="rounded-lg px-6"
                />
                <Button
                  title={t.filters.lowStock}
                  onClick={() => setFilterStatus('lowStock')}
                  variant={filterStatus === 'lowStock' ? 'blue' : 'white_bordered'}
                  className="rounded-lg px-6"
                />
                <Button
                  title={t.filters.outOfStock}
                  onClick={() => setFilterStatus('outOfStock')}
                  variant={filterStatus === 'outOfStock' ? 'blue' : 'white_bordered'}
                  className="rounded-lg px-6"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Inventory Grid */}
        {filteredInventory.length === 0 ? (
          <Card className="p-12 rounded-2xl border-2 border-gray-200 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <Heading level={2} className="mb-2">{t.empty}</Heading>
            <Text className="text-gray-600 mb-6">{t.emptySubtitle}</Text>
            <Button
              title={t.goToDashboard}
              onClick={() => router.push('/panel-agricultor')}
              variant="blue"
              className="bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl px-8 py-4"
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((product) => (
              <ProductInventoryCard
                key={product.id}
                product={product}
                onUpdateStock={handleUpdateStock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
