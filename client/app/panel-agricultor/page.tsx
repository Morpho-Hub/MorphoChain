'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FarmerDashboard, FarmForm } from '@/src/organisms';
import type { Farm } from '@/src/molecules/FarmCard';
import { farmService, productService } from '@/src/services';
import { useAuth } from '@/contexts/AuthContext';

export default function FarmerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [productsMap, setProductsMap] = useState<Record<string, number>>({});

  // Cargar fincas del usuario
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load products first
      const productCount: Record<string, number> = {};
      try {
        const productsResponse = await productService.getMyProducts();
        console.log('📦 Products response:', productsResponse);
        
        if (productsResponse.success && productsResponse.data) {
          productsResponse.data.forEach((product: any) => {
            const farmId = typeof product.farm === 'string' ? product.farm : product.farm?._id;
            if (farmId) {
              productCount[farmId] = (productCount[farmId] || 0) + 1;
            }
          });
          setProductsMap(productCount);
          console.log('📦 Products loaded:', productsResponse.data.length, 'products');
          console.log('📊 Products by farm:', productCount);
        }
      } catch (productError) {
        console.error('Error loading products:', productError);
      }

      // Then load farms with product counts
      const farmsResponse = await farmService.getMyFarms();
      console.log('🌾 Farms response:', farmsResponse);
      
      if (farmsResponse.success && farmsResponse.data) {
        const normalizedFarms = farmsResponse.data.map((farm: any) => normalizeFarm(farm, productCount));
        setFarms(normalizedFarms);
        console.log('🌾 Normalized farms:', normalizedFarms);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeFarm = (farm: any, productCount: Record<string, number> = {}): Farm => {
    const farmId = farm._id || farm.id;
    const count = productCount[farmId] || 0;
    console.log(`🌾 Normalizing farm ${farm.name} (${farmId}): ${count} products`);
    return {
      id: farmId,
      name: farm.name,
      location: farm.location?.address || farm.location?.city || farm.location || 'Ubicación no especificada',
      description: farm.description || '',
      estimatedEarnings: 0,
      receivedEarnings: 0,
      productSalesEarnings: 0,
      tokenEarnings: 0,
      products: [],
      productsCount: productCount[farmId] || 0,
      sustainability: farm.impactMetrics?.biodiversityScore || 0,
      practices: farm.practices?.length || farm.certifications?.length || 0,
      images: farm.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
      certifications: farm.certifications?.map((cert: any) => typeof cert === 'string' ? cert : cert.name) || [],
      environmentalMetrics: farm.impactMetrics ? {
        carbonReduction: farm.impactMetrics.co2Reduction || 0,
        waterSaved: farm.impactMetrics.waterUsageReduction || 0,
        soilHealth: farm.impactMetrics.soilHealth || 0,
        biodiversityIndex: farm.impactMetrics.biodiversityScore || 0,
        verificationStatus: farm.verificationStatus || 'pending' as const,
        lastVerificationDate: farm.lastVerificationDate || new Date().toISOString(),
        nextVerificationDate: farm.nextVerificationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      } : undefined
    };
  };

  const handleAddFarm = () => {
    setEditingFarm(undefined);
    setShowForm(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  // @ts-ignore - Type mismatch between FarmCard.Farm and farmService.Farm
  const handleSaveFarm = async (farmData: any) => {
    setIsSaving(true);
    
    console.log('💾 Saving farm with data:', farmData);
    console.log('💾 Token in localStorage:', localStorage.getItem('token'));
    
    try {
      if (editingFarm) {
        // Editar finca existente
        console.log('✏️ Editing existing farm:', editingFarm.id);
        const response = await farmService.update(editingFarm.id, farmData);
        console.log('✏️ Update response:', response);
        if (response.success && response.data) {
          const normalizedUpdatedFarm = normalizeFarm(response.data);
          // @ts-ignore
          setFarms(farms.map(f => 
            f.id === editingFarm.id ? normalizedUpdatedFarm : f
          ));
        }
      } else {
        // Crear nueva finca
        console.log('➕ Creating new farm');
        const response = await farmService.create(farmData);
        console.log('➕ Create response:', response);
        if (response.success && response.data) {
          const newFarm = response.data;
          const normalizedFarm = normalizeFarm(newFarm);
          // @ts-ignore
          setFarms([...farms, normalizedFarm]);

          // Tokenizar automáticamente si tiene datos de sostenibilidad
          if (farmData.sustainabilityData) {
            console.log('🌱 Tokenizing farm with sustainability data...');
            try {
              const tokenizeResponse = await farmService.tokenize(newFarm.id!, {
                sustainabilityScore: farmData.sustainabilityData.sustainabilityScore || 0,
                carbonScore: farmData.sustainabilityData.carbonScore || 0,
                soilHealth: farmData.sustainabilityData.soilHealth || 0,
                waterUsage: farmData.sustainabilityData.waterUsage || 0,
                biodiversity: farmData.sustainabilityData.biodiversity || 0,
              });

              if (tokenizeResponse.success) {
                console.log('✅ Farm tokenized successfully:', tokenizeResponse.data);
                // Actualizar la farm con los datos de tokenización
                if (tokenizeResponse.data) {
                  const normalizedTokenizedFarm = normalizeFarm(tokenizeResponse.data);
                  // @ts-ignore
                  setFarms(prevFarms => prevFarms.map(f =>
                    f.id === newFarm.id ? normalizedTokenizedFarm : f
                  ));
                }
              } else {
                console.error('❌ Tokenization failed:', tokenizeResponse.error);
              }
            } catch (tokenError) {
              console.error('❌ Tokenization error:', tokenError);
            }
          } else {
            console.log('ℹ️ No sustainability data provided. Farm created without tokenization.');
            console.log('💡 You can add environmental metrics and tokenize the farm later.');
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
                category: farmData.category || 'other' // Usar la categoría de la finca
              });
            } catch (productError) {
              console.error('Product creation error:', productError);
            }
          }
        }
      }
      setShowForm(false);
      setEditingFarm(undefined);
      
      // Reload farms and products to get fresh data
      await loadData();
    } catch (error) {
      console.error('❌ Error saving farm:', error);
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
        totalProducts={Object.values(productsMap).reduce((sum, count) => sum + count, 0)}
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
