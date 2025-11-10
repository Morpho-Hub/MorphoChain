import mongoose, { Schema } from 'mongoose';

const impactMetricsSchema = new Schema({
    // Referencia a la entidad (puede ser User, Farm, Investment, o global)
    entityType: { 
        type: String, 
        required: true,
        enum: ['user', 'farm', 'investment', 'product', 'platform']
    },
    entityId: { type: Schema.Types.ObjectId, refPath: 'entityType' },
    
    // Si es de un usuario
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userWallet: { type: String, lowercase: true },
    
    // Si es de una finca
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
    farmTokenId: { type: String },
    
    // Período de medición
    period: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        type: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'lifetime'], default: 'lifetime' }
    },
    
    // MÉTRICAS AMBIENTALES
    environmental: {
        // Carbono
        co2Reduced: { type: Number, default: 0 }, // kg de CO2 reducido
        co2Offset: { type: Number, default: 0 }, // kg de CO2 compensado
        carbonFootprint: { type: Number, default: 0 }, // Huella de carbono total
        
        // Agua
        waterSaved: { type: Number, default: 0 }, // Litros de agua ahorrados
        waterUsageReduction: { type: Number, default: 0 }, // % de reducción
        
        // Biodiversidad
        treesPlanted: { type: Number, default: 0 },
        nativeSpeciesProtected: { type: Number, default: 0 },
        biodiversityScore: { type: Number, min: 0, max: 100 },
        
        // Suelo
        soilHealthScore: { type: Number, min: 0, max: 100 },
        organicMatterIncrease: { type: Number }, // % de aumento
        
        // Energía
        renewableEnergyUsed: { type: Number, default: 0 }, // kWh
        energyEfficiency: { type: Number, min: 0, max: 100 },
        
        // Residuos
        wasteReduced: { type: Number, default: 0 }, // kg
        recyclingRate: { type: Number, min: 0, max: 100 }, // %
        composting: { type: Number, default: 0 }, // kg compostados
        
        // Pesticidas y químicos
        pesticidesReduced: { type: Number, default: 0 }, // kg
        organicPractices: { type: Boolean, default: false },
        chemicalFreeArea: { type: Number, default: 0 } // hectáreas
    },
    
    // MÉTRICAS SOCIALES
    social: {
        // Empleo
        jobsCreated: { type: Number, default: 0 },
        fullTimeJobs: { type: Number, default: 0 },
        seasonalJobs: { type: Number, default: 0 },
        womenEmployed: { type: Number, default: 0 },
        youthEmployed: { type: Number, default: 0 },
        
        // Familias y comunidad
        familiesSupported: { type: Number, default: 0 },
        communityMembers: { type: Number, default: 0 },
        
        // Educación
        trainingSessions: { type: Number, default: 0 },
        peopleEducated: { type: Number, default: 0 },
        
        // Salud
        healthProgramsBeneficiaries: { type: Number, default: 0 },
        
        // Inversión comunitaria
        communityInvestment: { type: Number, default: 0 }, // USD invertidos en comunidad
        infrastructureProjects: { type: Number, default: 0 },
        
        // Equidad
        fairTradeCertified: { type: Boolean, default: false },
        fairWages: { type: Boolean, default: false },
        genderEquality: { type: Number, min: 0, max: 100 } // Score
    },
    
    // MÉTRICAS ECONÓMICAS
    economic: {
        // Inversión y retornos
        totalInvestment: { type: Number, default: 0 }, // USD
        revenueGenerated: { type: Number, default: 0 }, // USD
        profitMargin: { type: Number, default: 0 }, // %
        roi: { type: Number, default: 0 }, // %
        
        // Distribución
        dividendsPaid: { type: Number, default: 0 }, // USD
        farmersIncome: { type: Number, default: 0 }, // USD
        
        // Producción
        productionVolume: { type: Number, default: 0 }, // kg o toneladas
        productsSold: { type: Number, default: 0 },
        marketValue: { type: Number, default: 0 }, // USD
        
        // Eficiencia
        costPerUnit: { type: Number, default: 0 },
        yieldPerHectare: { type: Number, default: 0 }
    },
    
    // CERTIFICACIONES Y RECONOCIMIENTOS
    certifications: [{
        name: { type: String },
        issuer: { type: String },
        category: { type: String, enum: ['organic', 'fair-trade', 'sustainability', 'carbon', 'other'] },
        date: { type: Date },
        expiryDate: { type: Date },
        score: { type: Number }
    }],
    
    // OBJETIVOS DE DESARROLLO SOSTENIBLE (ODS/SDG)
    sdgs: [{
        goal: { type: Number, min: 1, max: 17 }, // SDG 1-17
        description: { type: String },
        contribution: { type: Number, min: 0, max: 100 }, // % de contribución
        targets: [{ type: String }] // Targets específicos del SDG
    }],
    
    // COMPARATIVAS Y BENCHMARKS
    benchmarks: {
        industryAverage: { type: Number },
        percentileRank: { type: Number, min: 0, max: 100 },
        improvementRate: { type: Number } // % de mejora vs período anterior
    },
    
    // SCORE GENERAL DE IMPACTO
    overallImpactScore: { type: Number, min: 0, max: 100, default: 0 },
    
    // VERIFICACIÓN
    verification: {
        isVerified: { type: Boolean, default: false },
        verifiedBy: { type: String },
        verificationDate: { type: Date },
        verificationMethod: { type: String },
        documents: [{
            name: { type: String },
            url: { type: String }
        }]
    },
    
    // NOTAS Y OBSERVACIONES
    notes: { type: String, maxlength: 2000 },
    achievements: [{ type: String }],
    challenges: [{ type: String }],
    
    // VISIBILIDAD
    isPublic: { type: Boolean, default: true },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Índices
impactMetricsSchema.index({ entityType: 1, entityId: 1 });
impactMetricsSchema.index({ user: 1 });
impactMetricsSchema.index({ farm: 1 });
impactMetricsSchema.index({ userWallet: 1 });
impactMetricsSchema.index({ farmTokenId: 1 });
impactMetricsSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
impactMetricsSchema.index({ overallImpactScore: -1 });

// Método para calcular el score general de impacto
impactMetricsSchema.methods.calculateOverallScore = function() {
    // Peso: 40% ambiental, 30% social, 30% económico
    const envScore = this._calculateEnvironmentalScore();
    const socialScore = this._calculateSocialScore();
    const economicScore = this._calculateEconomicScore();
    
    this.overallImpactScore = (envScore * 0.4) + (socialScore * 0.3) + (economicScore * 0.3);
    return this.overallImpactScore;
};

// Métodos privados para calcular scores individuales
impactMetricsSchema.methods._calculateEnvironmentalScore = function() {
    const env = this.environmental;
    let score = 0;
    let factors = 0;
    
    if (env.biodiversityScore) { score += env.biodiversityScore; factors++; }
    if (env.soilHealthScore) { score += env.soilHealthScore; factors++; }
    if (env.energyEfficiency) { score += env.energyEfficiency; factors++; }
    if (env.organicPractices) { score += 100; factors++; }
    
    return factors > 0 ? score / factors : 0;
};

impactMetricsSchema.methods._calculateSocialScore = function() {
    const social = this.social;
    let score = 0;
    
    if (social.jobsCreated > 0) score += 20;
    if (social.familiesSupported > 0) score += 20;
    if (social.trainingSessions > 0) score += 15;
    if (social.fairTradeCertified) score += 25;
    if (social.genderEquality) score += social.genderEquality * 0.2;
    
    return Math.min(score, 100);
};

impactMetricsSchema.methods._calculateEconomicScore = function() {
    const econ = this.economic;
    let score = 0;
    
    if (econ.roi > 0) score += Math.min(econ.roi * 2, 40);
    if (econ.profitMargin > 0) score += Math.min(econ.profitMargin * 2, 30);
    if (econ.revenueGenerated > 0) score += 30;
    
    return Math.min(score, 100);
};

// Método estático para agregar métricas de múltiples entidades
impactMetricsSchema.statics.aggregateMetrics = async function(entityIds, entityType) {
    return this.aggregate([
        { $match: { entityId: { $in: entityIds }, entityType } },
        {
            $group: {
                _id: null,
                totalCO2Reduced: { $sum: '$environmental.co2Reduced' },
                totalWaterSaved: { $sum: '$environmental.waterSaved' },
                totalTreesPlanted: { $sum: '$environmental.treesPlanted' },
                totalJobsCreated: { $sum: '$social.jobsCreated' },
                totalFamiliesSupported: { $sum: '$social.familiesSupported' },
                totalInvestment: { $sum: '$economic.totalInvestment' },
                avgImpactScore: { $avg: '$overallImpactScore' }
            }
        }
    ]);
};

export const ImpactMetrics = mongoose.model('ImpactMetrics', impactMetricsSchema);
