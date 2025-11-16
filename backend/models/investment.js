import mongoose, { Schema } from 'mongoose';

const investmentSchema = new Schema({
    // Referencias
    investor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investorWallet: { type: String, required: true, lowercase: true },
    
    farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: false }, // Optional: null for regenerative tokens
    farmTokenId: { type: String }, // Token ID del NFT de la finca
    
    // Detalles de la inversión
    amount: { type: Number, required: true, min: 0 }, // Monto en USD
    amountInTokens: { type: Number, required: true, min: 0 }, // Monto en MorphoCoin
    percentage: { type: Number, min: 0, max: 100 }, // Porcentaje de participación en la finca
    
    // Blockchain reference - IMPORTANTE para Backend 3.0
    transactionHash: { type: String, unique: true, sparse: true }, // Hash de la transacción en blockchain
    blockNumber: { type: Number },
    contractAddress: { type: String },
    
    // Estado de la inversión
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'failed'],
        default: 'pending'
    },
    
    // Fechas importantes
    investmentDate: { type: Date, required: true, default: Date.now },
    startDate: { type: Date }, // Fecha de inicio del período de inversión
    maturityDate: { type: Date }, // Fecha de vencimiento/madurez
    
    // Rendimientos
    expectedReturn: { type: Number, default: 0 }, // Retorno esperado en USD
    currentReturn: { type: Number, default: 0 }, // Retorno actual en USD
    returnPercentage: { type: Number, default: 0 }, // ROI en porcentaje
    
    // Distribuciones/pagos recibidos
    distributions: [{
        date: { type: Date },
        amount: { type: Number },
        type: { type: String, enum: ['dividend', 'harvest', 'sale', 'other'] },
        transactionHash: { type: String },
        notes: { type: String }
    }],
    
    totalDistributed: { type: Number, default: 0 }, // Total de distribuciones recibidas
    
    // Información del contrato/acuerdo
    terms: {
        duration: { type: Number }, // Duración en meses
        roi: { type: Number }, // ROI acordado en porcentaje
        paymentFrequency: { type: String, enum: ['monthly', 'quarterly', 'annually', 'at-maturity'] },
        earlyWithdrawalPenalty: { type: Number, default: 0 } // Penalidad por retiro anticipado
    },
    
    // Documentos del acuerdo
    documents: [{
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Métricas de impacto relacionadas con esta inversión
    impactContribution: {
        co2Reduced: { type: Number, default: 0 },
        waterSaved: { type: Number, default: 0 },
        treesPlanted: { type: Number, default: 0 }
    },
    
    // Notas y comunicación
    notes: { type: String, maxlength: 1000 },
    
    // Metadata
    isAutoRenew: { type: Boolean, default: false }, // Renovación automática
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Índices
investmentSchema.index({ investor: 1 });
investmentSchema.index({ investorWallet: 1 });
investmentSchema.index({ farm: 1 });
investmentSchema.index({ farmTokenId: 1 });
investmentSchema.index({ transactionHash: 1 });
investmentSchema.index({ status: 1 });
investmentSchema.index({ investmentDate: -1 });

// Método virtual para calcular el performance actual
investmentSchema.virtual('performance').get(function() {
    if (this.amount === 0) return 0;
    return ((this.currentReturn - this.amount) / this.amount) * 100;
});

// Método para agregar una distribución
investmentSchema.methods.addDistribution = function(distribution) {
    this.distributions.push(distribution);
    this.totalDistributed += distribution.amount;
    this.currentReturn += distribution.amount;
    return this.save();
};

// Método para actualizar el estado
investmentSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    return this.save();
};

export const Investment = mongoose.model('Investment', investmentSchema);
