'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FarmerDashboard, FarmForm } from '@/src/organisms';
import type { Farm } from '@/src/molecules/FarmCard';
import { farmService } from '@/src/services';
import { useAuth } from '@/contexts/AuthContext';

export default function FarmerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar fincas del usuario
  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const response = await farmService.getAll();
      if (response.success && response.data) {
        setFarms(response.data);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
    } finally {
      setLoading(false);
    }
  };

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
    
    try {
      if (editingFarm) {
        // Editar finca existente
        const response = await farmService.update(editingFarm.id, farmData);
        if (response.success && response.data) {
          setFarms(farms.map(f => 
            f.id === editingFarm.id ? response.data! : f
          ));
        }
      } else {
        // Crear nueva finca
        const response = await farmService.create(farmData);
        if (response.success && response.data) {
          const newFarm = response.data;
          setFarms([...farms, newFarm]);

          // Tokenizar automáticamente si tiene datos de sostenibilidad
          if (farmData.sustainabilityData) {
            try {
              const tokenizeResponse = await farmService.tokenize(newFarm.id!, {
                sustainabilityScore: farmData.sustainabilityData.sustainabilityScore || 0,
                carbonScore: farmData.sustainabilityData.carbonScore || 0,
                soilHealth: farmData.sustainabilityData.soilHealth || 0,
                waterUsage: farmData.sustainabilityData.waterUsage || 0,
                biodiversity: farmData.sustainabilityData.biodiversity || 0,
              });

              if (tokenizeResponse.success) {
                console.log('Farm tokenized successfully:', tokenizeResponse.data);
                // Actualizar la farm con los datos de tokenización
                if (tokenizeResponse.data) {
                  setFarms(prevFarms => prevFarms.map(f =>
                    f.id === newFarm.id ? tokenizeResponse.data! : f
                  ));
                }
              } else {
                console.error('Tokenization failed:', tokenizeResponse.error);
                alert('Finca creada pero la tokenización falló. Puedes intentar tokenizarla más tarde.');
              }
            } catch (tokenError) {
              console.error('Tokenization error:', tokenError);
              alert('Finca creada pero la tokenización falló. Puedes intentar tokenizarla más tarde.');
            }
          }

          // Crear producto en el marketplace si existe
          if (farmData.product) {
            try {
              await farmService.createProduct(newFarm.id!, {
                name: farmData.product.name,
                stock: farmData.product.stock,
                price: farmData.product.price,
                unit: farmData.product.unit,
                description: `${farmData.product.name} de ${farmData.name}`,
              });
            } catch (productError) {
              console.error('Product creation error:', productError);
            }
          }
        }
      }

      setShowForm(false);
      setEditingFarm(undefined);
    } catch (error) {
      console.error('Error saving farm:', error);
      alert('Error al guardar la finca. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingFarm(undefined);
  };

  const handleDeleteFarm = async (farmId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta finca?')) {
      try {
        const response = await farmService.delete(farmId);
        if (response.success) {
          setFarms(farms.filter(farm => farm.id !== farmId));
        }
      } catch (error) {
        console.error('Error deleting farm:', error);
        alert('Error al eliminar la finca. Por favor intenta de nuevo.');
      }
    }
  };

  const handleViewMarket = () => {
    router.push('/mercado');
  };

  const handleViewDetails = (farm: Farm) => {
    router.push(`/finca/${farm.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus fincas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FarmerDashboard
        userName={user ? `${user.firstName} ${user.lastName}` : "Agricultor"}
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
