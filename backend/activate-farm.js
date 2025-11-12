// Script to activate the farm
import mongoose from 'mongoose';
import { Farm } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function activateFarm() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find the farm with products
    const farmId = '6913d3fd6461a3c9abcd77bf';
    const farm = await Farm.findById(farmId);
    
    if (!farm) {
      console.log('❌ Farm not found');
      process.exit(1);
    }
    
    console.log(`Farm found: ${farm.name}`);
    console.log(`Current status: ${farm.status}`);
    
    // Update to active
    farm.status = 'active';
    await farm.save();
    
    console.log(`✅ Farm "${farm.name}" updated to status: active`);
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

activateFarm();
