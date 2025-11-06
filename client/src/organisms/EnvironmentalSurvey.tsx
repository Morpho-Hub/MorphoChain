'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Leaf, Droplet, Wind } from 'lucide-react';

interface SurveyAnswers {
  // PASO 1: Información General de la Finca
  totalArea: number; // hectáreas
  cultivatedArea: number; // hectáreas
  forestArea: number; // hectáreas
  yearsOperating: number;
  certifications: string[];
  
  // PASO 2: Gestión del Agua (con datos cuantitativos)
  irrigationSystem: 'traditional' | 'drip' | 'sprinkler' | 'none';
  waterSource: 'well' | 'river' | 'rainwater' | 'municipal' | 'mixed';
  monthlyWaterUsage: number; // m³/mes
  waterRecyclingSystem: boolean;
  waterRecyclingPercentage: number; // %
  rainwaterHarvestingCapacity: number; // m³
  drainageManagement: boolean;
  
  // PASO 3: Salud del Suelo y Fertilización
  soilAnalysisDate: string;
  organicMatterPercentage: number; // %
  composting: boolean;
  compostProductionKg: number; // kg/mes
  cropRotation: boolean;
  rotationCycleMonths: number;
  coverCrops: boolean;
  coverCropPercentage: number; // % del área
  tillageType: 'conventional' | 'minimum' | 'zero';
  
  // Fertilizantes - DATOS CUANTITATIVOS VERIFICABLES
  syntheticFertilizerKg: number; // kg/año
  syntheticFertilizerType: string;
  organicFertilizerKg: number; // kg/año
  organicFertilizerType: string;
  fertilizerInvoices: boolean; // ¿Tiene facturas para comprobar?
  
  // PASO 4: Control de Plagas y Químicos
  pesticideUsage: 'none' | 'organic' | 'synthetic' | 'mixed';
  syntheticPesticidesLiters: number; // litros/año
  syntheticPesticidesList: string; // nombres comerciales
  organicPesticidesLiters: number; // litros/año
  biologicalControl: boolean;
  biologicalControlTypes: string; // descripción de los métodos usados
  pestControlInvoices: boolean;
  
  // PASO 5: Biodiversidad y Ecosistemas
  nativeTreesCount: number;
  nativeSpeciesPercentage: number; // %
  wildlifeCorridorsArea: number; // hectáreas
  pollinatorHabitatArea: number; // hectáreas
  agroforestryArea: number; // hectáreas
  endangeredSpeciesPresent: boolean;
  wildlifeMonitoring: boolean;
  
  // PASO 6: Energía y Emisiones
  energySource: 'grid' | 'solar' | 'wind' | 'hybrid' | 'diesel';
  monthlyEnergyKwh: number;
  solarPanelsKw: number;
  dieselLitersMonth: number;
  electricMachinery: boolean;
  fuelEfficiencyMeasures: boolean;
  
  // PASO 7: Residuos y Economía Circular
  wasteSegregation: boolean;
  organicWasteComposted: boolean;
  plasticRecycled: boolean;
  wasteManagementPlan: boolean;
  byproductReuse: boolean;
  byproductReuseDescription: string;
  
  // PASO 8: Documentación y Referencias
  hasEnvironmentalPermit: boolean;
  environmentalPermitNumber: string;
  localAuthorityContact: string;
  supplierReferences: string; // proveedores de insumos
  neighborsReferences: string; // contactos de vecinos/comunidad
  photosEvidence: boolean;
}

interface EnvironmentalMetrics {
  carbonReduction: number;
  waterSaved: number;
  biodiversityIndex: number;
  soilHealth: number;
}

interface EnvironmentalSurveyProps {
  onComplete: (metrics: EnvironmentalMetrics) => void;
  onCancel: () => void;
}

const EnvironmentalSurvey: React.FC<EnvironmentalSurveyProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    // Paso 1
    totalArea: 0,
    cultivatedArea: 0,
    forestArea: 0,
    yearsOperating: 0,
    certifications: [],
    
    // Paso 2
    irrigationSystem: 'traditional',
    waterSource: 'well',
    monthlyWaterUsage: 0,
    waterRecyclingSystem: false,
    waterRecyclingPercentage: 0,
    rainwaterHarvestingCapacity: 0,
    drainageManagement: false,
    
    // Paso 3
    soilAnalysisDate: '',
    organicMatterPercentage: 0,
    composting: false,
    compostProductionKg: 0,
    cropRotation: false,
    rotationCycleMonths: 0,
    coverCrops: false,
    coverCropPercentage: 0,
    tillageType: 'conventional',
    syntheticFertilizerKg: 0,
    syntheticFertilizerType: '',
    organicFertilizerKg: 0,
    organicFertilizerType: '',
    fertilizerInvoices: false,
    
    // Paso 4
    pesticideUsage: 'mixed',
    syntheticPesticidesLiters: 0,
    syntheticPesticidesList: '',
    organicPesticidesLiters: 0,
    biologicalControl: false,
    biologicalControlTypes: '',
    pestControlInvoices: false,
    
    // Paso 5
    nativeTreesCount: 0,
    nativeSpeciesPercentage: 0,
    wildlifeCorridorsArea: 0,
    pollinatorHabitatArea: 0,
    agroforestryArea: 0,
    endangeredSpeciesPresent: false,
    wildlifeMonitoring: false,
    
    // Paso 6
    energySource: 'grid',
    monthlyEnergyKwh: 0,
    solarPanelsKw: 0,
    dieselLitersMonth: 0,
    electricMachinery: false,
    fuelEfficiencyMeasures: false,
    
    // Paso 7
    wasteSegregation: false,
    organicWasteComposted: false,
    plasticRecycled: false,
    wasteManagementPlan: false,
    byproductReuse: false,
    byproductReuseDescription: '',
    
    // Paso 8
    hasEnvironmentalPermit: false,
    environmentalPermitNumber: '',
    localAuthorityContact: '',
    supplierReferences: '',
    neighborsReferences: '',
    photosEvidence: false,
  });

  const calculateMetrics = (answers: SurveyAnswers): EnvironmentalMetrics => {
    // CÁLCULO DE AGUA (m³ ahorrados anualmente)
    let waterSaved = 0;
    
    // Eficiencia de riego
    if (answers.irrigationSystem === 'drip') {
      waterSaved += answers.monthlyWaterUsage * 12 * 0.4; // 40% ahorro vs tradicional
    } else if (answers.irrigationSystem === 'sprinkler') {
      waterSaved += answers.monthlyWaterUsage * 12 * 0.2; // 20% ahorro
    }
    
    // Reciclaje de agua
    if (answers.waterRecyclingSystem) {
      waterSaved += answers.monthlyWaterUsage * 12 * (answers.waterRecyclingPercentage / 100);
    }
    
    // Cosecha de lluvia (promedio 1200mm/año en Costa Rica)
    waterSaved += answers.rainwaterHarvestingCapacity * 0.8; // 80% aprovechamiento
    
    // CÁLCULO DE CARBONO (toneladas CO₂ reducidas/secuestradas anualmente)
    let carbonReduction = 0;
    
    // Fertilizantes sintéticos (emisión promedio: 5.5 kg CO₂/kg fertilizante)
    const syntheticEmissions = answers.syntheticFertilizerKg * 5.5;
    // Fertilizantes orgánicos (emisión promedio: 0.5 kg CO₂/kg)
    const organicEmissions = answers.organicFertilizerKg * 0.5;
    const fertilizerReduction = (syntheticEmissions - organicEmissions) / 1000; // a toneladas
    carbonReduction += Math.max(0, fertilizerReduction);
    
    // Pesticidas sintéticos (emisión promedio: 10 kg CO₂/litro)
    const pesticideEmissions = answers.syntheticPesticidesLiters * 10 / 1000; // a toneladas
    carbonReduction += pesticideEmissions * 0.8; // 80% reducción con prácticas orgánicas
    
    // Labranza cero/mínima (ahorro: 0.3 ton CO₂/ha/año)
    if (answers.tillageType === 'zero') {
      carbonReduction += answers.cultivatedArea * 0.3;
    } else if (answers.tillageType === 'minimum') {
      carbonReduction += answers.cultivatedArea * 0.15;
    }
    
    // Secuestro forestal (promedio: 5 ton CO₂/ha/año)
    carbonReduction += answers.forestArea * 5;
    carbonReduction += answers.agroforestryArea * 3;
    
    // Energía renovable
    if (answers.energySource === 'solar' || answers.energySource === 'hybrid') {
      // 0.5 kg CO₂/kWh (factor de emisión grid CR)
      carbonReduction += (answers.solarPanelsKw * 1400 * 0.5) / 1000; // 1400 kWh/kW/año
    }
    
    // Diesel (2.68 kg CO₂/litro)
    const dieselEmissions = (answers.dieselLitersMonth * 12 * 2.68) / 1000;
    carbonReduction += dieselEmissions * 0.5; // 50% reducción con eficiencia
    
    // CÁLCULO DE BIODIVERSIDAD (índice 0-100)
    let biodiversityIndex = 0;
    
    // Proporción de área natural (máx 30 puntos)
    const naturalAreaRatio = (answers.forestArea + answers.wildlifeCorridorsArea) / answers.totalArea;
    biodiversityIndex += Math.min(naturalAreaRatio * 100, 30);
    
    // Especies nativas (máx 20 puntos)
    biodiversityIndex += Math.min(answers.nativeSpeciesPercentage * 0.2, 20);
    
    // Árboles nativos (1 punto por cada 10 árboles, máx 15)
    biodiversityIndex += Math.min(answers.nativeTreesCount / 10, 15);
    
    // Agroforestería (máx 15 puntos)
    const agroforestryRatio = answers.agroforestryArea / answers.cultivatedArea;
    biodiversityIndex += Math.min(agroforestryRatio * 100, 15);
    
    // Hábitat polinizadores (máx 10 puntos)
    const pollinatorRatio = answers.pollinatorHabitatArea / answers.totalArea;
    biodiversityIndex += Math.min(pollinatorRatio * 100, 10);
    
    // Control biológico (5 puntos)
    if (answers.biologicalControl) biodiversityIndex += 5;
    
    // Monitoreo de fauna (5 puntos)
    if (answers.wildlifeMonitoring) biodiversityIndex += 5;
    
    // CÁLCULO DE SALUD DEL SUELO (índice 0-100)
    let soilHealth = 0;
    
    // Materia orgánica (máx 30 puntos - ideal >5%)
    soilHealth += Math.min((answers.organicMatterPercentage / 5) * 30, 30);
    
    // Compostaje (15 puntos)
    if (answers.composting && answers.compostProductionKg > 0) {
      soilHealth += 15;
    }
    
    // Rotación de cultivos (15 puntos)
    if (answers.cropRotation && answers.rotationCycleMonths > 0) {
      soilHealth += 15;
    }
    
    // Cultivos de cobertura (15 puntos)
    if (answers.coverCrops) {
      soilHealth += Math.min((answers.coverCropPercentage / 100) * 15, 15);
    }
    
    // Labranza mínima/cero (15 puntos)
    if (answers.tillageType === 'zero') {
      soilHealth += 15;
    } else if (answers.tillageType === 'minimum') {
      soilHealth += 10;
    }
    
    // Análisis de suelo reciente (10 puntos)
    if (answers.soilAnalysisDate) {
      const analysisDate = new Date(answers.soilAnalysisDate);
      const monthsSinceAnalysis = (Date.now() - analysisDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsSinceAnalysis < 12) soilHealth += 10;
      else if (monthsSinceAnalysis < 24) soilHealth += 5;
    }
    
    return {
      waterSaved: Math.round(waterSaved),
      carbonReduction: Math.round(carbonReduction * 10) / 10, // 1 decimal
      biodiversityIndex: Math.min(Math.round(biodiversityIndex), 100),
      soilHealth: Math.min(Math.round(soilHealth), 100),
    };
  };

  const handleComplete = () => {
    const metrics = calculateMetrics(answers);
    onComplete(metrics);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="gradient-earth text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Evaluación Ambiental de la Finca</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 text-sm">
            Esta evaluación determina tus métricas ambientales y el rendimiento de tu token ambiental.
            <br />
            <span className="font-semibold">📋 Se verificará mensualmente de forma independiente.</span>
          </p>
        </div>

        <div className="p-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Paso {step} de 4</span>
              <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full gradient-green transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Steps Container with Scroll */}
          <div className="max-h-[60vh] overflow-y-auto pr-2">
          {/* Step 1: Información General y Área */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Información General de la Finca</h3>
                  <p className="text-sm text-gray-600">Datos básicos verificables</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área total (hectáreas) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={answers.totalArea || ''}
                    onChange={(e) => setAnswers({...answers, totalArea: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 5.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Según escritura o catastro</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área cultivada (hectáreas) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={answers.cultivatedArea || ''}
                    onChange={(e) => setAnswers({...answers, cultivatedArea: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 4.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área forestal/conservación (hectáreas)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={answers.forestArea || ''}
                    onChange={(e) => setAnswers({...answers, forestArea: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Bosque natural o plantado</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Años operando
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={answers.yearsOperating || ''}
                    onChange={(e) => setAnswers({...answers, yearsOperating: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Gestión del Agua y Riego */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Droplet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Gestión del Agua y Riego</h3>
                  <p className="text-sm text-gray-600">Datos cuantitativos verificables</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema de riego principal *
                  </label>
                  <select
                    value={answers.irrigationSystem}
                    onChange={(e) => setAnswers({...answers, irrigationSystem: e.target.value as 'traditional' | 'drip' | 'sprinkler' | 'none'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                  >
                    <option value="none">Sin sistema de riego (solo lluvia)</option>
                    <option value="traditional">Riego tradicional (inundación/surco)</option>
                    <option value="sprinkler">Riego por aspersión</option>
                    <option value="drip">Riego por goteo (más eficiente)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Se verificará con visita in-situ</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente de agua *
                  </label>
                  <select
                    value={answers.waterSource}
                    onChange={(e) => setAnswers({...answers, waterSource: e.target.value as 'well' | 'river' | 'rainwater' | 'municipal' | 'mixed'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                  >
                    <option value="well">Pozo</option>
                    <option value="river">Río/quebrada</option>
                    <option value="rainwater">Agua de lluvia</option>
                    <option value="municipal">Acueducto</option>
                    <option value="mixed">Mixto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consumo mensual de agua (m³) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={answers.monthlyWaterUsage || ''}
                    onChange={(e) => setAnswers({...answers, monthlyWaterUsage: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 500"
                  />
                  <p className="text-xs text-gray-500 mt-1">📄 Debe coincidir con facturas/medidores</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad de cosecha de lluvia (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={answers.rainwaterHarvestingCapacity || ''}
                    onChange={(e) => setAnswers({...answers, rainwaterHarvestingCapacity: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tanques/reservorios instalados</p>
                </div>

                <div>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#26ade4] transition-colors">
                    <input
                      type="checkbox"
                      checked={answers.waterRecyclingSystem}
                      onChange={(e) => setAnswers({...answers, waterRecyclingSystem: e.target.checked})}
                      className="w-5 h-5 text-[#26ade4] rounded focus:ring-[#26ade4]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-black">Sistema de reciclaje</p>
                      <p className="text-xs text-gray-600">Reutilizo agua de procesos</p>
                    </div>
                  </label>
                </div>

                {answers.waterRecyclingSystem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      % de agua reciclada
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={answers.waterRecyclingPercentage || ''}
                      onChange={(e) => setAnswers({...answers, waterRecyclingPercentage: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: 30"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium mb-1">💡 Verificación de agua:</p>
                <p className="text-xs text-blue-700">
                  • Facturas de servicio (acueducto) o medidores de pozo
                  <br />• Inspección visual de sistema de riego instalado
                  <br />• Verificación de tanques de almacenamiento
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Salud del Suelo y Fertilización */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Leaf className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Salud del Suelo y Fertilización</h3>
                  <p className="text-sm text-gray-600">Datos cuantitativos verificables</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha último análisis de suelo
                  </label>
                  <input
                    type="date"
                    value={answers.soilAnalysisDate || ''}
                    onChange={(e) => setAnswers({...answers, soilAnalysisDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">📄 Debe adjuntar resultado de laboratorio</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    % Materia orgánica (según análisis)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={answers.organicMatterPercentage || ''}
                    onChange={(e) => setAnswers({...answers, organicMatterPercentage: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 3.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ideal: &gt;5% para suelos productivos</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de labranza *
                  </label>
                  <select
                    value={answers.tillageType}
                    onChange={(e) => setAnswers({...answers, tillageType: e.target.value as 'conventional' | 'minimum' | 'zero'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                  >
                    <option value="conventional">Convencional (arado profundo)</option>
                    <option value="minimum">Mínima (reducida)</option>
                    <option value="zero">Cero labranza (siembra directa)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#26ade4] transition-colors">
                    <input
                      type="checkbox"
                      checked={answers.composting}
                      onChange={(e) => setAnswers({...answers, composting: e.target.checked})}
                      className="w-5 h-5 text-[#26ade4] rounded focus:ring-[#26ade4]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-black">Producción de compost</p>
                      <p className="text-xs text-gray-600">Si produzco compost, especificar cantidad</p>
                    </div>
                  </label>
                </div>

                {answers.composting && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compost producido (kg/mes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={answers.compostProductionKg || ''}
                      onChange={(e) => setAnswers({...answers, compostProductionKg: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: 200"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fertilizantes sintéticos (kg/año)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={answers.syntheticFertilizerKg || ''}
                    onChange={(e) => setAnswers({...answers, syntheticFertilizerKg: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 500"
                  />
                  <p className="text-xs text-gray-500 mt-1">NPK, urea, etc. 📄 Facturas obligatorias</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fertilizantes orgánicos (kg/año)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={answers.organicFertilizerKg || ''}
                    onChange={(e) => setAnswers({...answers, organicFertilizerKg: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Compost, bocashi, humus, estiércol</p>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#26ade4] transition-colors">
                    <input
                      type="checkbox"
                      checked={answers.cropRotation}
                      onChange={(e) => setAnswers({...answers, cropRotation: e.target.checked})}
                      className="w-5 h-5 text-[#26ade4] rounded focus:ring-[#26ade4]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-black">Rotación de cultivos</p>
                      <p className="text-xs text-gray-600">Alterno diferentes cultivos en las parcelas</p>
                    </div>
                  </label>
                </div>

                {answers.cropRotation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciclo de rotación (meses)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={answers.rotationCycleMonths || ''}
                      onChange={(e) => setAnswers({...answers, rotationCycleMonths: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: 6"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#26ade4] transition-colors">
                    <input
                      type="checkbox"
                      checked={answers.coverCrops}
                      onChange={(e) => setAnswers({...answers, coverCrops: e.target.checked})}
                      className="w-5 h-5 text-[#26ade4] rounded focus:ring-[#26ade4]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-black">Cultivos de cobertura</p>
                      <p className="text-xs text-gray-600">Uso plantas de cobertura entre ciclos</p>
                    </div>
                  </label>
                </div>

                {answers.coverCrops && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      % de área con cobertura
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={answers.coverCropPercentage || ''}
                      onChange={(e) => setAnswers({...answers, coverCropPercentage: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: 40"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:border-green-400 transition-colors bg-green-50">
                    <input
                      type="checkbox"
                      checked={answers.fertilizerInvoices}
                      onChange={(e) => setAnswers({...answers, fertilizerInvoices: e.target.checked})}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">✓ Tengo facturas de insumos</p>
                      <p className="text-xs text-green-700">Facturas de fertilizantes comprobables para verificación</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-900 font-medium mb-1">💡 Verificación de suelo:</p>
                <p className="text-xs text-amber-700">
                  • Análisis de laboratorio certificado (obligatorio)
                  <br />• Facturas de compra de fertilizantes
                  <br />• Inspección visual de prácticas de cobertura y rotación
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Carbono y Energía */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Wind className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Carbono y Energía</h3>
                  <p className="text-sm text-gray-600">Reducción de emisiones</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sección Pesticidas */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-red-500 rounded"></div>
                    Control de Plagas
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uso de pesticidas *
                  </label>
                  <select
                    value={answers.pesticideUsage}
                    onChange={(e) => setAnswers({...answers, pesticideUsage: e.target.value as 'none' | 'organic' | 'synthetic' | 'mixed'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                  >
                    <option value="none">No uso pesticidas</option>
                    <option value="organic">Solo pesticidas orgánicos/biológicos</option>
                    <option value="synthetic">Uso pesticidas sintéticos</option>
                    <option value="mixed">Mixto (orgánicos + sintéticos)</option>
                  </select>
                </div>

                {(answers.pesticideUsage === 'synthetic' || answers.pesticideUsage === 'mixed') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pesticidas sintéticos (litros/año)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={answers.syntheticPesticidesLiters || ''}
                        onChange={(e) => setAnswers({...answers, syntheticPesticidesLiters: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                        placeholder="Ej: 15.5"
                      />
                      <p className="text-xs text-gray-500 mt-1">📄 Facturas obligatorias</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombres de productos usados
                      </label>
                      <input
                        type="text"
                        value={answers.syntheticPesticidesList || ''}
                        onChange={(e) => setAnswers({...answers, syntheticPesticidesList: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                        placeholder="Ej: Roundup, Paraquat"
                      />
                    </div>
                  </>
                )}

                {(answers.pesticideUsage === 'organic' || answers.pesticideUsage === 'mixed') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesticidas orgánicos (litros/año)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={answers.organicPesticidesLiters || ''}
                      onChange={(e) => setAnswers({...answers, organicPesticidesLiters: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: 10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Neem, caldo bordelés, etc.</p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#26ade4] transition-colors">
                    <input
                      type="checkbox"
                      checked={answers.biologicalControl}
                      onChange={(e) => setAnswers({...answers, biologicalControl: e.target.checked})}
                      className="w-5 h-5 text-[#26ade4] rounded focus:ring-[#26ade4]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-black">Uso control biológico</p>
                      <p className="text-xs text-gray-600">Enemigos naturales, trampas, feromonas</p>
                    </div>
                  </label>
                </div>

                {answers.biologicalControl && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipos de control biológico usado
                    </label>
                    <textarea
                      value={answers.biologicalControlTypes || ''}
                      onChange={(e) => setAnswers({...answers, biologicalControlTypes: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: Avispas parasitoides, bacillus thuringiensis, trampas de feromonas"
                      rows={2}
                    />
                  </div>
                )}

                {/* Sección Energía */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-yellow-500 rounded"></div>
                    Energía y Combustibles
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente principal de energía *
                  </label>
                  <select
                    value={answers.energySource}
                    onChange={(e) => setAnswers({...answers, energySource: e.target.value as 'grid' | 'solar' | 'wind' | 'hybrid' | 'diesel'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                  >
                    <option value="grid">Red eléctrica convencional</option>
                    <option value="solar">Solar fotovoltaica</option>
                    <option value="wind">Eólica</option>
                    <option value="hybrid">Híbrido (renovable + red)</option>
                    <option value="diesel">Generador diesel/gasolina</option>
                  </select>
                </div>

                {(answers.energySource === 'grid' || answers.energySource === 'hybrid') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumo eléctrico (kWh/mes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={answers.monthlyEnergyKwh || ''}
                      onChange={(e) => setAnswers({...answers, monthlyEnergyKwh: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: 350"
                    />
                    <p className="text-xs text-gray-500 mt-1">📄 Según factura de electricidad</p>
                  </div>
                )}

                {(answers.energySource === 'solar' || answers.energySource === 'hybrid') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paneles solares (kW instalados)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={answers.solarPanelsKw || ''}
                      onChange={(e) => setAnswers({...answers, solarPanelsKw: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                      placeholder="Ej: 5.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Capacidad instalada total</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diesel/gasolina (litros/mes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={answers.dieselLitersMonth || ''}
                    onChange={(e) => setAnswers({...answers, dieselLitersMonth: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 80"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tractores, bombas, generadores</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Árboles nativos en finca
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={answers.nativeTreesCount || ''}
                    onChange={(e) => setAnswers({...answers, nativeTreesCount: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: 150"
                  />
                  <p className="text-xs text-gray-500 mt-1">Estimado de árboles conservados</p>
                </div>

                {/* Sección Referencias */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-500 rounded"></div>
                    Referencias y Contactos Verificables
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedores de insumos (nombres y teléfonos) *
                  </label>
                  <textarea
                    value={answers.supplierReferences || ''}
                    onChange={(e) => setAnswers({...answers, supplierReferences: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: Agropecuaria Los Andes (555-1234), Distribuidora Verde (555-5678)"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">Para verificar compras de insumos</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vecinos/comunidad (nombres y teléfonos) *
                  </label>
                  <textarea
                    value={answers.neighborsReferences || ''}
                    onChange={(e) => setAnswers({...answers, neighborsReferences: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: Juan Pérez (vecino norte, 555-3456), María González (junta comunal, 555-7890)"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">Para entrevistas comunitarias</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autoridad ambiental local
                  </label>
                  <input
                    type="text"
                    value={answers.localAuthorityContact || ''}
                    onChange={(e) => setAnswers({...answers, localAuthorityContact: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26ade4] focus:border-transparent"
                    placeholder="Ej: CAR Cundinamarca - oficina Fusagasugá"
                  />
                  <p className="text-xs text-gray-500 mt-1">Corporación ambiental regional o similar</p>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:border-green-400 transition-colors bg-green-50">
                    <input
                      type="checkbox"
                      checked={answers.pestControlInvoices}
                      onChange={(e) => setAnswers({...answers, pestControlInvoices: e.target.checked})}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">✓ Tengo facturas de pesticidas/insumos</p>
                      <p className="text-xs text-green-700">Facturas comprobables para auditoría</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-900 font-medium mb-1">💡 Verificación completa:</p>
                <p className="text-xs text-purple-700">
                  • Facturas de pesticidas y combustibles
                  <br />• Factura eléctrica o certificado de instalación solar
                  <br />• Entrevistas con proveedores y comunidad
                  <br />• Inspección visual de árboles y prácticas
                </p>
              </div>

              {/* Preview de métricas */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Sistema de Verificación</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Estas métricas serán verificadas mensualmente por:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
                      <li>• Auditorías aleatorias in-situ</li>
                      <li>• Imágenes satelitales y drones</li>
                      <li>• Sensores IoT (si aplicable)</li>
                      <li>• Certificadoras independientes</li>
                    </ul>
                    <p className="text-sm text-blue-700 mt-2 font-medium">
                      ⚠️ Valores falsos resultarán en penalizaciones y pérdida de rendimiento del token.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
          {/* End Steps Container */}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anterior
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 gradient-green text-black px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 gradient-green text-black px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Completar Evaluación
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalSurvey;
