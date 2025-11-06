'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Leaf, 
  Droplet, 
  Wind, 
  Award,
  Building2,
  ShieldCheck,
  ShoppingCart,
  Plus,
  Minus
} from 'lucide-react';

export default function InvertirPage() {
  const [tokenAmount, setTokenAmount] = useState<number>(1000);
  const TOKEN_PRICE = 5; // $5 USD por token

  // Unidades estandarizadas por token
  const tokenImpact = {
    hectareasRegeneradas: 0.1, // 1 token = 0.1 hectáreas
    co2Capturado: 50, // kg CO2
    aguaAhorrada: 1000, // litros
    biodiversidadIndex: 5 // puntos
  };

  const calculateImpact = (tokens: number) => {
    return {
      hectareas: (tokens * tokenImpact.hectareasRegeneradas).toFixed(1),
      co2: (tokens * tokenImpact.co2Capturado / 1000).toFixed(1), // toneladas
      agua: (tokens * tokenImpact.aguaAhorrada / 1000).toFixed(0), // m³
      biodiversidad: (tokens * tokenImpact.biodiversidadIndex).toFixed(0)
    };
  };

  const totalPrice = tokenAmount * TOKEN_PRICE;
  const impact = calculateImpact(tokenAmount);

  const quickAmounts = [500, 1000, 5000, 10000, 25000];

  const handleQuickSelect = (amount: number) => {
    setTokenAmount(amount);
  };

  const adjustAmount = (delta: number) => {
    const newAmount = Math.max(1, tokenAmount + delta);
    setTokenAmount(newAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              Inversión Regenerativa
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Compra Tokens
              <span className="block gradient-text mt-2">Regenerativos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada token representa impacto ambiental verificable. Compra la cantidad que necesites para tus objetivos de sostenibilidad.
            </p>
          </div>

          {/* Token Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Leaf className="w-8 h-8 text-green-600 mb-3" />
              <p className="text-3xl font-bold text-gray-900">0.1 ha</p>
              <p className="text-sm text-gray-600">regenerada por token</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Wind className="w-8 h-8 text-blue-600 mb-3" />
              <p className="text-3xl font-bold text-gray-900">50 kg</p>
              <p className="text-sm text-gray-600">CO₂ capturado por token</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Droplet className="w-8 h-8 text-cyan-600 mb-3" />
              <p className="text-3xl font-bold text-gray-900">1,000 L</p>
              <p className="text-sm text-gray-600">agua ahorrada por token</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Award className="w-8 h-8 text-purple-600 mb-3" />
              <p className="text-3xl font-bold text-gray-900">${TOKEN_PRICE}</p>
              <p className="text-sm text-gray-600">USD por token</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buy Tokens Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl border-2 border-green-200 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  ¿Cuántos tokens necesitas?
                </h2>
                <p className="text-lg text-gray-600">
                  Selecciona o ingresa la cantidad de tokens regenerativos
                </p>
              </div>

              {/* Quick Select Amounts */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickSelect(amount)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      tokenAmount === amount
                        ? 'gradient-green text-white shadow-lg scale-105'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {amount.toLocaleString()} tokens
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="max-w-2xl mx-auto mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  O ingresa una cantidad personalizada
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => adjustAmount(-100)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    <Minus className="w-6 h-6 text-gray-700" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-6 py-4 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => adjustAmount(100)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    <Plus className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Mínimo: 1 token • Sin límite máximo
                </p>
              </div>

              {/* Impact Preview */}
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Tu Impacto Ambiental
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">{impact.hectareas} ha</p>
                    <p className="text-xs text-gray-600">Tierra regenerada</p>
                  </div>
                  <div className="text-center">
                    <Wind className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{impact.co2} ton</p>
                    <p className="text-xs text-gray-600">CO₂ capturado</p>
                  </div>
                  <div className="text-center">
                    <Droplet className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-cyan-700">{impact.agua} m³</p>
                    <p className="text-xs text-gray-600">Agua ahorrada</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">+{impact.biodiversidad}</p>
                    <p className="text-xs text-gray-600">Índice biodiversidad</p>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-gray-700">Cantidad de tokens:</span>
                  <span className="text-2xl font-bold text-gray-900">{tokenAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-gray-700">Precio por token:</span>
                  <span className="text-2xl font-bold text-gray-900">${TOKEN_PRICE} USD</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-4xl font-bold gradient-text">${totalPrice.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <button className="w-full gradient-green text-white py-5 rounded-xl font-bold text-xl hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                Comprar {tokenAmount.toLocaleString()} Tokens
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                🔒 Pago seguro • Certificado instantáneo • 100% verificable
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué Invertir en Tokens Regenerativos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Verificable</h3>
              <p className="text-gray-600">
                Cada token está respaldado por auditorías independientes mensuales con datos verificables en blockchain.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certificación ESG</h3>
              <p className="text-gray-600">
                Obtén certificados oficiales para tus reportes de sostenibilidad corporativa y compliance ESG.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impacto Medible</h3>
              <p className="text-gray-600">
                Dashboard en tiempo real con métricas cuantificables de tu impacto ambiental directo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
