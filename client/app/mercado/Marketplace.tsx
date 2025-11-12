"use client";

import { Filter, ShoppingBag } from "lucide-react";
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
import { farmService, productService, transactionService, Product } from "@/src/services";
import { useAuth } from "@/contexts/AuthContext";

interface MarketplaceProps {
  onNavigate: (page: string) => void;
}

interface ProductWithFarmInfo extends Product {
  priceDisplay: string;
  farmName: string;
  farmLocation: string;
  farmImage: string;
  farmerName: string;
  farmId: string;
  productImage: string;
}

export function Marketplace({ onNavigate }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductWithFarmInfo | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [products, setProducts] = useState<ProductWithFarmInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const t = es.marketplace;

  // Helper function to format location
  const formatLocation = (location: any): string => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null) {
      const parts = [location.city, location.region, location.country].filter(Boolean);
      return parts.join(', ') || 'Ubicación no especificada';
    }
    return 'Ubicación no especificada';
  };

  // Load products from backend
  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        setLoading(true);
        
        // Get all active farms
        const farmsResponse = await farmService.getAll({ status: 'active' });
        
        if (farmsResponse.success && farmsResponse.data) {
          // Load products for each farm and flatten into single array
          const allProductsPromises = farmsResponse.data.map(async (farm) => {
            const farmId = farm._id || '';
            if (!farmId) return [];

            const productsResponse = await productService.getByFarm(farmId);
            
            if (!productsResponse.success || !productsResponse.data) return [];

            const farmOwner = typeof farm.owner === 'object' && farm.owner !== null 
              ? (farm.owner as { _id: string; name: string }).name || 'Agricultor'
              : 'Agricultor';

            // Transform each product to include farm info
            return productsResponse.data
              .filter(p => p.status === 'active' && p.stock > 0)
              .map(p => {
                // Extract first image URL (handle both string and object formats)
                let productImage = '/default-product.jpg';
                if (p.images && p.images.length > 0) {
                  const firstImg = p.images[0];
                  productImage = typeof firstImg === 'string' ? firstImg : (firstImg as any).url || '/default-product.jpg';
                }
                
                return {
                  ...p,
                  priceDisplay: `$${p.price}`,
                  farmName: farm.name,
                  farmLocation: formatLocation(farm.location),
                  farmImage: farm.images?.[0] || '/default-farm.jpg',
                  farmerName: farmOwner,
                  farmId: farmId,
                  productImage, // Add processed product image
                };
              });
          });

          const productsArrays = await Promise.all(allProductsPromises);
          const flatProducts = productsArrays.flat();
          
          setProducts(flatProducts);
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
    if (!selectedProduct || productQuantity < 1) return;

    try {
      const quantity = productQuantity;
      const unitPrice = selectedProduct.price;
      const subtotal = quantity * unitPrice;
      const regenerativeRewardPercentage = 0.05; // 5% fee
      const regenerativeReward = subtotal * regenerativeRewardPercentage;
      const total = subtotal + regenerativeReward;

      const purchasedProducts = [{
        productId: selectedProduct._id,
        name: selectedProduct.name,
        quantity,
        unitPrice,
        unit: selectedProduct.unit,
        total: subtotal,
      }];

      // Get farm owner ID
      const farmOwnerId = typeof selectedProduct.farm === 'object' && selectedProduct.farm !== null
        ? (selectedProduct.farm as any).owner?._id || (selectedProduct.farm as any).owner
        : selectedProduct.farm;

      // Create transaction in backend
      const transactionResponse = await transactionService.createTransaction({
        type: 'product-purchase',
        amount: total,
        to: farmOwnerId, // Farmer receives payment
        relatedFarm: selectedProduct.farmId,
        paymentMethod: 'wallet',
        metadata: {
          orderId: `MCH-${Date.now().toString().slice(-8)}`,
          farmName: selectedProduct.farmName,
          products: purchasedProducts,
        },
      });

      if (!transactionResponse.success) {
        throw new Error('Error al crear la transacción');
      }

      // Update stock
      await productService.updateStock(selectedProduct._id, quantity);

      // Generate receipt data
      const receipt: ReceiptData = {
        orderNumber: transactionResponse.data?.metadata?.orderId || `MCH-${Date.now().toString().slice(-8)}`,
        date: new Date().toISOString(),
        buyerName: user ? `${user.firstName} ${user.lastName}` : "Usuario Comprador",
        buyerEmail: user?.email || "usuario@example.com",
        sellerName: selectedProduct.farmerName,
        farmName: selectedProduct.farmName,
        farmLocation: selectedProduct.farmLocation,
        products: purchasedProducts,
        subtotal,
        regenerativeReward,
        total,
        status: "paid",
      };

      // Show receipt
      setReceiptData(receipt);
      setProductQuantity(1);
      setSelectedProduct(null);
      setShowReceipt(true);

      // Reload marketplace data to reflect updated stock
      const farmsResponse = await farmService.getAll({ status: 'active' });
      if (farmsResponse.success && farmsResponse.data) {
        const allProductsPromises = farmsResponse.data.map(async (farm) => {
          const farmId = farm._id || '';
          if (!farmId) return [];

          const productsResponse = await productService.getByFarm(farmId);
          
          if (!productsResponse.success || !productsResponse.data) return [];

          const farmOwner = typeof farm.owner === 'object' && farm.owner !== null 
            ? (farm.owner as { _id: string; name: string }).name || 'Agricultor'
            : 'Agricultor';

          return productsResponse.data
            .filter(p => p.status === 'active' && p.stock > 0)
            .map(p => ({
              ...p,
              priceDisplay: `$${p.price}`,
              farmName: farm.name,
              farmLocation: formatLocation(farm.location),
              farmImage: farm.images?.[0] || '/default-farm.jpg',
              farmerName: farmOwner,
              farmId: farmId,
            }));
        });

        const productsArrays = await Promise.all(allProductsPromises);
        const flatProducts = productsArrays.flat();
        
        setProducts(flatProducts);
      }

    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Hubo un error al procesar tu compra. Por favor intenta nuevamente.');
    }
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

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
            .filter((product) => {
              const locationStr = product.farmLocation.toLowerCase();
              
              const matchesSearch = searchQuery === "" ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                locationStr.includes(searchQuery.toLowerCase());
              
              const matchesCategory = selectedCategory === "all" ||
                product.category.toLowerCase() === selectedCategory.toLowerCase() ||
                (selectedCategory === "coffee" && product.category.toLowerCase().includes("café")) ||
                (selectedCategory === "cacao" && product.category.toLowerCase().includes("cacao")) ||
                (selectedCategory === "banana" && (product.category.toLowerCase().includes("banana") || product.category.toLowerCase().includes("plátano"))) ||
                (selectedCategory === "pineapple" && product.category.toLowerCase().includes("piña")) ||
                (selectedCategory === "others" && 
                  !product.category.toLowerCase().includes("café") && 
                  !product.category.toLowerCase().includes("cacao") && 
                  !product.category.toLowerCase().includes("banana") && 
                  !product.category.toLowerCase().includes("plátano") &&
                  !product.category.toLowerCase().includes("piña"));
              
              const matchesRegion = selectedRegion === "all" ||
                locationStr.includes(selectedRegion.toLowerCase());
              
              return matchesSearch && matchesCategory && matchesRegion;
            })
              .map((product) => (
              <Card
                key={product._id}
                className="rounded-2xl overflow-hidden border-2 border-[#d1e751]/30 hover:shadow-morpho transition-all cursor-pointer"
              >
                <div onClick={() => setSelectedProduct(product)}>
                <div className="relative h-48">
                  <ImageWithFallback
                    src={product.productImage || product.farmImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="success">
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {/* Product Name */}
                  <Heading level={3} className="line-clamp-1">{product.name}</Heading>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <Heading level={2} className="text-[#26ade4]">
                      {product.priceDisplay}
                    </Heading>
                    <Text variant="caption" className="text-[#000000]/60">
                      / {product.unit}
                    </Text>
                  </div>
                  
                  {/* Farm Info */}
                  <div className="pt-2 border-t border-[#d1e751]/30">
                    <Text variant="small" className="text-[#000000]/70">
                      <span className="font-semibold text-[#66b32e]">Finca:</span> {product.farmName}
                    </Text>
                    <Text variant="caption" className="text-[#000000]/60">
                      Por {product.farmerName} • {product.farmLocation}
                    </Text>
                  </div>
                  
                  {/* Description */}
                  {product.description && (
                    <Text variant="small" className="line-clamp-2 text-[#000000]/70">
                      {product.description}
                    </Text>
                  )}
                  
                  {/* Buy Button */}
                  <Button
                    title="Comprar"
                    icon={<ShoppingBag className="w-4 h-4" />}
                    iconPosition="left"
                    variant="blue"
                    className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-2"
                  />
                </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && (
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
              variant="blue"
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

        {/* Product Detail Modal */}
        <Modal
          isOpen={selectedProduct !== null}
          onClose={() => {
            setSelectedProduct(null);
            setProductQuantity(1);
          }}
          title={selectedProduct?.name}
        >
          {selectedProduct && (
            <>
              <div className="space-y-6">
                {/* Product Image */}
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={selectedProduct.productImage || selectedProduct.farmImage}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Heading level={2} className="text-[#26ade4] mb-1">
                        {selectedProduct.priceDisplay}
                      </Heading>
                      <Text variant="caption" className="text-[#000000]/60">
                        por {selectedProduct.unit}
                      </Text>
                    </div>
                    <Badge variant="success">
                      Stock: {selectedProduct.stock}
                    </Badge>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <Heading level={4} className="mb-2">Descripción</Heading>
                      <Text>{selectedProduct.description}</Text>
                    </div>
                  )}

                  {/* Farm Info */}
                  <div className="p-4 rounded-lg bg-[#d1e751]/10 border border-[#d1e751]/30">
                    <Text variant="caption" className="font-semibold text-[#66b32e] mb-2 block">
                      Información de la Finca
                    </Text>
                    <Text variant="small">
                      <span className="font-semibold">Finca:</span> {selectedProduct.farmName}
                    </Text>
                    <Text variant="small">
                      <span className="font-semibold">Agricultor:</span> {selectedProduct.farmerName}
                    </Text>
                    <Text variant="small">
                      <span className="font-semibold">Ubicación:</span> {selectedProduct.farmLocation}
                    </Text>
                  </div>
                </div>

                <Separator />

                {/* Purchase Form */}
                <div className="p-6 rounded-xl bg-[#26ade4]/5 border-2 border-[#26ade4]/30 space-y-4">
                  <Heading level={3}>Comprar Producto</Heading>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Text variant="caption" className="mb-2 block">Cantidad</Text>
                      <Input
                        type="number"
                        placeholder="1"
                        min="1"
                        max={selectedProduct.stock}
                        className="w-full"
                        value={productQuantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          const maxValue = Math.min(isNaN(value) ? 1 : value, selectedProduct.stock);
                          setProductQuantity(Math.max(1, maxValue));
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Text variant="caption" className="mb-2 block">Unidad</Text>
                      <Text className="font-semibold">{selectedProduct.unit}</Text>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-[#26ade4]/30 space-y-2">
                    <div className="flex justify-between">
                      <Text>Subtotal</Text>
                      <Text className="font-semibold">
                        ${(productQuantity * selectedProduct.price).toFixed(2)}
                      </Text>
                    </div>
                    <div className="flex justify-between text-[#66b32e]">
                      <Text variant="small">Recompensa Regenerativa (5%)</Text>
                      <Text variant="small" className="font-semibold">
                        +${((productQuantity * selectedProduct.price) * 0.05).toFixed(2)}
                      </Text>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <Heading level={4}>Total</Heading>
                      <Heading level={3} className="text-[#26ade4]">
                        ${((productQuantity * selectedProduct.price) * 1.05).toFixed(2)}
                      </Heading>
                    </div>
                  </div>

                  <Button
                    title="Confirmar Compra"
                    icon={<ShoppingBag className="w-5 h-5" />}
                    iconPosition="left"
                    onClick={handleBuyProduct}
                    variant="blue"
                    className="w-full bg-[#d1e751] hover:bg-[#d1e751]/90 text-black rounded-xl py-6"
                  />
                </div>
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
              setSelectedProduct(null);
            }}
            receiptData={receiptData}
          />
        )}
      </div>
    </div>
  );
}
