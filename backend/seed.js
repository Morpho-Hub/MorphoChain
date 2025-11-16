import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Farm, Product, User } from './models/index.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/morphochain';

// Sample user data (farmer)
const sampleUser = {
  firstName: 'Juan',
  lastName: 'García',
  email: 'juan.garcia@morphochain.com',
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  role: 'farmer',
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
};

// Sample farms with Colombian regions (matching actual schema)
const sampleFarms = [
  {
    name: 'Finca El Cafetal',
    ownerWallet: '0x742d35cc6634c0532925a3b844bc9e7595f0beb1',
    cropType: 'café',
    landSize: 5.5,
    description: 'Finca cafetera regenerativa en el Eje Cafetero. Producción de café especial con prácticas sostenibles y certificación orgánica.',
    shortDescription: 'Café especial del Eje Cafetero con prácticas regenerativas',
    location: {
      address: 'Vereda La Aurora',
      city: 'Armenia',
      region: 'Quindío',
      country: 'Colombia',
      coordinates: { latitude: 4.5339, longitude: -75.6811 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', isPrimary: true }
    ],
    coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    investmentGoal: 50000,
    currentInvestment: 12500,
    minInvestment: 100,
    expectedROI: 18,
    investmentDuration: 24,
    status: 'active',
    impactMetrics: {
      co2Reduction: 5500,
      waterUsageReduction: 35,
      biodiversityScore: 87,
      organicPractices: true,
      treesPlanted: 250
    },
    socialImpact: {
      jobsCreated: 8,
      familiesSupported: 3,
      communityInvestment: 5000
    },
    investorsCount: 12
  },
  {
    name: 'Hacienda Cacao Verde',
    ownerWallet: '0x742d35cc6634c0532925a3b844bc9e7595f0beb1',
    cropType: 'cacao',
    landSize: 12.0,
    description: 'Producción de cacao fino de aroma bajo sistemas agroforestales. Certificación orgánica en proceso y enfoque en biodiversidad.',
    shortDescription: 'Cacao fino de aroma con sistemas agroforestales',
    location: {
      address: 'Km 15 Vía Buenaventura',
      city: 'Buenaventura',
      region: 'Valle del Cauca',
      country: 'Colombia',
      coordinates: { latitude: 3.8801, longitude: -77.0312 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', isPrimary: true }
    ],
    coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    investmentGoal: 80000,
    currentInvestment: 32000,
    minInvestment: 150,
    expectedROI: 22,
    investmentDuration: 36,
    status: 'active',
    impactMetrics: {
      co2Reduction: 12000,
      waterUsageReduction: 28,
      biodiversityScore: 94,
      organicPractices: true,
      treesPlanted: 580
    },
    socialImpact: {
      jobsCreated: 15,
      familiesSupported: 6,
      communityInvestment: 12000
    },
    investorsCount: 25
  },
  {
    name: 'Platanera Río Verde',
    ownerWallet: '0x742d35cc6634c0532925a3b844bc9e7595f0beb1',
    cropType: 'plátano',
    landSize: 8.3,
    description: 'Cultivo de plátano y banano con técnicas regenerativas. Enfoque en conservación de suelos y manejo integrado de plagas.',
    shortDescription: 'Plátano regenerativo con conservación de suelos',
    location: {
      address: 'Corregimiento Santa Lucía',
      city: 'Turbo',
      region: 'Antioquia',
      country: 'Colombia',
      coordinates: { latitude: 8.0925, longitude: -76.7293 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800', isPrimary: true }
    ],
    coverImage: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800',
    investmentGoal: 45000,
    currentInvestment: 18000,
    minInvestment: 80,
    expectedROI: 16,
    investmentDuration: 18,
    status: 'active',
    impactMetrics: {
      co2Reduction: 6200,
      waterUsageReduction: 42,
      biodiversityScore: 81,
      organicPractices: false,
      treesPlanted: 180
    },
    socialImpact: {
      jobsCreated: 12,
      familiesSupported: 5,
      communityInvestment: 7500
    },
    investorsCount: 18
  },
  {
    name: 'Finca Piña Tropical',
    ownerWallet: '0x742d35cc6634c0532925a3b844bc9e7595f0beb1',
    cropType: 'piña',
    landSize: 6.5,
    description: 'Cultivo de piña dorada con prácticas sostenibles. Implementación de riego eficiente, compostaje y control biológico de plagas.',
    shortDescription: 'Piña dorada con riego eficiente y compostaje',
    location: {
      address: 'Vereda El Carmen',
      city: 'Lebrija',
      region: 'Santander',
      country: 'Colombia',
      coordinates: { latitude: 7.1392, longitude: -73.1823 }
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800', isPrimary: true }
    ],
    coverImage: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800',
    investmentGoal: 35000,
    currentInvestment: 10500,
    minInvestment: 75,
    expectedROI: 19,
    investmentDuration: 20,
    status: 'active',
    impactMetrics: {
      co2Reduction: 4800,
      waterUsageReduction: 48,
      biodiversityScore: 80,
      organicPractices: true,
      treesPlanted: 145
    },
    socialImpact: {
      jobsCreated: 10,
      familiesSupported: 4,
      communityInvestment: 6000
    },
    investorsCount: 14
  }
];

// Sample products for each farm (matching Product schema)
const createProducts = (farmId, cropType, sellerId, sellerWallet) => {
  const cropToCategoryMap = {
    'café': 'coffee',
    'cacao': 'cacao',
    'plátano': 'fruits',
    'piña': 'fruits'
  };

  const productTemplates = {
    'café': {
      name: 'Café Especial Premium',
      description: 'Café de altura 100% arábica, tostado artesanal. Notas de chocolate y caramelo. Cultivado a 1800 metros de altura en el Eje Cafetero colombiano.',
      shortDescription: 'Café arábica premium con notas de chocolate',
      price: 35,
      priceInTokens: 350,
      unit: 'kg',
      stock: 250,
      images: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400', isPrimary: true }],
      coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
      quality: 'premium',
      isOrganic: true,
      isFairTrade: true
    },
    'cacao': {
      name: 'Cacao Fino de Aroma',
      description: 'Cacao orgánico certificado, ideal para chocolatería fina. Perfil floral y afrutado. Fermentado y secado siguiendo estándares internacionales.',
      shortDescription: 'Cacao orgánico con perfil floral',
      price: 28,
      priceInTokens: 280,
      unit: 'kg',
      stock: 180,
      images: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400', isPrimary: true }],
      coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
      quality: 'premium',
      isOrganic: true,
      isFairTrade: true
    },
    'plátano': {
      name: 'Plátano Hartón',
      description: 'Plátano verde de primera calidad, cultivado sin químicos sintéticos. Cosechado en punto óptimo de maduración para mayor durabilidad.',
      shortDescription: 'Plátano hartón de primera calidad',
      price: 2.5,
      priceInTokens: 25,
      unit: 'kg',
      stock: 500,
      images: [{ url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', isPrimary: true }],
      coverImage: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400',
      quality: 'standard',
      isOrganic: false,
      isFairTrade: false
    },
    'piña': {
      name: 'Piña Dorada Premium',
      description: 'Piña dulce y jugosa, cosechada en punto óptimo de maduración. Cultivada con riego eficiente y prácticas sostenibles.',
      shortDescription: 'Piña dorada dulce y jugosa',
      price: 4.5,
      priceInTokens: 45,
      unit: 'unidad',
      stock: 320,
      images: [{ url: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400', isPrimary: true }],
      coverImage: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400',
      quality: 'premium',
      isOrganic: true,
      isFairTrade: false
    }
  };

  const template = productTemplates[cropType] || productTemplates['café'];
  const category = cropToCategoryMap[cropType] || 'other';

  return {
    ...template,
    seller: sellerId,
    sellerWallet: sellerWallet.toLowerCase(),
    farm: farmId,
    status: 'active',
    category: category,
    subcategory: cropType,
    minOrder: 1,
    maxOrder: 100,
    origin: {
      country: 'Colombia',
      harvestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      harvestSeason: 'Cosecha Principal'
    },
    certifications: [
      { name: 'Orgánico', issuer: 'USDA Organic' },
      { name: 'Comercio Justo', issuer: 'Fair Trade International' }
    ]
  };
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Farm.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({ email: sampleUser.email })
    ]);

    // Create sample user
    console.log('👤 Creating sample user...');
    const user = await User.create(sampleUser);
    console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.walletAddress})`);

    // Create farms with owner reference
    console.log('🚜 Creating farms...');
    const farmsWithOwner = sampleFarms.map(farm => ({
      ...farm,
      owner: user._id,
      ownerWallet: user.walletAddress.toLowerCase()
    }));

    const createdFarms = await Farm.insertMany(farmsWithOwner);
    console.log(`✅ Created ${createdFarms.length} farms`);

    // Create products for each farm
    console.log('📦 Creating products...');
    const products = createdFarms.map(farm => 
      createProducts(farm._id, farm.cropType, user._id, user.walletAddress)
    );

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Display summary
    console.log('\n📊 Seed Summary:');
    console.log(`   Users: ${1}`);
    console.log(`   Farms: ${createdFarms.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Farms:');
    createdFarms.forEach((farm, i) => {
      console.log(`   ${i + 1}. ${farm.name} (${farm.cropType}) - ${farm.location.city}, ${farm.location.region}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
