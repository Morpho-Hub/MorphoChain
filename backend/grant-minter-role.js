import 'dotenv/config';
import blockchainService from './services/blockchainService.js';
import { ethers } from 'ethers';

/**
 * Script to grant MINTER_ROLE to the backend wallet
 * Run: node grant-minter-role.js
 */

async function grantMinterRole() {
  try {
    console.log('🔐 Iniciando proceso de otorgamiento de MINTER_ROLE...\n');

    // Initialize blockchain service
    await blockchainService.initialize();

    // Get backend wallet address
    const backendWallet = await blockchainService.getBackendWalletAddress();
    console.log(`✅ Backend wallet: ${backendWallet}\n`);

    // Get MorphoCoin contract
    const contract = blockchainService.getMorphoCoinContract();

    // MINTER_ROLE hash
    const MINTER_ROLE = ethers.utils.id('MINTER_ROLE');
    console.log(`🔑 MINTER_ROLE hash: ${MINTER_ROLE}\n`);

    // Check if already has role
    const hasRole = await contract.hasRole(MINTER_ROLE, backendWallet);
    
    if (hasRole) {
      console.log('✅ Esta wallet ya tiene MINTER_ROLE. No es necesario hacer nada.');
      process.exit(0);
    }

    console.log('⚠️  Esta wallet NO tiene MINTER_ROLE. Otorgando...\n');

    // Grant role
    const tx = await contract.grantRole(MINTER_ROLE, backendWallet);
    console.log(`📝 Transacción enviada: ${tx.hash}`);
    console.log('⏳ Esperando confirmación...\n');

    const receipt = await tx.wait();
    console.log(`✅ MINTER_ROLE otorgado exitosamente!`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas usado: ${receipt.gasUsed.toString()}\n`);

    // Verify
    const hasRoleNow = await contract.hasRole(MINTER_ROLE, backendWallet);
    console.log(`🔍 Verificación: ${hasRoleNow ? '✅ Tiene rol' : '❌ No tiene rol'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Ownable') || error.message.includes('admin')) {
      console.log('\n⚠️  La wallet del backend NO es admin del contrato.');
      console.log('   Necesitas ejecutar grantRole desde la wallet que deployó el contrato.');
      console.log('\n   Opciones:');
      console.log('   1. Usa Remix/Etherscan para llamar grantRole como admin');
      console.log('   2. O actualiza WALLET_PRIVATE_KEY en .env con la del admin');
    }
    
    process.exit(1);
  }
}

grantMinterRole();
