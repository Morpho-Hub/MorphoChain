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

  const tokenFarms = [
    {
      id: 1,
      name: "Finca Verde - Plantación de Café",
      farmer: "Juan Pérez",
      location: "Cartago, Costa Rica",
      category: "Café",
      image: "https://images.unsplash.com/photo-1663125365404-e274869480f6?w=800",
      tokenPrice: "$250",
      totalTokens: 500,
      available: 245,
      roi: "12.5%",
      soilHealth: 92,
      carbonScore: 88,
      vegetationIndex: 90,
      status: "Activo",
      description: "Plantación de café orgánico de altura con prácticas regenerativas que mejoran la salud del suelo",
      practices: [
        "Cultivo bajo sombra",
        "Compostaje orgánico",
        "Control biológico de plagas",
        "Conservación de agua",
      ],
      financialTerms: "Inversión mínima: $250 (1 token). Periodo de retorno: 18 meses. Distribución trimestral.",
    },
    {
      id: 2,
      name: "Cacao del Sol - Cacao Orgánico",
      farmer: "María Rodríguez",
      location: "Limón, Costa Rica",
      category: "Cacao",
      image: "https://images.unsplash.com/photo-1720170723453-dd9de7397bd7?w=800",
      tokenPrice: "$260",
      totalTokens: 400,
      available: 180,
      roi: "10.8%",
      soilHealth: 88,
      carbonScore: 85,
      vegetationIndex: 87,
      status: "Activo",
      description: "Finca de cacao orgánico certificado con agroforestería tropical que secuestra carbono",
      practices: [
        "Agroforestería tropical",
        "Certificación orgánica",
        "Fermentación tradicional",
        "Biodiversidad nativa",
      ],
      financialTerms: "Inversión mínima: $260 (1 token). Periodo de retorno: 24 meses. Distribución semestral.",
    },
    {
      id: 3,
      name: "Montaña Verde - Café Premium",
      farmer: "Luis Mora",
      location: "Cartago, Costa Rica",
      category: "Café",
      image: "https://images.unsplash.com/photo-1663125365404-e274869480f6?w=800",
      tokenPrice: "$275",
      totalTokens: 450,
      available: 195,
      roi: "13.2%",
      soilHealth: 94,
      carbonScore: 90,
      vegetationIndex: 92,
      status: "Popular",
      description: "Café premium de especialidad de alta montaña con métodos regenerativos",
      practices: [
        "Café de especialidad",
        "Reforestación activa",
        "Microorganismos eficientes",
        "Captura de carbono",
      ],
      financialTerms: "Inversión mínima: $275 (1 token). Periodo de retorno: 20 meses. Distribución trimestral con bonos.",
    },
    {
      id: 4,
      name: "Cooperativa de Banano Tropical",
      farmer: "Carlos Jiménez",
      location: "Puntarenas, Costa Rica",
      category: "Banano",
      image: "https://images.unsplash.com/photo-1653481006616-aab561a77a3b?w=800",
      tokenPrice: "$200",
      totalTokens: 600,
      available: 425,
      roi: "9.2%",
      soilHealth: 85,
      carbonScore: 82,
      vegetationIndex: 85,
      status: "Activo",
      description: "Cooperativa de pequeños productores de banano orgánico con comercio justo",
      practices: [
        "Comercio justo",
        "Rotación de cultivos",
        "Manejo integrado de plagas",
        "Reciclaje de residuos",
      ],
      financialTerms: "Inversión mínima: $200 (1 token). Periodo de retorno: 12 meses. Distribución mensual.",
    },
    {
      id: 5,
      name: "Campos de Piña Dorada",
      farmer: "Ana Sánchez",
      location: "Alajuela, Costa Rica",
      category: "Piña",
      image: "https://images.unsplash.com/photo-1694872581803-b279e7a63f7f?w=800",
      tokenPrice: "$180",
      totalTokens: 550,
      available: 320,
      roi: "8.5%",
      soilHealth: 80,
      carbonScore: 78,
      vegetationIndex: 82,
      status: "Activo",
      description: "Cultivo de piña dorada enfocado en reducir impacto ambiental",
      practices: [
        "Cobertura vegetal",
        "Fertilización orgánica",
        "Control natural de malezas",
        "Captación de agua",
      ],
      financialTerms: "Inversión mínima: $180 (1 token). Periodo de retorno: 15 meses. Distribución trimestral.",
    },
    {
      id: 6,
      name: "Cacao Herencia - Finca Familiar",
      farmer: "Isabella García",
      location: "Limón, Costa Rica",
      category: "Cacao",
      image: "https://images.unsplash.com/photo-1720170723453-dd9de7397bd7?w=800",
      tokenPrice: "$245",
      totalTokens: 500,
      available: 280,
      roi: "11.5%",
      soilHealth: 90,
      carbonScore: 87,
      vegetationIndex: 89,
      status: "Activo",
      description: "Finca multigeneracional de cacao fino preservando variedades ancestrales",
      practices: [
        "Variedades ancestrales",
        "Conocimiento tradicional",
        "Agroecología",
        "Conservación genética",
      ],
      financialTerms: "Inversión mínima: $245 (1 token). Periodo de retorno: 22 meses. Distribución semestral.",
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
    const amount = parseFloat(bulkAmount);
    const tokens = Math.floor(amount / 10);
    const carbonOffset = (tokens * 0.5).toFixed(1);
    const waterSaved = (tokens * 1000).toLocaleString();
    const treesPlanted = Math.floor(tokens / 10);

    const certData = {
      companyName: "Mi Empresa S.A.",
      tokensPurchased: tokens,
      totalAmount: `$${amount.toLocaleString()} USD`,
      carbonOffset: `${carbonOffset} ton CO₂`,
      waterSaved: `${waterSaved} L`,
      treesPlanted,
      purchaseDate: new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      certificateId: `MC-${Date.now().toString().slice(-8)}`,
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
    <div className="min-h-screen bg-gradient-hero py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Heading level={1} className="text-4xl">
            {t.title}
          </Heading>
          <Text className="text-lg max-w-2xl mx-auto">{t.subtitle}</Text>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            title="Inversión Directa"
            variant={activeTab === "direct" ? "blue" : "white_bordered"}
            onClick={() => setActiveTab("direct")}
            className="px-8 py-3 rounded-xl"
          />
          <Button
            title="Inversión Corporativa"
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
          <Card className="max-w-2xl mx-auto p-8 rounded-2xl border-2 border-[#d1e751]/30 shadow-morpho">
            <div className="space-y-6">
              <div className="text-center">
                <Heading level={2} className="mb-2">
                  {t.corporate.title}
                </Heading>
                <Text className="text-[#000000]/60">{t.corporate.subtitle}</Text>
              </div>

              <div className="space-y-4">
                <div>
                  <Text variant="body" className="mb-2 font-medium">
                    Monto a Invertir (USD)
                  </Text>
                  <Input
                    type="number"
                    placeholder="Ingresa el monto"
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(e.target.value)}
                    className="w-full"
                  />
                  <Text variant="caption" className="text-[#000000]/60 mt-1">
                    Mínimo: $1,000 USD • $10 USD por token de sostenibilidad
                  </Text>
                </div>

                {bulkAmount && parseFloat(bulkAmount) >= 1000 && (
                  <div className="bg-[#d1e751]/10 rounded-xl p-4 space-y-2">
                    <Text variant="body" className="font-semibold mb-3">
                      Impacto Estimado:
                    </Text>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#26ade4]" />
                        <div>
                          <Text variant="caption" className="text-[#000000]/60">
                            Tokens
                          </Text>
                          <Text variant="body" className="font-semibold">
                            {Math.floor(parseFloat(bulkAmount) / 10).toLocaleString()}
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-[#26ade4]" />
                        <div>
                          <Text variant="caption" className="text-[#000000]/60">
                            CO₂ Capturado
                          </Text>
                          <Text variant="body" className="font-semibold">
                            {((Math.floor(parseFloat(bulkAmount) / 10) * 0.5)).toFixed(1)} ton
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-[#66b32e]" />
                        <div>
                          <Text variant="caption" className="text-[#000000]/60">
                            Árboles Plantados
                          </Text>
                          <Text variant="body" className="font-semibold">
                            {Math.floor(Math.floor(parseFloat(bulkAmount) / 10) / 10)}
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-[#66b32e]" />
                        <div>
                          <Text variant="caption" className="text-[#000000]/60">
                            Agua Ahorrada
                          </Text>
                          <Text variant="body" className="font-semibold">
                            {(Math.floor(parseFloat(bulkAmount) / 10) * 1000).toLocaleString()} L
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                title={t.corporate.bulkPurchase.purchaseButton}
                onClick={handleBulkPurchase}
                variant="blue"
                disabled={!bulkAmount || parseFloat(bulkAmount) < 1000}
                className="w-full bg-[#d1e751] hover:bg-[#d1e751]/90 text-black rounded-xl py-6"
              />
            </div>
          </Card>
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
