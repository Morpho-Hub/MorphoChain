'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Leaf, 
  Droplet,
  Bird,
  Edit2,
  Trash2,
  Plus,
  Package,
  FileText,
  Upload,
  Download,
  X
} from 'lucide-react';
import { Chip } from '@/src/atoms';
import { ProductListingCard } from '@/src/molecules';
import { ProductListingForm, FarmForm, VerificationAlert } from '@/src/organisms';
import type { Farm } from '@/src/molecules/FarmCard';
import type { ProductListing } from '@/src/organisms/ProductListingForm';
import { es } from '@/locales';
import { farmService, productService, impactMetricsService } from '@/src/services';

export default function FarmDetailPage() {
  const router = useRouter();
  const params = useParams();
  const farmId = params.id as string;
  const t = es.farmDetail;

  const [farm, setFarm] = useState<Farm | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'metrics' | 'salesHistory'>('overview');
  const [productListings, setProductListings] = useState<ProductListing[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(true);
  const [certifications, setCertifications] = useState<string[]>(farm?.certifications || []);
  const [isSaving, setIsSaving] = useState(false);

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Finca no encontrada</h2>
          <button
            onClick={() => router.push('/panel-agricultor')}
            className="text-blue-600 hover:underline"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveProduct = async (listingData: Omit<ProductListing, 'id'>) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newListing: ProductListing = {
      ...listingData,
      id: `product-${productListings.length + 1}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setProductListings([...productListings, newListing]);
    setIsSaving(false);
    setShowProductForm(false);
  };

  const handleDeleteProduct = (listingId: string) => {
    if (confirm(es.productListing.deleteConfirm)) {
      setProductListings(productListings.filter(listing => listing.id !== listingId));
    }
  };

  const handleEditFarm = () => {
    setShowEditForm(true);
  };

  const handleSaveFarm = async (farmData: Omit<Farm, 'id' | 'estimatedEarnings' | 'receivedEarnings' | 'productsCount'>) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (farm) {
      const updatedFarm: Farm = {
        ...farm,
        ...farmData,
      };
      setFarm(updatedFarm);
      mockFarms[farmId] = updatedFarm;
    }
    
    setIsSaving(false);
    setShowEditForm(false);
  };

  const handleDeleteFarm = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteFarm = () => {
    // En producción, aquí haríamos una llamada a la API
    delete mockFarms[farmId];
    router.push('/panel-agricultor');
  };

  const handleAddCertification = (cert: string) => {
    if (cert.trim() && !certifications.includes(cert.trim())) {
      const newCerts = [...certifications, cert.trim()];
      setCertifications(newCerts);
      if (farm) {
        const updatedFarm = { ...farm, certifications: newCerts };
        setFarm(updatedFarm);
        mockFarms[farmId] = updatedFarm;
      }
    }
  };

  const handleDeleteCertification = (cert: string) => {
    const newCerts = certifications.filter(c => c !== cert);
    setCertifications(newCerts);
    if (farm) {
      const updatedFarm = { ...farm, certifications: newCerts };
      setFarm(updatedFarm);
      mockFarms[farmId] = updatedFarm;
    }
  };

  const practices = [
    'Rotación de cultivos',
    'Compostaje orgánico',
    'Agricultura regenerativa',
  ];

  const pendingEarnings = farm.estimatedEarnings - farm.receivedEarnings;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-earth text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push('/panel-agricultor')}
            className="flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backToDashboard}
          </button>

          <div className="flex items-start justify-between gap-6">
            {/* Farm Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-white/10 border-2 border-white/20 relative">
                {farm.images && farm.images.length > 0 ? (
                  <Image 
                    src={farm.images[0]} 
                    alt={farm.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="w-16 h-16 text-white/40" />
                  </div>
                )}
              </div>
            </div>

            {/* Farm Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{farm.name}</h1>
              <div className="flex items-center gap-2 text-white/90 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{farm.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {farm.products.map((product, index) => (
                  <Chip
                    key={index}
                    label={product}
                    variant="warning"
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleEditFarm}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title={t.editFarm}
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteFarm}
                className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                title={t.deleteFarm}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { key: 'overview', label: t.overview },
              { key: 'products', label: t.products },
              { key: 'metrics', label: t.metrics },
              { key: 'salesHistory', label: t.salesHistory },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'products' | 'metrics' | 'salesHistory')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#26ade4] text-[#26ade4]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Verification Alert */}
            {farm.environmentalMetrics && showVerificationAlert && (
              <VerificationAlert
                farmName={farm.name}
                metrics={farm.environmentalMetrics}
                onScheduleVerification={() => alert('Calendario de verificación')}
                onDismiss={() => setShowVerificationAlert(false)}
              />
            )}

            {/* Financial Metrics - Mejorado */}
            <div>
              <h2 className="text-2xl font-semibold text-black mb-4">{t.financialMetrics}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:shadow-morpho transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(209, 231, 81, 0.2)' }}>
                      <DollarSign className="w-7 h-7 text-black" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Proyectado
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t.estimatedEarnings}</p>
                  <p className="text-3xl font-bold text-black mb-2">{formatCurrency(farm.estimatedEarnings)}</p>
                  <p className="text-xs text-gray-500">Basado en producción estimada</p>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:shadow-morpho transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(77, 188, 233, 0.2)' }}>
                      <TrendingUp className="w-7 h-7 text-black" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      Confirmado
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t.receivedEarnings}</p>
                  <p className="text-3xl font-bold text-black mb-2">{formatCurrency(farm.receivedEarnings)}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="h-2 rounded-full gradient-earth" 
                      style={{ width: `${(farm.receivedEarnings / farm.estimatedEarnings) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:shadow-morpho transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-orange-100">
                      <TrendingUp className="w-7 h-7 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                      Pendiente
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t.pendingEarnings}</p>
                  <p className="text-3xl font-bold text-black mb-2">{formatCurrency(pendingEarnings)}</p>
                  <p className="text-xs text-gray-500">Por recibir</p>
                </div>
              </div>

              {/* Income Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-green-500">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ingresos por Venta de Productos</p>
                      <p className="text-xs text-gray-500">Ventas directas de cosecha</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-700">{formatCurrency(farm.productSalesEarnings || 0)}</p>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-gray-600">
                      {farm.receivedEarnings > 0 
                        ? `${((farm.productSalesEarnings / farm.receivedEarnings) * 100).toFixed(1)}% del total recibido`
                        : 'Sin ingresos aún'}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-[#26ade4]/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#26ade4]">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ingresos Pasivos por Tokenización</p>
                      <p className="text-xs text-gray-500">Rendimiento de tokens</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#26ade4]">{formatCurrency(farm.tokenEarnings || 0)}</p>
                  <div className="mt-3 pt-3 border-t border-[#26ade4]/20">
                    <p className="text-xs text-gray-600">
                      {farm.receivedEarnings > 0 
                        ? `${((farm.tokenEarnings / farm.receivedEarnings) * 100).toFixed(1)}% del total recibido`
                        : 'Sin ingresos aún'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Information & Practices - Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Description */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <MapPin className="w-5 h-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-black">{t.farmInformation}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{farm.description}</p>
                
                {/* Stats rápidas */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-black">{farm.productsCount}</p>
                    <p className="text-xs text-gray-600 mt-1">Productos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-black">{farm.sustainability}%</p>
                    <p className="text-xs text-gray-600 mt-1">Sostenibilidad</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-black">{farm.practices}</p>
                    <p className="text-xs text-gray-600 mt-1">Prácticas</p>
                  </div>
                </div>
              </div>

              {/* Sustainable Practices */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(209, 231, 81, 0.2)' }}>
                    <Leaf className="w-5 h-5 text-green-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-black">{t.sustainablePractices}</h2>
                </div>
                <div className="space-y-3">
                  {practices.map((practice, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-green-100">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{practice}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    🌱 Estas prácticas contribuyen a un índice de sostenibilidad del {farm.sustainability}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-black">{t.productsForSale}</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="gradient-green text-black px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-medium"
              >
                <Plus className="w-5 h-5" />
                {t.addProduct}
              </button>
            </div>

            {productListings.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">{t.noProducts}</h3>
                <p className="text-gray-600 mb-6">{t.addFirstProduct}</p>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="gradient-green text-black px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-all font-medium"
                >
                  <Plus className="w-5 h-5" />
                  {t.addProduct}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productListings.map((listing) => (
                  <ProductListingCard
                    key={listing.id}
                    listing={listing}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-black mb-6">{t.impactMetrics}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t.carbonReduction}</p>
                      <p className="text-2xl font-bold text-black">12.5 ton</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Droplet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t.waterSaved}</p>
                      <p className="text-2xl font-bold text-black">850 m³</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Bird className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t.biodiversity}</p>
                      <p className="text-2xl font-bold text-black">{farm.sustainability}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Certificaciones
                </h3>
                <button
                  onClick={() => {
                    const cert = prompt('Ingrese el nombre de la certificación:');
                    if (cert) handleAddCertification(cert);
                  }}
                  className="gradient-green text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Agregar Certificación
                </button>
              </div>

              {certifications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No hay certificaciones aún</p>
                  <p className="text-sm text-gray-500 mt-1">Agrega certificaciones para demostrar la calidad de tu finca</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-medium text-black">{cert}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert('Función de descarga próximamente')}
                          className="p-2 text-[#26ade4] hover:bg-[#26ade4]/10 rounded-lg transition-colors"
                          title="Descargar certificado"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCertification(cert)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar certificación"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sustainability Chart Placeholder */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Índice de Sostenibilidad</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de sostenibilidad próximamente</p>
              </div>
            </div>
          </div>
        )}

        {/* Sales History Tab */}
        {activeTab === 'salesHistory' && (
          <div className="space-y-6">
            {/* Income Type Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-green-500">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Venta de Productos</p>
                    <p className="text-xs text-gray-500">Ingresos por ventas directas</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-2">{formatCurrency(farm.productSalesEarnings || 0)}</p>
                <div className="flex items-center justify-between pt-3 border-t border-green-200">
                  <span className="text-xs text-gray-600">Transacciones</span>
                  <span className="text-sm font-semibold text-green-700">0</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-[#26ade4]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#26ade4]">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos por Tokenización</p>
                    <p className="text-xs text-gray-500">Rendimiento pasivo</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#26ade4] mb-2">{formatCurrency(farm.tokenEarnings || 0)}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#26ade4]/20">
                  <span className="text-xs text-gray-600">Inversores activos</span>
                  <span className="text-sm font-semibold text-[#26ade4]">0</span>
                </div>
              </div>
            </div>

            {/* Sales & Transactions List */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Historial de Transacciones</h3>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-black mb-2">{t.noSalesYet}</h4>
                <p className="text-gray-600 mb-4">{t.salesWillAppear}</p>
                <p className="text-sm text-gray-500">
                  Aquí aparecerán tanto las ventas de productos como los rendimientos de tokenización
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductListingForm
          farmId={farm.id}
          farmName={farm.name}
          onSave={handleSaveProduct}
          onCancel={() => setShowProductForm(false)}
          isSaving={isSaving}
        />
      )}

      {/* Edit Farm Modal */}
      {showEditForm && farm && (
        <FarmForm
          farm={farm}
          onSave={handleSaveFarm}
          onCancel={() => setShowEditForm(false)}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-black">Eliminar Finca</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar <span className="font-semibold">{farm.name}</span>? 
              Esta acción no se puede deshacer y se perderán todos los datos asociados.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteFarm}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
