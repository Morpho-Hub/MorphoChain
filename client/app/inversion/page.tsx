"use client";

import { useState } from "react";
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

export default function InversionPage() {
  const [activeTab, setActiveTab] = useState<"direct" | "corporate">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("roi");
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [bulkAmount, setBulkAmount] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);

  const t = es.investment;

  // Mock data for tokenized farms
  const tokenFarms = [
    {
      id: 1,
      name: "Finca Café Orgánico El Paraíso",
      farmer: "Carlos Rodríguez",
      location: "Tarrazú, Costa Rica",
      category: "café",
      image: "/images/coffee-farm.jpg",
      tokenPrice: "$10",
      roi: "18% anual",
      available: 450,
      totalTokens: 1000,
      status: "Popular",
      soilHealth: 92,
      carbonScore: 88,
      vegetationIndex: 95,
    },
    {
      id: 2,
      name: "Plantación Cacao Fino Orgánico",
      farmer: "María González",
      location: "Limón, Costa Rica",
      category: "cacao",
      image: "/images/cacao-farm.jpg",
      tokenPrice: "$15",
      roi: "22% anual",
      available: 320,
      totalTokens: 800,
      status: "Destacado",
      soilHealth: 89,
      carbonScore: 91,
      vegetationIndex: 93,
    },
    {
      id: 3,
      name: "Finca Banano Regenerativo",
      farmer: "José Mora",
      location: "Guápiles, Costa Rica",
      category: "banano",
      image: "/images/banana-farm.jpg",
      tokenPrice: "$8",
      roi: "15% anual",
      available: 580,
      totalTokens: 1200,
      status: "Popular",
      soilHealth: 85,
      carbonScore: 82,
      vegetationIndex: 88,
    },
    {
      id: 4,
      name: "Piña Golden Sostenible",
      farmer: "Ana Jiménez",
      location: "San Carlos, Costa Rica",
      category: "piña",
      image: "/images/pineapple-farm.jpg",
      tokenPrice: "$12",
      roi: "20% anual",
      available: 200,
      totalTokens: 600,
      status: "Destacado",
      soilHealth: 90,
      carbonScore: 87,
      vegetationIndex: 91,
    },
  ];

  const handleTokenInvest = (farm: any) => {
    setSelectedFarm(farm);
    setShowInvestModal(true);
  };

  const handleConfirmTokenInvestment = () => {
    console.log("Token Investment:", { farm: selectedFarm, tokens: tokenQuantity });
    setShowInvestModal(false);
    setTokenQuantity("");
  };

  const handleBulkPurchase = () => {
    const tokens = parseFloat(bulkAmount);
    const totalAmount = tokens * 5; // $5 por token
    const carbonOffset = (tokens * 0.05).toFixed(1); // 50kg = 0.05 ton por token
    const waterSaved = (tokens * 1000).toLocaleString(); // 1000L por token
    const hectareasRegeneradas = (tokens * 0.1).toFixed(1); // 0.1 ha por token
    const biodiversidadIndex = (tokens * 5).toFixed(0); // 5 puntos por token

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
                  companyName: "Empresa",
                  tokensPurchased: "Tokens Adquiridos",
                  totalAmount: "Monto Total",
                  carbonOffset: "Captura de CO₂",
                  waterSaved: "Agua Ahorrada",
                  treesPlanted: "Árboles Plantados",
                  purchaseDate: "Fecha de Compra",
                  certificateId: "ID del Certificado",
                  signature: "Firma Autorizada",
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
