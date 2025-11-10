import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    // Información básica
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    walletAddress: { type: String, required: true, unique: true, lowercase: true },
    profilePicture: { type: String, default: '' },
    
    // Verificación de email
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    verificationExpiry: { type: Date },
    
    // Roles: user (default), farmer (agricultor), investor (inversor), admin
    role: { type: String, enum: ['user', 'farmer', 'investor', 'admin'], default: 'user' },
    
    // Información de perfil extendida
    bio: { type: String, maxlength: 500 },
    phone: { type: String },
    country: { type: String },
    language: { type: String, default: 'es' },
    
    // Datos específicos para FARMER
    farmerData: {
        farmCount: { type: Number, default: 0 }, // Número de fincas que tiene
        totalLandSize: { type: Number, default: 0 }, // Hectáreas totales
        certifications: [{ type: String }], // Certificaciones orgánicas, etc.
        specialties: [{ type: String }], // Café, cacao, frutas, etc.
        experience: { type: Number }, // Años de experiencia
    },
    
    // Datos específicos para INVESTOR
    investorData: {
        totalInvested: { type: Number, default: 0 }, // Total invertido en USD
        activeInvestments: { type: Number, default: 0 }, // Número de inversiones activas
        portfolioValue: { type: Number, default: 0 }, // Valor actual del portfolio
        riskProfile: { type: String, enum: ['conservative', 'moderate', 'aggressive'], default: 'moderate' },
        interests: [{ type: String }], // Intereses: sostenibilidad, ROI, impacto social, etc.
    },
    
    // Balance de tokens (sincronizado con blockchain)
    tokenBalance: { type: Number, default: 0 }, // Balance de MorphoCoin
    
    // Métricas de impacto personal
    impactMetrics: {
        co2Reduced: { type: Number, default: 0 }, // kg de CO2 reducido
        waterSaved: { type: Number, default: 0 }, // Litros de agua ahorrados
        treesPlanted: { type: Number, default: 0 }, // Árboles plantados
        familiesSupported: { type: Number, default: 0 }, // Familias apoyadas
    },
    
    // Preferencias y notificaciones
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false },
        currency: { type: String, default: 'USD' },
    },
    
    // Estado de la cuenta
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    
    // Timestamps
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true // Automáticamente maneja createdAt y updatedAt
});

// Índices para búsquedas optimizadas
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1 });

// Método virtual para obtener el nombre completo
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Método para actualizar el último login
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

export const User = mongoose.model('User', userSchema);

