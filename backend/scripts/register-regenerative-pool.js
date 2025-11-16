import plantationService from '../services/plantationService.js';

/**
 * Script para registrar la plantación REGENERATIVE_POOL
 * Esta plantación se usa para mintear tokens cuando se compran tokens regenerativos corporativos
 */

async function registerRegenerativePool() {
  try {
    console.log('🌱 Registrando plantación REGENERATIVE_POOL...');

    const POOL_ID = 'REGENERATIVE_POOL';
    const TREASURY_WALLET = process.env.TREASURY_WALLET || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';

    // Check if already registered
    const existing = await plantationService.getPlantationById(POOL_ID);
    
    if (existing.success && existing.data) {
      console.log('✅ REGENERATIVE_POOL ya está registrada');
      console.log('Datos:', existing.data);
      return;
    }

    // Register new plantation
    console.log(`📝 Registrando nueva plantación con wallet: ${TREASURY_WALLET}`);
    const result = await plantationService.registerPlantation(POOL_ID, TREASURY_WALLET);

    if (result.success) {
      console.log('✅ REGENERATIVE_POOL registrada exitosamente!');
      console.log('Transaction Hash:', result.transactionHash);
    } else {
      console.error('❌ Error al registrar:', result.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
registerRegenerativePool();
