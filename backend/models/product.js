import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    // Referencias
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Agricultor que vende
    sellerWallet: { type: String, required: true, lowercase: true },
    
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' }, // Finca de origen (opcional)
    farmTokenId: { type: String }, // Token ID de la finca
    
    // Información básica del producto
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 2000 },
    shortDescription: { type: String, maxlength: 200 },
    
    // Categoría y tipo
    category: { 
        type: String, 
        required: true,
        enum: ['coffee', 'cacao', 'fruits', 'vegetables', 'grains', 'honey', 'other']
    },
    subcategory: { type: String },
    
    // Imágenes
    images: [{
        url: { type: String },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false }
    }],
    coverImage: { type: String },
    
    // Precios e inventario
    price: { type: Number, required: true, min: 0 }, // Precio en USD por unidad
    priceInTokens: { type: Number, min: 0 }, // Precio en MorphoCoin
    currency: { type: String, default: 'USD' },
    
    stock: { type: Number, required: true, min: 0, default: 0 }, // Cantidad disponible
    unit: { type: String, required: true, default: 'kg' }, // kg, lb, unidad, caja, etc.
    minOrder: { type: Number, default: 1 }, // Orden mínima
    maxOrder: { type: Number }, // Orden máxima (opcional)
    
    // Blockchain reference - Para marketplace MorphoMarketplace
    listingId: { type: String, unique: true, sparse: true }, // ID del listing en el contrato
    contractAddress: { type: String }, // Dirección del contrato marketplace
    isListed: { type: Boolean, default: false }, // Si está listado en blockchain
    listedAt: { type: Date },
    
    // Detalles del producto
    weight: { type: Number }, // Peso del producto
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        unit: { type: String, default: 'cm' }
    },
    
    // Calidad y certificaciones
    quality: { type: String, enum: ['premium', 'standard', 'basic'] },
    certifications: [{
        name: { type: String },
        issuer: { type: String },
        url: { type: String }
    }],
    isOrganic: { type: Boolean, default: false },
    isFairTrade: { type: Boolean, default: false },
    
    // Información de origen
    origin: {
        country: { type: String },
        region: { type: String },
        harvestDate: { type: Date },
        harvestSeason: { type: String }
    },
    
    // Estado del producto
    status: {
        type: String,
        enum: ['draft', 'active', 'out-of-stock', 'discontinued', 'pending'],
        default: 'draft'
    },
    
    // Información de envío
    shipping: {
        available: { type: Boolean, default: true },
        freeShipping: { type: Boolean, default: false },
        estimatedDays: { type: Number }, // Días estimados de entrega
        shippingCost: { type: Number, default: 0 }
    },
    
    // Estadísticas
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    soldQuantity: { type: Number, default: 0 }, // Cantidad vendida total
    revenue: { type: Number, default: 0 }, // Ingresos totales generados
    
    // Reseñas (referencia básica, luego se puede expandir)
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    
    // Ofertas y promociones
    isOnSale: { type: Boolean, default: false },
    salePrice: { type: Number, min: 0 },
    saleEndDate: { type: Date },
    
    // Featured
    isFeatured: { type: Boolean, default: false },
    
    // Métricas de impacto del producto
    impactMetrics: {
        carbonFootprint: { type: Number }, // kg de CO2
        waterUsage: { type: Number }, // Litros
        isLocallySourced: { type: Boolean, default: false }
    },
    
    // Metadata
    tags: [{ type: String }], // Para búsquedas
    sku: { type: String, unique: true, sparse: true }, // Stock Keeping Unit
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Índices
productSchema.index({ seller: 1 });
productSchema.index({ sellerWallet: 1 });
productSchema.index({ farm: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ listingId: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Text search

// Método virtual para precio efectivo (considera sale price)
productSchema.virtual('effectivePrice').get(function() {
    if (this.isOnSale && this.salePrice) {
        return this.salePrice;
    }
    return this.price;
});

// Método para reducir stock después de una venta
productSchema.methods.reduceStock = function(quantity) {
    if (this.stock < quantity) {
        throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
    this.soldQuantity += quantity;
    
    if (this.stock === 0) {
        this.status = 'out-of-stock';
    }
    
    return this.save();
};

// Método para incrementar vistas
productSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Método para actualizar rating
productSchema.methods.updateRating = function(newRating) {
    const totalRating = this.averageRating * this.reviewCount;
    this.reviewCount += 1;
    this.averageRating = (totalRating + newRating) / this.reviewCount;
    return this.save();
};

export const Product = mongoose.model('Product', productSchema);
