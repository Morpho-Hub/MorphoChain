// Temporary script to check products in database
import mongoose from 'mongoose';
import { Product } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const products = await Product.find().populate('farm', 'name status').lean();
    
    console.log('=== PRODUCTOS EN BASE DE DATOS ===');
    console.log(`Total productos: ${products.length}\n`);
    
    products.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.name}`);
      console.log(`   - Status: ${p.status}`);
      console.log(`   - Stock: ${p.stock}`);
      console.log(`   - Price: $${p.price}`);
      console.log(`   - Farm: ${p.farm?.name || 'N/A'} (status: ${p.farm?.status || 'N/A'})`);
      console.log(`   - Farm ID: ${p.farm?._id || 'N/A'}`);
      console.log('');
    });
    
    console.log('\n=== PRODUCTOS ACTIVOS CON STOCK ===');
    const activeProducts = products.filter(p => p.status === 'active' && p.stock > 0);
    console.log(`Total: ${activeProducts.length}`);
    activeProducts.forEach(p => {
      console.log(`- ${p.name} (${p.farm?.name}) - Stock: ${p.stock}`);
    });
    
    console.log('\n=== FINCAS CON PRODUCTOS ===');
    const farmIds = [...new Set(products.map(p => p.farm?._id?.toString()).filter(Boolean))];
    console.log(`Total fincas: ${farmIds.length}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
