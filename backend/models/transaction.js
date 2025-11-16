import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
    // Referencias de usuarios
    from: { type: Schema.Types.ObjectId, ref: 'User' }, // Quien envía/paga
    fromWallet: { type: String, lowercase: true },
    
    to: { type: Schema.Types.ObjectId, ref: 'User' }, // Quien recibe
    toWallet: { type: String, lowercase: true },
    
    // Tipo de transacción
    type: {
        type: String,
        required: true,
        enum: [
            'investment',             // Inversión en una finca
            'product-purchase',       // Compra de producto
            'token-transfer',         // Transferencia de tokens
            'dividend',               // Pago de dividendos
            'harvest-sale',           // Venta de cosecha
            'withdrawal',             // Retiro de fondos
            'deposit',                // Depósito de fondos
            'refund',                 // Reembolso
            'fee',                    // Comisión/tarifa
            'regenerative_purchase',  // Compra de tokens regenerativos corporativos
            'other'
        ]
    },
    
    // Montos
    amount: { type: Number, required: true, min: 0 }, // Monto en USD
    amountInTokens: { type: Number, min: 0 }, // Monto en MorphoCoin
    currency: { type: String, default: 'USD' },
    
    fee: { type: Number, default: 0 }, // Comisión de la transacción
    netAmount: { type: Number }, // Monto neto después de fees
    
    // Blockchain reference - IMPORTANTE
    transactionHash: { type: String, unique: true, sparse: true }, // Hash de la tx en blockchain
    blockNumber: { type: Number },
    blockTimestamp: { type: Date },
    gasUsed: { type: Number },
    gasPrice: { type: Number },
    contractAddress: { type: String }, // Contrato que procesó la tx
    
    // Referencias a entidades relacionadas
    relatedFarm: { type: Schema.Types.ObjectId, ref: 'Farm' },
    relatedInvestment: { type: Schema.Types.ObjectId, ref: 'Investment' },
    relatedProduct: { type: Schema.Types.ObjectId, ref: 'Product' },
    
    farmTokenId: { type: String },
    productListingId: { type: String },
    
    // Estado de la transacción
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'confirmed', 'completed', 'failed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    
    // Detalles de error (si falla)
    errorMessage: { type: String },
    errorCode: { type: String },
    
    // Metadata adicional
    metadata: {
        description: { type: String },
        notes: { type: String },
        invoiceNumber: { type: String },
        orderId: { type: String },
        
        // Información de producto (si aplica)
        productName: { type: String },
        quantity: { type: Number },
        unitPrice: { type: Number },
        
        // Información de inversión (si aplica)
        farmName: { type: String },
        investmentPercentage: { type: Number },
        
        // Dirección de envío (si aplica)
        shippingAddress: {
            street: { type: String },
            city: { type: String },
            country: { type: String },
            postalCode: { type: String }
        }
    },
    
    // Seguimiento y confirmaciones
    confirmations: { type: Number, default: 0 }, // Confirmaciones de blockchain
    requiredConfirmations: { type: Number, default: 3 },
    
    // Fechas importantes
    initiatedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    completedAt: { type: Date },
    
    // Flags
    isRefundable: { type: Boolean, default: false },
    isReversible: { type: Boolean, default: false },
    
    // Información de pago (si es off-chain inicialmente)
    paymentMethod: { type: String, enum: ['crypto', 'card', 'bank', 'wallet', 'other'] },
    paymentProvider: { type: String }, // stripe, paypal, etc.
    externalTransactionId: { type: String }, // ID de proveedor externo
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Índices para optimización de consultas
transactionSchema.index({ from: 1, createdAt: -1 });
transactionSchema.index({ to: 1, createdAt: -1 });
transactionSchema.index({ fromWallet: 1 });
transactionSchema.index({ toWallet: 1 });
transactionSchema.index({ transactionHash: 1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ relatedFarm: 1 });
transactionSchema.index({ relatedInvestment: 1 });
transactionSchema.index({ relatedProduct: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });

// Middleware para calcular netAmount antes de guardar
transactionSchema.pre('save', function(next) {
    if (this.isModified('amount') || this.isModified('fee')) {
        this.netAmount = this.amount - this.fee;
    }
    next();
});

// Método para actualizar estado
transactionSchema.methods.updateStatus = function(newStatus, additionalData = {}) {
    this.status = newStatus;
    
    if (newStatus === 'completed') {
        this.completedAt = new Date();
    } else if (newStatus === 'processing') {
        this.processedAt = new Date();
    }
    
    Object.assign(this, additionalData);
    return this.save();
};

// Método para agregar confirmación de blockchain
transactionSchema.methods.addConfirmation = function() {
    this.confirmations += 1;
    
    if (this.confirmations >= this.requiredConfirmations && this.status === 'processing') {
        this.status = 'confirmed';
    }
    
    return this.save();
};

// Método estático para obtener transacciones de un usuario
transactionSchema.statics.findByUser = function(userId) {
    return this.find({
        $or: [
            { from: userId },
            { to: userId }
        ]
    }).sort({ createdAt: -1 });
};

// Método estático para obtener transacciones por wallet
transactionSchema.statics.findByWallet = function(walletAddress) {
    const wallet = walletAddress.toLowerCase();
    return this.find({
        $or: [
            { fromWallet: wallet },
            { toWallet: wallet }
        ]
    }).sort({ createdAt: -1 });
};

export const Transaction = mongoose.model('Transaction', transactionSchema);
