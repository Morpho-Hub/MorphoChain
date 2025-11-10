'use client';

import React from 'react';
import { AlertTriangle, Calendar, CheckCircle2, Clock, FileText, X } from 'lucide-react';
import type { EnvironmentalMetrics } from '@/src/molecules/FarmCard';

interface VerificationAlertProps {
  farmName: string;
  metrics: EnvironmentalMetrics;
  onScheduleVerification: () => void;
  onDismiss: () => void;
}

const VerificationAlert: React.FC<VerificationAlertProps> = ({
  farmName,
  metrics,
  onScheduleVerification,
  onDismiss,
}) => {
  const nextVerificationDate = new Date(metrics.nextVerificationDate);
  const now = new Date();
  const daysUntilVerification = Math.ceil((nextVerificationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const isUrgent = daysUntilVerification <= 7;
  const isExpired = metrics.verificationStatus === 'expired';

  return (
    <div className={`rounded-xl border-2 p-6 ${
      isExpired 
        ? 'bg-red-50 border-red-300' 
        : isUrgent 
          ? 'bg-orange-50 border-orange-300' 
          : 'bg-blue-50 border-blue-300'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {isExpired ? (
            <div className="p-3 bg-red-500 rounded-full">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          ) : isUrgent ? (
            <div className="p-3 bg-orange-500 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="p-3 bg-blue-500 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className={`text-lg font-bold ${
              isExpired ? 'text-red-900' : isUrgent ? 'text-orange-900' : 'text-blue-900'
            }`}>
              {isExpired 
                ? 'Verificación Ambiental Vencida' 
                : isUrgent 
                  ? '⏰ Verificación Próxima' 
                  : 'Verificación Programada'}
            </h3>
            <p className={`text-sm ${
              isExpired ? 'text-red-700' : isUrgent ? 'text-orange-700' : 'text-blue-700'
            }`}>
              {farmName}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div className={`flex items-center gap-2 text-sm font-medium ${
          isExpired ? 'text-red-800' : isUrgent ? 'text-orange-800' : 'text-blue-800'
        }`}>
          {isExpired ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>Tu verificación está vencida. Los ingresos por token están suspendidos.</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>Próxima verificación en {daysUntilVerification} días</span>
            </>
          )}
        </div>

        {/* Current Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">CO₂ Reducido</p>
            <p className="text-lg font-bold text-black">{metrics.carbonReduction} ton</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Agua Ahorrada</p>
            <p className="text-lg font-bold text-black">{metrics.waterSaved} m³</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Biodiversidad</p>
            <p className="text-lg font-bold text-black">{metrics.biodiversityIndex}%</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Salud Suelo</p>
            <p className="text-lg font-bold text-black">{metrics.soilHealth}%</p>
          </div>
        </div>

        {/* Verification Process */}
        <div className={`p-4 rounded-lg ${isExpired ? 'bg-red-100' : 'bg-white'}`}>
          <p className="text-sm font-semibold text-black mb-2">
            Proceso de Verificación Mensual:
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Auditor independiente</strong> visitará la finca sin previo aviso</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Análisis satelital</strong> comparará imágenes del mes</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Revisión de facturas</strong> de insumos (fertilizantes, pesticidas)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Entrevistas a vecinos/comunidad</strong> sobre prácticas observadas</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Muestras de suelo y agua</strong> (aleatorio)</span>
            </div>
          </div>
        </div>

        {/* Documentation Required */}
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-gray-700" />
            <p className="font-semibold text-black">Documentos a tener listos:</p>
          </div>
          <ul className="text-sm text-gray-700 space-y-1 ml-7">
            <li>• Facturas de insumos del último mes</li>
            <li>• Registro de aplicaciones (fertilizantes/pesticidas)</li>
            <li>• Análisis de suelo (si aplica)</li>
            <li>• Registros de agua consumida</li>
            <li>• Bitácora de prácticas sostenibles</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onScheduleVerification}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isExpired
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'gradient-green text-black hover:opacity-90'
            }`}
          >
            <Calendar className="w-5 h-5" />
            {isExpired ? 'Agendar Verificación Urgente' : 'Ver Calendario de Verificación'}
          </button>
          <button
            onClick={() => alert('Documentación descargada')}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-black hover:bg-gray-50 transition-all"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        {isExpired && (
          <div className="p-3 bg-red-200 rounded-lg border border-red-400">
            <p className="text-sm text-red-900 font-medium">
              <strong>IMPORTANTE:</strong> Los ingresos por tokenización están suspendidos hasta completar la verificación.
              Multa de $50 por cada semana de retraso.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationAlert;
