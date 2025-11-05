'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FarmerDashboard, FarmForm, ProductListingForm } from '@/src/organisms';
import { ProductListingCard } from '@/src/molecules';
import type { Farm } from '@/src/molecules/FarmCard';
import type { ProductListing } from '@/src/organisms/ProductListingForm';
import { es } from '@/locales';

export default function FarmerDashboardPage() {
  const router = useRouter();

  // Datos de ejemplo (en producción vendrían de una API/base de datos)
  const [farms, setFarms] = useState<Farm[]>([
    {
      id: '1',
      name: 'Finca Verde - Café Orgánico',
      location: 'Cartago, Costa Rica',
      description: 'Finca especializada en café orgánico de altura',
      estimatedEarnings: 45600,
      receivedEarnings: 32400,
      products: ['Café Arábica', 'Café Robusta'],
      productsCount: 2,
      sustainability: 92,
      practices: 3,
    },
    {
      id: '2',
      name: 'Huerto Esperanza',
      location: 'Alajuela, Costa Rica',
      description: 'Cultivo diversificado de vegetales y hortalizas',
      estimatedEarnings: 28300,
      receivedEarnings: 21500,
      products: ['Tomate Cherry', 'Lechuga', 'Zanahoria'],
      productsCount: 3,
      sustainability: 88,
      practices: 3,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para productos en venta
  const [productListings, setProductListings] = useState<ProductListing[]>([]);
  const [showListingForm, setShowListingForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | undefined>(undefined);

  const t = es.productListing;

  const handleAddFarm = () => {
    setEditingFarm(undefined);
    setShowForm(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleSaveFarm = async (farmData: Omit<Farm, 'id'>) => {
    setIsSaving(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingFarm) {
      // Editar finca existente
      setFarms(farms.map(f => 
        f.id === editingFarm.id 
          ? { ...farmData, id: editingFarm.id }
          : f
      ));
    } else {
      // Agregar nueva finca
      const newFarm: Farm = {
        ...farmData,
        id: Date.now().toString(),
      };
      setFarms([...farms, newFarm]);
    }

    setIsSaving(false);
    setShowForm(false);
    setEditingFarm(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingFarm(undefined);
  };

  const handleDeleteFarm = (farmId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta finca?')) {
      setFarms(farms.filter(farm => farm.id !== farmId));
    }
  };

  const handleViewMarket = () => {
    router.push('/mercado');
  };

  const handleSellProduct = (farm: Farm) => {
    setSelectedFarm(farm);
    setShowListingForm(true);
  };

  const handleSaveProductListing = async (listingData: Omit<ProductListing, 'id'>) => {
    setIsSaving(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newListing: ProductListing = {
      ...listingData,
      id: Date.now().toString(),
    };
    
    setProductListings([...productListings, newListing]);
    setIsSaving(false);
    setShowListingForm(false);
    setSelectedFarm(undefined);
  };

  const handleCancelListingForm = () => {
    setShowListingForm(false);
    setSelectedFarm(undefined);
  };

  const handleDeleteListing = (listingId: string) => {
    if (confirm(t.deleteConfirm)) {
      setProductListings(productListings.filter(listing => listing.id !== listingId));
    }
  };

  return (
    <>
      <FarmerDashboard
        userName="Juan Pérez"
        farms={farms}
        onAddFarm={handleAddFarm}
        onEditFarm={handleEditFarm}
        onDeleteFarm={handleDeleteFarm}
        onViewMarket={handleViewMarket}
        onSellProduct={handleSellProduct}
      />

      {/* Sección de Productos en Venta */}
      {productListings.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <h2 className="text-2xl font-semibold text-black mb-6">
            {t.activeListings}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productListings.map((listing) => (
              <ProductListingCard
                key={listing.id}
                listing={listing}
                onDelete={handleDeleteListing}
              />
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <FarmForm
          farm={editingFarm}
          onSave={handleSaveFarm}
          onCancel={handleCancelForm}
          isSaving={isSaving}
        />
      )}

      {showListingForm && selectedFarm && (
        <ProductListingForm
          farmId={selectedFarm.id}
          farmName={selectedFarm.name}
          onSave={handleSaveProductListing}
          onCancel={handleCancelListingForm}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
