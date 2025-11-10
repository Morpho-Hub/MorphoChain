import mongoose, { Schema } from 'mongoose';

const farmSchema = new Schema({
    // Referencia al dueño (agricultor)
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ownerWallet: { type: String, required: true, lowercase: true },
    
    // Información básica de la finca
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 2000 },
    shortDescription: { type: String, maxlength: 200 },
    
    // Ubicación
    location: {
        country: { type: String, required: true },
        region: { type: String },
        city: { type: String },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        },
        address: { type: String }
    },
    
    // Detalles de la plantación
    landSize: { type: Number, required: true }, // Hectáreas
    cropType: { type: String, required: true }, // Tipo de cultivo: café, cacao, frutas, etc.
    plantingDate: { type: Date },
    harvestDate: { type: Date },
    
    // Imágenes y multimedia
    images: [{
        url: { type: String },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false }
    }],
    coverImage: { type: String }, // Imagen principal
    
    // Blockchain reference - IMPORTANTE para conexión con Backend 3.0
    tokenId: { type: String, unique: true, sparse: true }, // NFT Token ID del contrato PlantationManager
    contractAddress: { type: String }, // Dirección del contrato (PlantationManager)
    mintedAt: { type: Date }, // Fecha de creación del NFT
    
    // Información de inversión
    investmentGoal: { type: Number, required: true }, // Meta de inversión en USD
    currentInvestment: { type: Number, default: 0 }, // Inversión actual en USD
    minInvestment: { type: Number, default: 100 }, // Inversión mínima por inversor
    expectedROI: { type: Number }, // ROI esperado en porcentaje
    investmentDuration: { type: Number }, // Duración en meses
    
    // Estado de la finca
    status: { 
        type: String, 
        enum: ['draft', 'pending', 'active', 'funded', 'completed', 'cancelled'],
        default: 'draft'
    },
    
    // Certificaciones y sostenibilidad
    certifications: [{
        name: { type: String },
        issuer: { type: String },
        date: { type: Date },
        url: { type: String }
    }],
    
    // Métricas de impacto ambiental
    impactMetrics: {
        co2Reduction: { type: Number, default: 0 }, // kg de CO2 al año
        waterUsageReduction: { type: Number, default: 0 }, // % de reducción
        biodiversityScore: { type: Number, min: 0, max: 100 },
        organicPractices: { type: Boolean, default: false },
        treesPlanted: { type: Number, default: 0 }
    },
    
    // Métricas sociales
    socialImpact: {
        jobsCreated: { type: Number, default: 0 },
        familiesSupported: { type: Number, default: 0 },
        communityInvestment: { type: Number, default: 0 } // En USD
    },
    
    // Documentación
    documents: [{
        name: { type: String },
        type: { type: String }, // pdf, image, etc.
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Inversores (referencia)
    investorsCount: { type: Number, default: 0 },
    
    // Rendimiento y cosechas
    harvests: [{
        date: { type: Date },
        quantity: { type: Number }, // kg o toneladas
        quality: { type: String },
        revenue: { type: Number }, // Ingresos en USD
        notes: { type: String }
    }],
    
    // Featured/destacado en homepage
    isFeatured: { type: Boolean, default: false },
    featuredUntil: { type: Date },
    
    // Estadísticas
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Índices para optimización
farmSchema.index({ owner: 1 });
farmSchema.index({ ownerWallet: 1 });
farmSchema.index({ tokenId: 1 });
farmSchema.index({ status: 1 });
farmSchema.index({ cropType: 1 });
farmSchema.index({ 'location.country': 1 });

// Método virtual para calcular el progreso de inversión
farmSchema.virtual('investmentProgress').get(function() {
    if (this.investmentGoal === 0) return 0;
    return (this.currentInvestment / this.investmentGoal) * 100;
});

// Método para incrementar vistas
farmSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

export const Farm = mongoose.model('Farm', farmSchema);
