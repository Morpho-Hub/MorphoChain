import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function diagnose() {
  console.log('🔍 Diagnóstico de contratos...\n');

  try {
    // Inicializar SDK
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.WALLET_PRIVATE_KEY,
      process.env.CHAIN_ID,
      { secretKey: process.env.THIRDWEB_SECRET_KEY }
    );

    const signer = sdk.getSigner();
    const walletAddress = await signer.getAddress();
    
    console.log('✅ Wallet conectada:', walletAddress);
    console.log('');

    // Verificar cada contrato
    const contracts = [
      { name: 'MorphoCoin', address: process.env.MORPHOCOIN_ADDRESS },
      { name: 'PlantationManager', address: process.env.PLANTATION_MANAGER_ADDRESS },
      { name: 'MorphoMarketplace', address: process.env.MORPHO_MARKETPLACE_ADDRESS }
    ];

    const provider = sdk.getProvider();

    for (const contract of contracts) {
      console.log(`📋 Probando ${contract.name} (${contract.address})...`);
      
      try {
        // Verificar que el contrato existe obteniendo el código
        const code = await provider.getCode(contract.address);
        
        if (code === '0x') {
          console.log(`   ❌ No hay código en esta dirección (contrato no desplegado)`);
          console.log('');
          continue;
        }
        
        console.log(`   ✅ Contrato encontrado (${code.length} bytes de bytecode)`);
        
        // ABI mínimo para pruebas
        const minimalABI = [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function getTotalPlantations() view returns (uint256)',
          'function getTotalListings() view returns (uint256)'
        ];
        
        const ethersContract = new ethers.Contract(contract.address, minimalABI, signer);
        
        // Intentar leer funciones básicas
        if (contract.name === 'MorphoCoin') {
          try {
            const name = await ethersContract.name();
            const symbol = await ethersContract.symbol();
            console.log(`   ✅ Name: ${name}`);
            console.log(`   ✅ Symbol: ${symbol}`);
          } catch (e) {
            console.log(`   ⚠️  No se pudieron leer name/symbol:`, e.reason || e.message);
          }
        }
        
        if (contract.name === 'PlantationManager') {
          try {
            const total = await ethersContract.getTotalPlantations();
            console.log(`   ✅ Total Plantations: ${total.toString()}`);
          } catch (e) {
            console.log(`   ⚠️  No se pudo leer getTotalPlantations:`, e.reason || e.message);
          }
        }
        
        if (contract.name === 'MorphoMarketplace') {
          try {
            const total = await ethersContract.getTotalListings();
            console.log(`   ✅ Total Listings: ${total.toString()}`);
          } catch (e) {
            console.log(`   ⚠️  No se pudo leer getTotalListings:`, e.reason || e.message);
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Error:`, error.message);
      }
      
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
}

diagnose();
