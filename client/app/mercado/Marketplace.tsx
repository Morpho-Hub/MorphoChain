"use client";

import { Filter, X, ShoppingBag, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Badge,
  Separator,
  ImageWithFallback,
  Heading,
  Text,
  Select,
} from "@/src/atoms";
import { SearchBar, Modal } from "@/src/molecules";
import { ReceiptModal } from "@/src/organisms";
import type { ReceiptData } from "@/src/organisms/Receipt";
import { es } from "@/locales";
import { farmService, productService, Farm, Product } from "@/src/services";
import { useAuth } from "@/contexts/AuthContext";

interface MarketplaceProps {
  onNavigate: (page: string) => void;
}

interface FarmWithProducts extends Farm {
  products: Product[];
  farmer: string;
  practices: string[];
}

export function Marketplace({ onNavigate }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<FarmWithProducts | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productQuantity, setProductQuantity] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [assets, setAssets] = useState<FarmWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const t = es.marketplace;

  // Load farms and products from backend
  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        setLoading(true);
        
        // Get all active farms
        const farmsResponse = await farmService.getAll({ status: 'active' });
        
        if (farmsResponse.success && farmsResponse.data) {
          // Load products for each farm
          const farmsWithProducts = await Promise.all(
            farmsResponse.data.map(async (farm) => {
              const productsResponse = await productService.getByFarm(farm._id || farm.id);
              
              const farmOwner = typeof farm.owner === 'object' && farm.owner !== null 
                ? (farm.owner as any).name 
                : 'Agricultor';
              
              return {
                ...farm,
                id: farm._id || farm.id,
                farmer: farmOwner,
                image: farm.images?.[0] || '/default-farm.jpg',
                status: farm.status === 'active' ? 'Activo' : 'Inactivo',
                category: farm.cropType || 'other',
                practices: farm.certifications?.map((c: any) => c.name || c) || [],
                products: (productsResponse.success && productsResponse.data) 
                  ? productsResponse.data.filter(p => p.status === 'active' && p.stock > 0).map(p => ({
                      ...p,
                      price: `$${p.price}`,
                    }))
                  : [],
              };
            })
          );
          
          // Filter farms that have products
          setAssets(farmsWithProducts.filter(f => f.products.length > 0));
        }
      } catch (error) {
        console.error('Error loading marketplace data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarketplaceData();
  }, []);

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

  const handleBuyProduct = async () => {
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
    const regenerativeRewardPercentage = 0.05; // 5% por defecto
    const regenerativeReward = subtotal * regenerativeRewardPercentage;
    const total = subtotal + regenerativeReward;

    // Generate receipt data
    const receipt: ReceiptData = {
      orderNumber: `MCH-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      buyerName: user ? `${user.firstName} ${user.lastName}` : "Usuario Inversor",
      buyerEmail: user?.email || "usuario@example.com",
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
    
    // TODO: Save purchase transaction to backend
    // await transactionService.createTransaction({
    //   type: 'purchase',
    //   amount: total,
    //   relatedEntity: { type: 'farm', id: selectedAsset._id },
    //   metadata: { products: purchasedProducts }
    // });
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#26ade4] mb-4"></div>
            <Text className="text-xl text-gray-600">Cargando productos del mercado...</Text>
            <Text variant="caption" className="text-gray-500 mt-2">
              Buscando fincas con productos disponibles
            </Text>
          </div>
        )}

        {/* Assets Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets
            .filter((asset) => {
              const matchesSearch = searchQuery === "" ||
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.location.toLowerCase().includes(searchQuery.toLowerCase());
              
              const matchesCategory = selectedCategory === "all" ||
                asset.category.toLowerCase() === selectedCategory.toLowerCase() ||
                (selectedCategory === "coffee" && asset.category.toLowerCase().includes("café")) ||
                (selectedCategory === "others" && !asset.category.toLowerCase().includes("café") && !asset.category.toLowerCase().includes("cacao") && !asset.category.toLowerCase().includes("banana") && !asset.category.toLowerCase().includes("piña"));
              
              const matchesRegion = selectedRegion === "all" ||
                asset.location.toLowerCase().includes(selectedRegion.toLowerCase());
              
              return matchesSearch && matchesCategory && matchesRegion;
            })
              .map((asset) => (
              <Card
                key={asset._id}
                className="rounded-2xl overflow-hidden border-2 border-[#d1e751]/30"
              >
                <div
                  className="cursor-pointer hover:shadow-morpho transition-shadow"
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowProductForm(false);
                  }}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={asset.image}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={asset.status === "Popular" ? "primary" : "success"}>
                        {asset.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <Heading level={3} className="line-clamp-1">{asset.name}</Heading>
                    <Text variant="caption" className="text-[#000000]/60">
                      Por {asset.farmer} • {asset.location}
                    </Text>
                    <Text variant="small" className="line-clamp-2">
                      {asset.description}
                    </Text>
                    
                    <div className="pt-2 border-t border-[#d1e751]/30">
                      <Text variant="caption" className="font-semibold text-[#66b32e] mb-2 block">
                        Productos Disponibles:
                      </Text>
                      <div className="space-y-1">
                        {asset.products.slice(0, 3).map((product: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center">
                            <Text variant="small" className="text-[#000000]/70">
                              • {product.name}
                            </Text>
                            <Text variant="small" className="font-semibold text-[#26ade4]">
                              {product.price}/{product.unit}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && assets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <Text className="text-2xl font-semibold text-gray-800 mb-2">
              No hay productos disponibles
            </Text>
            <Text className="text-gray-600 text-center max-w-md mb-6">
              Actualmente no hay fincas con productos listos para la venta. ¡Vuelve pronto para ver nuevas ofertas!
            </Text>
            <Button
              title="Ver todas las fincas"
              variant="primary"
              onClick={() => onNavigate('inversion')}
              className="rounded-xl"
            />
          </div>
        )}        {/* Load More */}
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
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={selectedAsset.image}
                    alt={selectedAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <Heading level={3} className="mb-2">{t.details.projectDescription}</Heading>
                  <Text>{selectedAsset.description}</Text>
                </div>

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
                            min="0"
                            className="w-20"
                            value={productQuantity[product.name] ?? ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              setProductQuantity({
                                ...productQuantity,
                                [product.name]: isNaN(value) ? 0 : Math.max(0, value),
                              });
                            }}
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
