'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FarmerDashboard, FarmForm } from '@/src/organisms';
import type { Farm } from '@/src/molecules/FarmCard';

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
      productSalesEarnings: 28900,
      tokenEarnings: 3500,
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
      productSalesEarnings: 18700,
      tokenEarnings: 2800,
      products: ['Tomate Cherry', 'Lechuga', 'Zanahoria'],
      productsCount: 3,
      sustainability: 88,
      practices: 3,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleViewDetails = (farm: Farm) => {
    router.push(`/finca/${farm.id}`);
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
        onViewDetails={handleViewDetails}
      />

      {showForm && (
        <FarmForm
          farm={editingFarm}
          onSave={handleSaveFarm}
          onCancel={handleCancelForm}
          isSaving={isSaving}
          requireEnvironmentalSurvey={!editingFarm} // Solo para nuevas fincas
        />
      )}
    </>
  );
}
