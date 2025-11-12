'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Upload, Check, Leaf } from 'lucide-react';
import { Input } from '@/src/atoms';
import { es } from '@/locales';
import type { Farm } from '@/src/molecules/FarmCard';
import EnvironmentalSurvey from './EnvironmentalSurvey';
import { productService } from '@/src/services';

interface Product {
  cropType: string;
  unit: string;
  price: number;
  stock: number; // Cantidad disponible en inventario
}

interface EnvironmentalMetrics {
  carbonReduction: number;
  waterSaved: number;
  biodiversityIndex: number;
  soilHealth: number;
}

interface FarmFormProps {
  farm?: Farm;
  onSave: (farm: Omit<Farm, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
  requireEnvironmentalSurvey?: boolean; // Solo para nuevas fincas
  startWithSurvey?: boolean; // Ir directo a la encuesta (para farms pendientes)
}

interface FormErrors {
  name?: string;
  location?: string;
  description?: string;
  goals?: string;
  products?: string;
  practices?: string;
}

const FarmForm: React.FC<FarmFormProps> = ({
  farm,
  onSave,
  onCancel,
  isSaving = false,
  requireEnvironmentalSurvey = false,
  startWithSurvey = false,
}) => {
  const t = es.farmForm;
  const [currentStep, setCurrentStep] = useState(1);
  const [showEnvironmentalSurvey, setShowEnvironmentalSurvey] = useState(startWithSurvey);
  const [showSurveyExplanation, setShowSurveyExplanation] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Paso 1: Información básica
  const [formData, setFormData] = useState({
    name: farm?.name || '',
    location: farm?.location || '',
    description: farm?.description || '',
    goals: '',
  });

  // Paso 2: Productos y prácticas
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    cropType: '',
    unit: '',
    price: 0,
    stock: 0,
  });
  
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});

  // Load existing products when editing a farm
  useEffect(() => {
    if (farm?.id) {
      loadFarmProducts();
    }
    // Load existing practices
    if (farm?.certifications && farm.certifications.length > 0) {
      setSelectedPractices(farm.certifications);
    }
  }, [farm?.id]);

  const loadFarmProducts = async () => {
    if (!farm?.id) return;
    
    try {
      setLoadingProducts(true);
      const response = await productService.getProductsByFarm(farm.id);
      if (response.success && response.data && response.data.length > 0) {
        const existingProducts: Product[] = response.data.map((product: any) => ({
          cropType: product.name,
          unit: product.unit,
          price: product.price,
          stock: product.stock
        }));
        setProducts(existingProducts);
        console.log('📦 Loaded existing products:', existingProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const practices = [
    { key: 'cropRotation', label: t.practices.cropRotation },
    { key: 'organicCompost', label: t.practices.organicCompost },
    { key: 'regenerativeAgriculture', label: t.practices.regenerativeAgriculture },
    { key: 'dripirrigation', label: t.practices.dripirrigation },
    { key: 'biologicalPestControl', label: t.practices.biologicalPestControl },
    { key: 'agroforestry', label: t.practices.agroforestry },
    { key: 'permaculture', label: t.practices.permaculture },
    { key: 'coverCrop', label: t.practices.coverCrop },
    { key: 'soilConservation', label: t.practices.soilConservation },
    { key: 'renewableEnergy', label: t.practices.renewableEnergy },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleProductChange = (field: keyof Product, value: string | number) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = () => {
    if (newProduct.cropType && newProduct.unit && newProduct.price > 0 && newProduct.stock > 0) {
      setProducts([...products, newProduct]);
      setNewProduct({ cropType: '', unit: '', price: 0, stock: 0 });
      if (errors.products) {
        setErrors(prev => ({ ...prev, products: undefined }));
      }
    }
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handlePracticeToggle = (practiceKey: string) => {
    setSelectedPractices(prev =>
      prev.includes(practiceKey)
        ? prev.filter(p => p !== practiceKey)
        : [...prev, practiceKey]
    );
    if (errors.practices) {
      setErrors(prev => ({ ...prev, practices: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = t.errors.nameRequired;
    if (!formData.location.trim()) newErrors.location = t.errors.locationRequired;
    if (!formData.description.trim()) newErrors.description = t.errors.descriptionRequired;
    if (!formData.goals.trim()) newErrors.goals = t.errors.goalsRequired;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (products.length === 0) newErrors.products = t.errors.atLeastOneProduct;
    if (selectedPractices.length === 0) newErrors.practices = t.errors.atLeastOnePractice;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      // Si es edición y no tiene métricas ambientales, mostrar encuesta
      if (farm && !farm.environmentalMetrics && requireEnvironmentalSurvey) {
        setShowSurveyExplanation(true); // Mostrar explicación primero
      } else if (!requireEnvironmentalSurvey || farm) {
        // Si no se requiere encuesta o ya tiene métricas, guardar directamente
        saveFarm(null);
      } else {
        // Nueva finca que requiere encuesta - mostrar explicación
        setShowSurveyExplanation(true);
      }
    }
  };

  const handleEnvironmentalSurveyComplete = (metrics: EnvironmentalMetrics) => {
    setShowEnvironmentalSurvey(false);
    saveFarm(metrics);
  };

  const handleSkipSurvey = () => {
    // Opción para omitir la encuesta y guardar sin datos ambientales
    saveFarm(null);
  };

  const saveFarm = (metrics: EnvironmentalMetrics | null) => {
    // Parse location to extract country, region, city
    const locationParts = formData.location.split(',').map(s => s.trim());
    
    const farmData: any = {
      name: formData.name,
      description: formData.description || formData.goals || 'Finca sostenible',
      shortDescription: formData.description?.substring(0, 200),
      location: {
        country: locationParts[locationParts.length - 1] || 'Colombia',
        region: locationParts[locationParts.length - 2] || '',
        city: locationParts[0] || '',
        address: formData.location
      },
      landSize: 10, // Default hectares - could be added to form
      cropType: products.length > 0 ? products[0].cropType : 'Cultivo General',
      investmentGoal: products.length > 0 
        ? Math.max(products[0].price * products[0].stock, 100) // Mínimo $100
        : 10000,
      minInvestment: 100,
      expectedROI: 15, // Default 15%
      investmentDuration: 12, // 12 months
      status: 'draft',
    };

    // Add product info for later use
    if (products.length > 0) {
      farmData.product = {
        name: products[0].cropType,
        stock: products[0].stock,
        price: products[0].price,
        unit: products[0].unit
      };
    }

    // Add sustainability data if metrics exist
    if (metrics) {
      farmData.impactMetrics = {
        co2Reduction: metrics.carbonReduction,
        waterUsageReduction: metrics.waterSaved,
        biodiversityScore: metrics.biodiversityIndex,
        organicPractices: selectedPractices.length > 0,
        treesPlanted: 0
      };
      
      farmData.sustainabilityData = {
        sustainabilityScore: Math.min(selectedPractices.length * 10, 100),
        carbonScore: metrics.carbonReduction,
        soilHealth: metrics.soilHealth,
        waterUsage: metrics.waterSaved,
        biodiversity: metrics.biodiversityIndex,
      };
    }

    // Add certifications based on practices
    if (selectedPractices.length > 0) {
      farmData.certifications = selectedPractices.slice(0, 3).map(practice => ({
        name: practice,
        issuer: 'MorphoChain',
        date: new Date()
      }));
    }

    onSave(farmData);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return t.step1;
      case 2: return t.step2;
      case 3: return t.step3;
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">
              {farm ? t.editFarm : t.addFarm}
            </h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`flex-1 h-1 rounded-full ${currentStep >= 1 ? 'gradient-green' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 rounded-full ${currentStep >= 2 ? 'gradient-green' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 rounded-full ${currentStep >= 3 ? 'gradient-green' : 'bg-gray-200'}`} />
          </div>
          <p className="text-sm text-gray-600">{getStepTitle()}</p>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* PASO 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t.projectName} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t.placeholders.projectName}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t.location} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder={t.placeholders.location}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t.projectDescription} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t.placeholders.projectDescription}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26ade4] ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t.goalsAndTargets} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder={t.placeholders.goalsAndTargets}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26ade4] ${
                    errors.goals ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.goals && <p className="mt-1 text-sm text-red-500">{errors.goals}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t.farmImages}
                </label>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#26ade4] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">{t.dragOrClick}</p>
                  <p className="text-xs text-gray-500">{t.imageFormats}</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {images.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">{images.length} imagen(es) seleccionada(s)</p>
                )}
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Productos */}
              <div style={{ backgroundColor: 'rgba(209, 231, 81, 0.15)' }} className="rounded-lg p-6">
                <h3 className="font-semibold text-black mb-4">{t.agriculturalProducts}</h3>
                
                {/* Lista de productos agregados */}
                {products.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-black">{product.cropType}</p>
                          <p className="text-sm text-gray-600">
                            {product.stock} {product.unit} - ${product.price} por unidad
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar producto */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t.cropType} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={newProduct.cropType}
                      onChange={(e) => handleProductChange('cropType', e.target.value)}
                      placeholder={t.placeholders.cropType}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t.measurementUnit} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={newProduct.unit}
                        onChange={(e) => handleProductChange('unit', e.target.value)}
                        placeholder={t.placeholders.measurementUnit}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Stock Disponible <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => handleProductChange('stock', Number(e.target.value))}
                        placeholder="100"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t.priceUSD} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => handleProductChange('price', Number(e.target.value))}
                      placeholder="25.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="w-full gradient-green text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addProduct}
                  </button>
                </div>
                {errors.products && <p className="mt-2 text-sm text-red-500">{errors.products}</p>}
              </div>

              {/* Prácticas Sostenibles */}
              <div>
                <h3 className="font-semibold text-black mb-3">{t.sustainablePractices}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {practices.map((practice) => (
                    <label
                      key={practice.key}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPractices.includes(practice.key)}
                        onChange={() => handlePracticeToggle(practice.key)}
                        className="w-4 h-4 rounded focus:ring-[#26ade4]"
                        style={{ accentColor: 'var(--morpho-blue)' }}
                      />
                      <span className="text-sm text-black">{practice.label}</span>
                    </label>
                  ))}
                </div>
                {errors.practices && <p className="mt-2 text-sm text-red-500">{errors.practices}</p>}
              </div>

              {/* Certificaciones */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t.certifications}
                </label>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#26ade4] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (máx. 10MB)</p>
                  <input type="file" multiple className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-black mb-3">{t.legalDocumentation}</h3>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#26ade4] transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">{t.dragOrClick}</p>
                  <p className="text-xs text-gray-500">Títulos de propiedad, permisos, documentos legales</p>
                  <input type="file" multiple className="hidden" />
                </label>
              </div>

              {/* Vista Previa */}
              <div style={{ backgroundColor: 'rgba(209, 231, 81, 0.15)' }} className="rounded-lg p-6">
                <h3 className="font-semibold text-black mb-4">{t.farmPreview}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.project}</span>
                    <span className="font-medium text-black">{formData.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.location}:</span>
                    <span className="font-medium text-black">{formData.location || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.products}</span>
                    <span className="font-medium text-black">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.sustainablePracticesCount}</span>
                    <span className="font-medium text-black">{selectedPractices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.images}</span>
                    <span className="font-medium text-black">{images.length}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">{t.tokenizationNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-black hover:bg-gray-50 transition-all"
            >
              {t.previous}
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 gradient-earth text-white rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-all"
            >
              {t.next}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex-1 gradient-green text-black rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {isSaving ? t.saving : t.publishFarm}
            </button>
          )}
          
          <button
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-black hover:bg-gray-50 transition-all"
          >
            {t.cancel}
          </button>
        </div>
      </div>

      {/* Survey Explanation Modal */}
      {showSurveyExplanation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-2">
                  Encuesta Ambiental
                </h2>
                <p className="text-gray-600">
                  Potencia tu finca con certificación ambiental
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🪙</span>
                    Tokenización de tu Finca
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Convierte tu finca en un activo digital en blockchain y genera ingresos pasivos a través de inversores.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Acceso a Inversión
                  </h3>
                  <p className="text-green-800 text-sm">
                    Atrae inversores interesados en agricultura sostenible y recibe financiamiento para tu proyecto.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Certificación Verificable
                  </h3>
                  <p className="text-yellow-800 text-sm">
                    Obtén una certificación ambiental transparente y verificable que aumenta la confianza de tus compradores.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    Impacto Medible
                  </h3>
                  <p className="text-purple-800 text-sm">
                    Mide y comparte tu impacto ambiental: reducción de CO₂, ahorro de agua, y biodiversidad.
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Nota:</strong> La encuesta toma aproximadamente 5-10 minutos. Puedes llenarla ahora o completarla más tarde desde tu panel de agricultor.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowSurveyExplanation(false);
                    setShowEnvironmentalSurvey(true);
                  }}
                  className="flex-1 gradient-green text-black rounded-lg px-6 py-4 font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Llenar ahora
                </button>
                
                <button
                  onClick={() => {
                    setShowSurveyExplanation(false);
                    saveFarm(null);
                  }}
                  className="flex-1 border-2 border-gray-300 rounded-lg px-6 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Llenar después
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environmental Survey Modal */}
      {showEnvironmentalSurvey && (
        <EnvironmentalSurvey
          onComplete={handleEnvironmentalSurveyComplete}
          onCancel={() => setShowEnvironmentalSurvey(false)}
        />
      )}
    </div>
  );
};

export default FarmForm;
