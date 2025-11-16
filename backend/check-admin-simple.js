import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';

dotenv.config();
const MorphoCoinABI = JSON.parse(readFileSync('./contracts/abis/MorphoCoin.json', 'utf-8'));

async function checkAdmin() {
  try {
    console.log('🔍 Verificando roles del contrato MorphoCoin...\n');
    
    const provider = new ethers.providers.JsonRpcProvider('https://11155111.rpc.thirdweb.com');
    const contractAddress = process.env.MORPHOCOIN_ADDRESS;
    const contract = new ethers.Contract(contractAddress, MorphoCoinABI, provider);
    
    const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const MINTER_ROLE = ethers.utils.id('MINTER_ROLE');
    
    console.log('📋 Contrato:', contractAddress);
    console.log('🔑 MINTER_ROLE:', MINTER_ROLE);
    console.log('\n--- Verificando wallets conocidas ---\n');
    
    // Lista de wallets para verificar
    const walletsToCheck = [
      { name: 'Backend wallet (actual)', address: '0x3f97287474486B8faBDa437f9B8b1e601EeCdb56' },
      { name: 'PlantationManager (del screenshot)', address: '0xef67f46539f4e5d6991cab46153a109c00c3ba00' },
      { name: 'Admin wallet (del screenshot)', address: '0x283aF0B28c62C092C9727F1Ee09c02CA97Cdef42' },
      { name: 'Tu wallet usuario', address: '0xD823f20E8053ead7ae65538ff73e23438F524E2E' },
    ];
    
    for (const wallet of walletsToCheck) {
      console.log(`\n🔍 ${wallet.name}`);
      console.log(`   📍 ${wallet.address}`);
      
      try {
        const hasAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, wallet.address);
        const hasMinter = await contract.hasRole(MINTER_ROLE, wallet.address);
        
        console.log(`   ${hasAdmin ? '✅' : '❌'} ADMIN`);
        console.log(`   ${hasMinter ? '✅' : '❌'} MINTER`);
        
        if (hasAdmin || hasMinter) {
          console.log('   ⭐ ESTA WALLET TIENE PERMISOS!');
        }
      } catch (err) {
        console.log('   ⚠️  Error verificando:', err.message);
      }
    }
    
    // Intentar obtener el owner si existe
    try {
      console.log('\n--- Verificando owner del contrato ---\n');
      const owner = await contract.owner();
      console.log('👤 Owner:', owner);
      
      const ownerHasAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, owner);
      const ownerHasMinter = await contract.hasRole(MINTER_ROLE, owner);
      console.log(`   ${ownerHasAdmin ? '✅' : '❌'} ADMIN`);
      console.log(`   ${ownerHasMinter ? '✅' : '❌'} MINTER`);
    } catch (err) {
      console.log('⚠️  No se pudo obtener owner:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAdmin();
