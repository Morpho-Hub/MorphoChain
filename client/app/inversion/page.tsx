"use client";

import { useState, useEffect } from "react";
import { Filter, DollarSign, Sprout, Wind, Leaf } from "lucide-react";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import Button from "@/src/atoms/button";
import Card from "@/src/atoms/Card";
import Input from "@/src/atoms/Input";
import Select from "@/src/atoms/Select";
import Badge from "@/src/atoms/Badge";
import Progress from "@/src/atoms/Progress";
import ImageWithFallback from "@/src/atoms/ImageWithFallback";
import { SearchBar, Modal } from "@/src/molecules";
import { SustainabilityCertificate } from "@/src/organisms";
import { es } from "@/locales";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { farmService, investmentService, transactionService } from "@/src/services";
import { useAuth } from "@/contexts/AuthContext";

interface FarmForInvestment {
  _id: string;
  id: string;
  name: string;
  farmer: string;
  location: string;
  category: string;
  image: string;
  tokenPrice: string;
  tokenPriceNumber: number;
  roi: string;
  available: number;
  totalTokens: number;
  status: string;
  soilHealth: number;
  carbonScore: number;
  vegetationIndex: number;
}

interface CertificateData {
  companyName: string;
  tokensPurchased: number;
  totalAmount: string;
  carbonOffset: string;
  waterSaved: string;
  treesPlanted: number;
  purchaseDate: string;
  certificateId: string;
}

interface FarmOwner {
  _id: string;
  name: string;
  email: string;
}

export default function InversionPage() {
  const { user } = useAuth();
  console.log('User:', user); // To avoid unused variable warning
  const [activeTab, setActiveTab] = useState<"direct" | "corporate">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("roi");
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmForInvestment | null>(null);
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [bulkAmount, setBulkAmount] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [tokenFarms, setTokenFarms] = useState<FarmForInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  const t = es.investment;

  // Load farms from backend
  useEffect(() => {
    loadFarmsForInvestment();
  }, []);

  const loadFarmsForInvestment = async () => {
    try {
      setLoading(true);
      const response = await farmService.getAll({ status: 'active' });
      
      if (response.success && response.data) {
        // Convert farms to investment format
        const farmsData: FarmForInvestment[] = response.data.map((farm) => {
          const tokenPrice = 10; // Default token price $10
          const totalTokens = Math.floor(farm.size * 100); // 100 tokens per hectare
          const soldTokens = Math.floor(totalTokens * Math.random() * 0.3); // Mock sold tokens (0-30%)
          const availableTokens = totalTokens - soldTokens;
          
          // Get owner name
          const farmerName = typeof farm.owner === 'object' && farm.owner !== null
            ? (farm.owner as FarmOwner).name || 'Agricultor'
            : 'Agricultor';

          // Format location string
          const locationStr = typeof farm.location === 'string' 
            ? farm.location 
            : (() => {
                const loc = farm.location as { city?: string; region?: string; country?: string; address?: string };
                return `${loc.city || ''}, ${loc.region || ''}, ${loc.country || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',');
              })();

          return {
            _id: farm._id,
            id: farm._id,
            name: farm.name,
            farmer: farmerName,
            location: locationStr,
            category: farm.category,
            image: farm.images?.[0] || '/images/farm-default.jpg',
            tokenPrice: `$${tokenPrice}`,
            tokenPriceNumber: tokenPrice,
            roi: "15-20% anual",
            available: availableTokens,
            totalTokens: totalTokens,
            status: availableTokens > totalTokens * 0.5 ? "Disponible" : "Popular",
            soilHealth: farm.impactMetrics?.soilHealth || 85,
            carbonScore: farm.impactMetrics?.carbonScore || 80,
            vegetationIndex: farm.impactMetrics?.vegetationIndex || 88,
          };
        });

        setTokenFarms(farmsData);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenInvest = (farm: FarmForInvestment) => {
    setSelectedFarm(farm);
    setShowInvestModal(true);
  };

  const handleConfirmTokenInvestment = async () => {
    if (!selectedFarm || !tokenQuantity) return;

    try {
      const tokens = parseFloat(tokenQuantity);
      const amount = tokens * selectedFarm.tokenPriceNumber;

      // Create investment
      const investmentResponse = await investmentService.createInvestment({
        farm: selectedFarm._id,
        amount,
        tokensAmount: tokens,
      });

      if (!investmentResponse.success) {
        throw new Error('Error al crear la inversión');
      }

      // Create transaction record
      await transactionService.createTransaction({
        type: 'investment',
        amount,
        to: selectedFarm._id,
        relatedFarm: selectedFarm._id,
        paymentMethod: 'wallet',
        metadata: {
          quantity: tokens,
          unitPrice: selectedFarm.tokenPriceNumber,
          farmName: selectedFarm.name,
          description: `Compra de ${tokens} tokens de ${selectedFarm.name}`,
        },
      });

      alert(`¡Inversión exitosa! Has comprado ${tokens} tokens de ${selectedFarm.name}`);
      
      // Reload farms to update availability
      loadFarmsForInvestment();
      
      setShowInvestModal(false);
      setTokenQuantity("");
      setSelectedFarm(null);
    } catch (error) {
      console.error('Error creating investment:', error);
      alert('Error al procesar la inversión. Por favor intenta de nuevo.');
    }
  };

  const handleBulkPurchase = () => {
    const tokens = parseFloat(bulkAmount);
    const totalAmount = tokens * 5; // $5 por token
    const carbonOffset = (tokens * 0.05).toFixed(1); // 50kg = 0.05 ton por token
    const waterSaved = (tokens * 1000).toLocaleString(); // 1000L por token

    const certData = {
      companyName: "Mi Empresa S.A.",
      tokensPurchased: tokens,
      totalAmount: `$${totalAmount.toLocaleString()} USD`,
      carbonOffset: `${carbonOffset} ton CO₂`,
      waterSaved: `${waterSaved} L`,
      treesPlanted: Math.floor(tokens / 10), // ~1 árbol cada 10 tokens
      purchaseDate: new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      certificateId: `MRC-${Date.now().toString().slice(-8)}`,
    };

    setCertificateData(certData);
    setShowCertificate(true);
    setBulkAmount("");
  };

  const downloadCertificate = async () => {
    const certificateElement = document.getElementById("sustainability-certificate");
    if (!certificateElement) return;

    try {
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Certificado-Sostenibilidad-${certificateData?.certificateId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const filteredAndSortedFarms = tokenFarms
    .filter((farm) => {
      const matchesSearch =
        searchQuery === "" ||
        farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || farm.category.toLowerCase() === filterCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "roi") {
        return parseFloat(b.roi) - parseFloat(a.roi);
      } else if (sortBy === "availability") {
        return b.available - a.available;
      } else if (sortBy === "sustainability") {
        const aSustainability = (a.soilHealth + a.carbonScore + a.vegetationIndex) / 3;
        const bSustainability = (b.soilHealth + b.carbonScore + b.vegetationIndex) / 3;
        return bSustainability - aSustainability;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Heading level={1} className="text-4xl">
            {t.title}
          </Heading>
          <Text className="text-lg max-w-2xl mx-auto">{t.subtitle}</Text>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            title="Invertir en Fincas"
            variant={activeTab === "direct" ? "blue" : "white_bordered"}
            onClick={() => setActiveTab("direct")}
            className="px-8 py-3 rounded-xl"
          />
          <Button
            title="Comprar Tokens Regenerativos"
            variant={activeTab === "corporate" ? "blue" : "white_bordered"}
            onClick={() => setActiveTab("corporate")}
            className="px-8 py-3 rounded-xl"
          />
        </div>

        {activeTab === "direct" && (
          <div className="space-y-6">
            <Card className="p-6 rounded-2xl border-2 border-[#d1e751]/30 shadow-morpho">
              <div className="flex flex-col lg:flex-row gap-4">
                <SearchBar
                  placeholder="Buscar fincas..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                <div className="flex gap-3">
                  <Select
                    options={[
                      { value: "all", label: "Todas las Categorías" },
                      { value: "café", label: "Café" },
                      { value: "cacao", label: "Cacao" },
                      { value: "banano", label: "Banano" },
                      { value: "piña", label: "Piña" },
                    ]}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  />

                  <Select
                    options={[
                      { value: "roi", label: "Ordenar por ROI" },
                      { value: "availability", label: "Por Disponibilidad" },
                      { value: "sustainability", label: "Por Sostenibilidad" },
                    ]}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {loading ? (
              <div className="text-center py-12">
                <Text className="text-lg text-[#000000]/60">Cargando fincas disponibles...</Text>
              </div>
            ) : filteredAndSortedFarms.length === 0 ? (
              <Card className="p-12 text-center rounded-2xl border-2 border-[#d1e751]/30">
                <Text className="text-lg text-[#000000]/60">
                  No se encontraron fincas disponibles para inversión.
                </Text>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedFarms.map((farm) => (
                <Card
                  key={farm.id}
                  className="cursor-pointer hover:shadow-morpho transition-shadow rounded-2xl overflow-hidden border-2 border-[#d1e751]/30"
                >
                  <div className="relative h-52">
                    <ImageWithFallback
                      src={farm.image}
                      alt={farm.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={farm.status === "Popular" ? "primary" : "success"}>
                        {farm.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-baseline gap-2">
                        <Heading level={2} className="text-white">
                          {farm.tokenPrice}
                        </Heading>
                        <Text variant="caption" className="text-white/80">
                          por token
                        </Text>
                      </div>
                      <Text variant="caption" className="text-[#d1e751] font-semibold">
                        ROI: {farm.roi}
                      </Text>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <Heading level={3} className="line-clamp-1">
                      {farm.name}
                    </Heading>
                    <Text variant="caption" className="text-[#000000]/60">
                      Por {farm.farmer} • {farm.location}
                    </Text>

                    <div>
                      <div className="flex justify-between mb-1">
                        <Text variant="caption">Disponibilidad</Text>
                        <Text variant="caption" className="font-semibold">
                          {farm.available}/{farm.totalTokens} tokens
                        </Text>
                      </div>
                      <Progress value={(farm.available / farm.totalTokens) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-[#d1e751]/10">
                        <Sprout className="w-4 h-4 mx-auto mb-1 text-[#66b32e]" />
                        <Text variant="small" className="text-xs">
                          Suelo
                        </Text>
                        <Text variant="caption" className="font-bold text-[#66b32e]">
                          {farm.soilHealth}%
                        </Text>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-[#4dbce9]/10">
                        <Wind className="w-4 h-4 mx-auto mb-1 text-[#26ade4]" />
                        <Text variant="small" className="text-xs">
                          Carbono
                        </Text>
                        <Text variant="caption" className="font-bold text-[#26ade4]">
                          {farm.carbonScore}%
                        </Text>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-[#d1e751]/10">
                        <Leaf className="w-4 h-4 mx-auto mb-1 text-[#66b32e]" />
                        <Text variant="small" className="text-xs">
                          Vegetación
                        </Text>
                        <Text variant="caption" className="font-bold text-[#66b32e]">
                          {farm.vegetationIndex}%
                        </Text>
                      </div>
                    </div>

                    <Button
                      title="Comprar Tokens"
                      onClick={() => handleTokenInvest(farm)}
                      variant="blue"
                      className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-3"
                    />
                  </div>
                </Card>
              ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "corporate" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <Card className="p-8 rounded-2xl border-2 border-[#26ade4]/30 shadow-morpho bg-gradient-to-br from-white to-blue-50">
              <div className="text-center mb-6">
                <Heading level={2} className="mb-3">
                  Compra Tokens Regenerativos
                </Heading>
                <Text className="text-[#000000]/60 text-lg">
                  Cada token representa impacto ambiental verificable. Ideal para empresas que buscan compensar su huella de carbono.
                </Text>
              </div>

              {/* Token Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-[#66b32e]/30 text-center">
                  <Leaf className="w-6 h-6 text-[#66b32e] mx-auto mb-2" />
                  <Text variant="body" className="font-bold text-[#66b32e]">0.1 ha</Text>
                  <Text variant="caption" className="text-[#000000]/60">regenerada</Text>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#26ade4]/30 text-center">
                  <Wind className="w-6 h-6 text-[#26ade4] mx-auto mb-2" />
                  <Text variant="body" className="font-bold text-[#26ade4]">50 kg</Text>
                  <Text variant="caption" className="text-[#000000]/60">CO₂ capturado</Text>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#26ade4]/30 text-center">
                  <Sprout className="w-6 h-6 text-[#26ade4] mx-auto mb-2" />
                  <Text variant="body" className="font-bold text-[#26ade4]">1,000 L</Text>
                  <Text variant="caption" className="text-[#000000]/60">agua ahorrada</Text>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#d1e751]/30 text-center">
                  <DollarSign className="w-6 h-6 text-[#66b32e] mx-auto mb-2" />
                  <Text variant="body" className="font-bold text-[#66b32e]">$5 USD</Text>
                  <Text variant="caption" className="text-[#000000]/60">por token</Text>
                </div>
              </div>
            </Card>

            {/* Purchase Section */}
            <Card className="p-8 rounded-2xl border-2 border-[#d1e751]/30 shadow-morpho">
              <div className="space-y-6">
                <div>
                  <Text variant="body" className="mb-3 font-semibold text-lg text-center">
                    ¿Cuántos tokens necesitas?
                  </Text>
                  <Input
                    type="number"
                    placeholder="Ingresa la cantidad de tokens"
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(e.target.value)}
                    className="w-full text-center text-2xl py-4"
                  />
                  <Text variant="caption" className="text-[#000000]/60 mt-2 text-center">
                    Precio: $5 USD por token • Mínimo: 100 tokens
                  </Text>
                </div>

                {bulkAmount && parseFloat(bulkAmount) >= 100 && (
                  <>
                    {/* Impact Preview */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                      <Text variant="body" className="font-bold mb-4 text-center text-lg">
                        Tu Impacto Ambiental
                      </Text>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <Leaf className="w-8 h-8 text-[#66b32e] mx-auto mb-2" />
                          <Text variant="body" className="font-bold text-[#66b32e] text-xl">
                            {(parseFloat(bulkAmount) * 0.1).toFixed(1)} ha
                          </Text>
                          <Text variant="caption" className="text-[#000000]/60">
                            Tierra regenerada
                          </Text>
                        </div>
                        <div className="text-center">
                          <Wind className="w-8 h-8 text-[#26ade4] mx-auto mb-2" />
                          <Text variant="body" className="font-bold text-[#26ade4] text-xl">
                            {(parseFloat(bulkAmount) * 0.05).toFixed(1)} ton
                          </Text>
                          <Text variant="caption" className="text-[#000000]/60">
                            CO₂ capturado
                          </Text>
                        </div>
                        <div className="text-center">
                          <Sprout className="w-8 h-8 text-[#26ade4] mx-auto mb-2" />
                          <Text variant="body" className="font-bold text-[#26ade4] text-xl">
                            {(parseFloat(bulkAmount) * 1000).toLocaleString()} L
                          </Text>
                          <Text variant="caption" className="text-[#000000]/60">
                            Agua ahorrada
                          </Text>
                        </div>
                        <div className="text-center">
                          <Leaf className="w-8 h-8 text-[#66b32e] mx-auto mb-2" />
                          <Text variant="body" className="font-bold text-[#66b32e] text-xl">
                            +{(parseFloat(bulkAmount) * 5).toFixed(0)}
                          </Text>
                          <Text variant="caption" className="text-[#000000]/60">
                            Índice biodiversidad
                          </Text>
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <Text variant="body" className="text-[#000000]/70">
                          Cantidad de tokens:
                        </Text>
                        <Text variant="body" className="font-bold text-xl">
                          {parseFloat(bulkAmount).toLocaleString()}
                        </Text>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <Text variant="body" className="text-[#000000]/70">
                          Precio por token:
                        </Text>
                        <Text variant="body" className="font-bold text-xl">
                          $5 USD
                        </Text>
                      </div>
                      <div className="border-t-2 border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <Text variant="body" className="font-bold text-xl">
                            Total:
                          </Text>
                          <Text className="font-bold text-3xl text-[#26ade4]">
                            ${(parseFloat(bulkAmount) * 5).toLocaleString()} USD
                          </Text>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  title={`Comprar ${bulkAmount ? parseFloat(bulkAmount).toLocaleString() + ' ' : ''}Tokens Regenerativos`}
                  onClick={handleBulkPurchase}
                  variant="blue"
                  disabled={!bulkAmount || parseFloat(bulkAmount) < 100}
                  className="w-full bg-gradient-to-r from-[#26ade4] to-[#66b32e] hover:opacity-90 text-white rounded-xl py-6 text-lg font-bold shadow-xl"
                />
                
                <Text variant="caption" className="text-center text-[#000000]/60">
                  🔒 Pago seguro • Certificado ESG instantáneo • 100% verificable en blockchain
                </Text>
              </div>
            </Card>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 rounded-xl border border-[#66b32e]/30">
                <div className="w-12 h-12 bg-[#66b32e]/10 rounded-xl flex items-center justify-center mb-4">
                  <Filter className="w-6 h-6 text-[#66b32e]" />
                </div>
                <Heading level={4} className="mb-2">100% Verificable</Heading>
                <Text variant="caption" className="text-[#000000]/60">
                  Cada token está respaldado por auditorías independientes mensuales con datos en blockchain.
                </Text>
              </Card>
              <Card className="p-6 rounded-xl border border-[#26ade4]/30">
                <div className="w-12 h-12 bg-[#26ade4]/10 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-[#26ade4]" />
                </div>
                <Heading level={4} className="mb-2">Certificación ESG</Heading>
                <Text variant="caption" className="text-[#000000]/60">
                  Obtén certificados oficiales para tus reportes de sostenibilidad corporativa.
                </Text>
              </Card>
              <Card className="p-6 rounded-xl border border-[#d1e751]/30">
                <div className="w-12 h-12 bg-[#d1e751]/10 rounded-xl flex items-center justify-center mb-4">
                  <Sprout className="w-6 h-6 text-[#66b32e]" />
                </div>
                <Heading level={4} className="mb-2">Impacto Real</Heading>
                <Text variant="caption" className="text-[#000000]/60">
                  Tu inversión regenera tierras reales con métricas cuantificables y transparentes.
                </Text>
              </Card>
            </div>
          </div>
        )}

        {showInvestModal && selectedFarm && (
          <Modal
            isOpen={showInvestModal}
            onClose={() => setShowInvestModal(false)}
            title="Comprar Tokens de Finca"
          >
            <div className="space-y-6">
              <div>
                <Heading level={3} className="mb-2">
                  {selectedFarm.name}
                </Heading>
                <Text variant="caption" className="text-[#000000]/60">
                  {selectedFarm.farmer} - {selectedFarm.location}
                </Text>
              </div>

              <div className="space-y-4">
                <div>
                  <Text variant="body" className="mb-2 font-medium">
                    Cantidad de Tokens
                  </Text>
                  <Input
                    type="number"
                    placeholder="Ingresa cantidad de tokens"
                    value={tokenQuantity}
                    onChange={(e) => setTokenQuantity(e.target.value)}
                    className="w-full"
                  />
                  <Text variant="caption" className="text-[#000000]/60 mt-1">
                    Disponibles: {selectedFarm.available} tokens • Precio: {selectedFarm.tokenPrice}
                    /token
                  </Text>
                </div>

                {tokenQuantity && parseFloat(tokenQuantity) > 0 && (
                  <div className="bg-[#d1e751]/10 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <Text variant="caption" className="text-[#000000]/60">
                        ROI Esperado:
                      </Text>
                      <Text variant="body" className="font-semibold text-[#26ade4]">
                        {selectedFarm.roi}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text variant="caption" className="text-[#000000]/60">
                        Total a Invertir:
                      </Text>
                      <Text variant="body" className="font-semibold text-[#26ade4]">
                        $
                        {(
                          parseFloat(tokenQuantity) *
                          parseFloat(selectedFarm.tokenPrice.replace("$", ""))
                        ).toLocaleString()}{" "}
                        USD
                      </Text>
                    </div>
                    <div className="border-t border-[#d1e751]/30 pt-2 mt-2">
                      <Text variant="caption" className="text-[#66b32e] font-semibold">
                        Métricas de Sostenibilidad
                      </Text>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-center">
                          <Text variant="caption" className="text-[#000000]/60 text-xs">
                            Suelo
                          </Text>
                          <Text variant="body" className="font-bold text-[#66b32e]">
                            {selectedFarm.soilHealth}%
                          </Text>
                        </div>
                        <div className="text-center">
                          <Text variant="caption" className="text-[#000000]/60 text-xs">
                            Carbono
                          </Text>
                          <Text variant="body" className="font-bold text-[#26ade4]">
                            {selectedFarm.carbonScore}%
                          </Text>
                        </div>
                        <div className="text-center">
                          <Text variant="caption" className="text-[#000000]/60 text-xs">
                            Vegetación
                          </Text>
                          <Text variant="body" className="font-bold text-[#66b32e]">
                            {selectedFarm.vegetationIndex}%
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                title="Confirmar Compra de Tokens"
                onClick={handleConfirmTokenInvestment}
                variant="blue"
                disabled={
                  !tokenQuantity ||
                  parseFloat(tokenQuantity) < 1 ||
                  parseFloat(tokenQuantity) > selectedFarm.available
                }
                className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-3"
              />
            </div>
          </Modal>
        )}

        {showCertificate && certificateData && (
          <Modal
            isOpen={showCertificate}
            onClose={() => setShowCertificate(false)}
            title="Certificado de Sostenibilidad"
          >
            <div className="space-y-6">
              <SustainabilityCertificate
                companyName={certificateData.companyName}
                tokensPurchased={certificateData.tokensPurchased}
                totalAmount={certificateData.totalAmount}
                carbonOffset={certificateData.carbonOffset}
                waterSaved={certificateData.waterSaved}
                treesPlanted={certificateData.treesPlanted}
                purchaseDate={certificateData.purchaseDate}
                certificateId={certificateData.certificateId}
                labels={{
                  title: "Certificado de Sostenibilidad",
                  subtitle: "MorphoChain Regenerative Platform",
                  certifies: "Certifica que",
                  purchased: "ha adquirido",
                  amount: "Monto total",
                  environmentalImpact: "Impacto Ambiental",
                  carbonOffset: "Captura de CO₂",
                  waterConserved: "Agua Ahorrada",
                  treesPlanted: "Árboles Plantados",
                  issuedOn: "Emitido el",
                  certificateNumber: "Certificado N°",
                  signature: "Firma Autorizada",
                  signatureName: "Director de Sostenibilidad",
                }}
              />
              <Button
                title="Descargar Certificado PDF"
                onClick={downloadCertificate}
                variant="blue"
                className="w-full bg-[#d1e751] hover:bg-[#d1e751]/90 text-black rounded-xl py-6"
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
