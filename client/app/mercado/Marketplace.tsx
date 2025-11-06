"use client";

import { Filter, X, ShoppingBag, DollarSign, Sprout, Wind, Leaf } from "lucide-react";
import { useState } from "react";
import {
  Card,
  Input,
  Button,
  Badge,
  Progress,
  Label,
  Separator,
  ImageWithFallback,
  Heading,
  Text,
  Select,
  StatCard,
} from "@/src/atoms";
import { SearchBar, AssetCard, Modal } from "@/src/molecules";
import { ReceiptModal } from "@/src/organisms";
import type { ReceiptData } from "@/src/organisms/Receipt";
import { es } from "@/locales";

interface MarketplaceProps {
  onNavigate: (page: string) => void;
}

interface Asset {
  id: number;
  name: string;
  farmer: string;
  location: string;
  category: string;
  image: string;
  price: string;
  tokenPrice: string;
  totalTokens: number;
  available: number;
  roi: string;
  soilHealth: number;
  carbonScore: number;
  vegetationIndex: number;
  status: string;
  description: string;
  practices: string[];
  financialTerms: string;
  products: { name: string; price: string; unit: string }[];
}

export function Marketplace({ onNavigate }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productQuantity, setProductQuantity] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const t = es.marketplace;

  const categoryOptions = [
    { value: "all", label: t.categories.all },
    { value: "coffee", label: t.categories.coffee },
    { value: "cacao", label: t.categories.cacao },
    { value: "banana", label: t.categories.banana },
    { value: "pineapple", label: t.categories.pineapple },
    { value: "others", label: t.categories.others },
  ];

  const regionOptions = [
    { value: "all", label: t.regions.all },
    { value: "cartago", label: t.regions.cartago },
    { value: "limon", label: t.regions.limon },
    { value: "puntarenas", label: t.regions.puntarenas },
    { value: "alajuela", label: t.regions.alajuela },
  ];

  const assets: Asset[] = [
    {
      id: 1,
      name: "Finca Verde - Plantación de Café",
      farmer: "Juan Pérez",
      location: "Cartago, Costa Rica",
      category: "Café",
      image: "https://images.unsplash.com/photo-1663125365404-e274869480f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGZhcm18ZW58MXx8fHwxNzYwNjAzNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "$250",
      tokenPrice: "por token",
      totalTokens: 500,
      available: 245,
      roi: "12.5%",
      soilHealth: 92,
      carbonScore: 88,
      vegetationIndex: 90,
      status: "Activo",
      description: "Plantación de café orgánico de altura en Cartago, cultivado bajo sombra con prácticas regenerativas que mejoran la salud del suelo y promueven la biodiversidad.",
      practices: [
        "Cultivo bajo sombra",
        "Compostaje orgánico",
        "Control biológico de plagas",
        "Conservación de agua",
      ],
      financialTerms: "Inversión mínima: $250 (1 token). Periodo de retorno: 18 meses. Distribución de ganancias trimestral basada en ventas de cosecha.",
      products: [
        { name: "Café Verde Premium", price: "$18", unit: "lb" },
        { name: "Café Tostado Artesanal", price: "$22", unit: "lb" },
        { name: "Café Molido Orgánico", price: "$20", unit: "lb" },
      ],
    },
    {
      id: 2,
      name: "Cacao del Sol - Cacao Orgánico",
      farmer: "María Rodríguez",
      location: "Limón, Costa Rica",
      category: "Cacao",
      image: "https://images.unsplash.com/photo-1720170723453-dd9de7397bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHBvZHN8ZW58MXx8fHwxNzYwNjc2Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "$260",
      tokenPrice: "por token",
      totalTokens: 400,
      available: 180,
      roi: "10.8%",
      soilHealth: 88,
      carbonScore: 85,
      vegetationIndex: 87,
      status: "Activo",
      description: "Finca familiar de cacao orgánico certificado, usando agroforestería tropical que secuestra carbono y protege especies nativas.",
      practices: [
        "Agroforestería tropical",
        "Certificación orgánica",
        "Fermentación tradicional",
        "Biodiversidad nativa",
      ],
      financialTerms: "Inversión mínima: $260 (1 token). Periodo de retorno: 24 meses. Distribución semestral.",
      products: [
        { name: "Cacao en Grano Premium", price: "$15", unit: "lb" },
        { name: "Nibs de Cacao Orgánico", price: "$18", unit: "lb" },
        { name: "Pasta de Cacao 100%", price: "$25", unit: "lb" },
      ],
    },
    {
      id: 3,
      name: "Cooperativa de Banano Tropical",
      farmer: "Carlos Jiménez",
      location: "Puntarenas, Costa Rica",
      category: "Banano",
      image: "https://images.unsplash.com/photo-1653481006616-aab561a77a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBwbGFudGF0aW9ufGVufDF8fHx8MTc2MDY3NjM3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "$200",
      tokenPrice: "por token",
      totalTokens: 600,
      available: 425,
      roi: "9.2%",
      soilHealth: 85,
      carbonScore: 82,
      vegetationIndex: 85,
      status: "Activo",
      description: "Cooperativa de pequeños productores de banano orgánico, enfocada en comercio justo y prácticas sostenibles.",
      practices: [
        "Comercio justo",
        "Rotación de cultivos",
        "Manejo integrado de plagas",
        "Reciclaje de residuos",
      ],
      financialTerms: "Inversión mínima: $200 (1 token). Periodo de retorno: 12 meses. Distribución mensual.",
      products: [
        { name: "Banano Orgánico", price: "$3", unit: "kg" },
        { name: "Plátano Maduro", price: "$2.50", unit: "kg" },
        { name: "Chips de Plátano", price: "$8", unit: "lb" },
      ],
    },
    {
      id: 4,
      name: "Campos de Piña Dorada",
      farmer: "Ana Sánchez",
      location: "Alajuela, Costa Rica",
      category: "Piña",
      image: "https://images.unsplash.com/photo-1694872581803-b279e7a63f7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lYXBwbGUlMjBmaWVsZHxlbnwxfHx8fDE3NjA2NzYzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "$180",
      tokenPrice: "por token",
      totalTokens: 550,
      available: 320,
      roi: "8.5%",
      soilHealth: 80,
      carbonScore: 78,
      vegetationIndex: 82,
      status: "Activo",
      description: "Cultivo de piña dorada con enfoque en reducir el impacto ambiental y mejorar la calidad del suelo.",
      practices: [
        "Cobertura vegetal",
        "Fertilización orgánica",
        "Control natural de malezas",
        "Captación de agua",
      ],
      financialTerms: "Inversión mínima: $180 (1 token). Periodo de retorno: 15 meses. Distribución trimestral.",
      products: [
        { name: "Piña Dorada Fresca", price: "$4", unit: "unidad" },
        { name: "Piña Deshidratada", price: "$12", unit: "lb" },
        { name: "Jugo de Piña Natural", price: "$6", unit: "litro" },
      ],
    },
    {
      id: 5,
      name: "Montaña Verde - Café Premium",
      farmer: "Luis Mora",
      location: "Cartago, Costa Rica",
      category: "Café",
      image: "https://images.unsplash.com/photo-1663125365404-e274869480f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGZhcm18ZW58MXx8fHwxNzYwNjAzNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "$275",
      tokenPrice: "por token",
      totalTokens: 450,
      available: 195,
      roi: "13.2%",
      soilHealth: 94,
      carbonScore: 90,
      vegetationIndex: 92,
      status: "Popular",
      description: "Café premium de especialidad, cultivado en alta montaña con métodos regenerativos que restauran el ecosistema.",
      practices: [
        "Café de especialidad",
        "Reforestación activa",
        "Microorganismos eficientes",
        "Captura de carbono",
      ],
      financialTerms: "Inversión mínima: $275 (1 token). Periodo de retorno: 20 meses. Distribución trimestral con bonos por rendimiento.",
      products: [
        { name: "Café Especial Geisha", price: "$35", unit: "lb" },
        { name: "Café de Altura Premium", price: "$28", unit: "lb" },
        { name: "Café Cold Brew Concentrado", price: "$15", unit: "botella" },
      ],
    },
    {
      id: 6,
      name: "Cacao Herencia - Finca Familiar",
      farmer: "Isabella García",
      location: "Limón, Costa Rica",
      category: "Cacao",
      image: "https://images.unsplash.com/photo-1720170723453-dd9de7397bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHBvZHN8ZW58MXx8fHwxNzYwNjc2Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "$245",
      tokenPrice: "por token",
      totalTokens: 500,
      available: 280,
      roi: "11.5%",
      soilHealth: 90,
      carbonScore: 87,
      vegetationIndex: 89,
      status: "Activo",
      description: "Finca familiar multigeneracional de cacao fino de aroma, preservando variedades ancestrales y conocimiento tradicional.",
      practices: [
        "Variedades ancestrales",
        "Conocimiento tradicional",
        "Agroecología",
        "Conservación genética",
      ],
      financialTerms: "Inversión mínima: $245 (1 token). Periodo de retorno: 22 meses. Distribución semestral.",
      products: [
        { name: "Cacao Fino de Aroma", price: "$20", unit: "lb" },
        { name: "Chocolate Artesanal 85%", price: "$8", unit: "barra" },
        { name: "Manteca de Cacao Pura", price: "$30", unit: "lb" },
      ],
    },
  ];

  const handleBuyProduct = () => {
    if (!selectedAsset) return;

    // Calculate purchase details
    const purchasedProducts = selectedAsset.products
      .filter(product => productQuantity[product.name] > 0)
      .map(product => ({
        name: product.name,
        quantity: productQuantity[product.name],
        unitPrice: parseFloat(product.price.replace('$', '')),
        unit: product.unit,
      }));

    if (purchasedProducts.length === 0) return;

    const subtotal = purchasedProducts.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    // TODO: Get regenerativeRewardPercentage from backend (e.g., 5%)
    const regenerativeRewardPercentage = 0.05; // 5% por defecto
    const regenerativeReward = subtotal * regenerativeRewardPercentage;
    const total = subtotal + regenerativeReward;

    // Generate receipt data
    const receipt: ReceiptData = {
      orderNumber: `MCH-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      buyerName: "Usuario Inversor", // TODO: Get from auth context
      buyerEmail: "usuario@example.com", // TODO: Get from auth context
      sellerName: selectedAsset.farmer,
      farmName: selectedAsset.name,
      farmLocation: selectedAsset.location,
      products: purchasedProducts,
      subtotal,
      regenerativeReward,
      total,
      status: "paid",
    };

    setReceiptData(receipt);
    setShowProductForm(false);
    setProductQuantity({});
    setShowReceipt(true);
    
    // TODO: Save purchase to database/localStorage
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading level={1} className="text-4xl">{t.title}</Heading>
          <Text className="text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </Text>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 rounded-2xl border-2 border-[#d1e751]/30 shadow-morpho">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <SearchBar
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {/* Category Filter */}
            <div className="flex gap-3">
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />

              <Select
                options={regionOptions}
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              />

              <Button
                title=""
                icon={<Filter className="w-5 h-5" />}
                variant="white_bordered"
                className="rounded-xl"
              />
            </div>
          </div>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard value="24" label={t.stats.activeFarms} />
          <StatCard value="$4.8M" label={t.stats.totalValue} />
          <StatCard value="2,450" label={t.stats.tokensAvailable} />
          <StatCard value="10.8%" label={t.stats.averageROI} />
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              name={asset.name}
              farmer={asset.farmer}
              location={asset.location}
              image={asset.image}
              price={asset.price}
              tokenPrice={asset.tokenPrice}
              totalTokens={asset.totalTokens}
              available={asset.available}
              roi={asset.roi}
              soilHealth={asset.soilHealth}
              carbonScore={asset.carbonScore}
              vegetationIndex={asset.vegetationIndex}
              status={asset.status}
              onClick={() => setSelectedAsset(asset)}
              labels={t.card}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-8">
          <Button
            title={t.actions.loadMore}
            variant="white_bordered"
            className="rounded-xl px-12 py-6"
          />
        </div>

        {/* Asset Detail Modal */}
        <Modal
          isOpen={selectedAsset !== null}
          onClose={() => {
            setSelectedAsset(null);
            setShowProductForm(false);
          }}
          title={selectedAsset?.name}
        >
          {selectedAsset && (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-start justify-between">
                  <Text variant="caption">
                    {t.card.by} {selectedAsset.farmer} • {selectedAsset.location}
                  </Text>
                  <Badge variant={selectedAsset.status === t.card.popular ? "primary" : "success"}>
                    {selectedAsset.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {/* Image */}
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={selectedAsset.image}
                    alt={selectedAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Project Overview */}
                <div>
                  <Heading level={3} className="mb-2">{t.details.projectDescription}</Heading>
                  <Text>{selectedAsset.description}</Text>
                </div>

                {/* Practices */}
                <div>
                  <Heading level={3} className="mb-2">{t.details.sustainablePractices}</Heading>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedAsset.practices.map((practice, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#d1e751]/10">
                        <Leaf className="w-4 h-4 text-[#d1e751]" />
                        <Text variant="caption">{practice}</Text>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Data */}
                <div>
                  <Heading level={3} className="mb-3">{t.details.impactIndicators}</Heading>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#d1e751]/10 border border-[#d1e751]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Sprout className="w-5 h-5 text-black/70" />
                        <Text variant="caption">{t.details.soil}</Text>
                      </div>
                      <Heading level={2} className="mb-2">{selectedAsset.soilHealth}%</Heading>
                      <Progress value={selectedAsset.soilHealth} className="h-2" />
                    </div>
                    <div className="p-4 rounded-xl bg-[#4dbce9]/10 border border-[#4dbce9]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-5 h-5 text-black/70" />
                        <Text variant="caption">{t.details.carbon}</Text>
                      </div>
                      <Heading level={2} className="mb-2">{selectedAsset.carbonScore}%</Heading>
                      <Progress value={selectedAsset.carbonScore} className="h-2" />
                    </div>
                    <div className="p-4 rounded-xl bg-[#d1e751]/10 border border-[#d1e751]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-5 h-5 text-black/70" />
                        <Text variant="caption">{t.details.vegetation}</Text>
                      </div>
                      <Heading level={2} className="mb-2">{selectedAsset.vegetationIndex}%</Heading>
                      <Progress value={selectedAsset.vegetationIndex} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Financial Terms */}
                <div className="p-4 rounded-xl bg-[#26ade4]/5 border border-[#26ade4]/30">
                  <Heading level={3} className="mb-2">{t.details.financialTerms}</Heading>
                  <Text variant="caption">{selectedAsset.financialTerms}</Text>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <Text variant="small" className="mb-1">{t.details.tokenValue}</Text>
                      <Heading level={3}>{selectedAsset.price}</Heading>
                    </div>
                    <div>
                      <Text variant="small" className="mb-1">{t.details.availableTokens}</Text>
                      <Heading level={3}>{selectedAsset.available}</Heading>
                    </div>
                    <div>
                      <Text variant="small" className="mb-1">{t.details.expectedROI}</Text>
                      <Heading level={3} className="text-[#d1e751]">{selectedAsset.roi}</Heading>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                {!showProductForm && (
                  <Button
                    title={t.details.buyProducts}
                    icon={<ShoppingBag className="w-5 h-5" />}
                    iconPosition="left"
                    onClick={() => setShowProductForm(true)}
                    variant="blue"
                    className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-6"
                  />
                )}

                {/* Product Purchase Form */}
                {showProductForm && (
                  <div className="p-6 rounded-xl bg-[#d1e751]/5 border-2 border-[#d1e751]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <Heading level={3}>{t.productForm.title}</Heading>
                      <button
                        onClick={() => setShowProductForm(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedAsset.products.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#d1e751]/30">
                          <div className="flex-1">
                            <Text>{product.name}</Text>
                            <Text variant="caption">{product.price} / {product.unit}</Text>
                          </div>
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-20"
                            value={productQuantity[product.name] || ''}
                            onChange={(e) => setProductQuantity({
                              ...productQuantity,
                              [product.name]: parseInt(e.target.value) || 0
                            })}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-[#26ade4]/10">
                      <div className="flex justify-between">
                        <Text>{t.productForm.total}</Text>
                        <Heading level={3}>
                          ${selectedAsset.products.reduce((sum, product) => {
                            const qty = productQuantity[product.name] || 0;
                            const price = parseInt(product.price.replace('$', ''));
                            return sum + (qty * price);
                          }, 0)}
                        </Heading>
                      </div>
                    </div>

                    <Button
                      title={t.productForm.confirmPurchase}
                      onClick={handleBuyProduct}
                      variant="blue"
                      className="w-full bg-[#d1e751] hover:bg-[#d1e751]/90 text-black rounded-xl py-6"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </Modal>

        {/* Receipt Modal */}
        {receiptData && (
          <ReceiptModal
            isOpen={showReceipt}
            onClose={() => {
              setShowReceipt(false);
              setSelectedAsset(null);
            }}
            receiptData={receiptData}
          />
        )}
      </div>
    </div>
  );
}
