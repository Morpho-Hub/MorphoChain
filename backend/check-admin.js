import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';

dotenv.config();
const MorphoCoinABI = JSON.parse(readFileSync('./contracts/abis/MorphoCoin.json', 'utf-8'));

async function checkAdmin() {
  try {
    console.log('🔍 Verificando admin del contrato MorphoCoin...\n');
    
    // Conectar al provider
    const provider = new ethers.providers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/YOUR_INFURA_KEY` // Thirdweb usa su propio RPC
    );
    
    // O mejor, usar el RPC de Thirdweb
    const thirdwebProvider = new ethers.providers.JsonRpcProvider(
      'https://11155111.rpc.thirdweb.com'
    );
    
    const contractAddress = process.env.MORPHOCOIN_ADDRESS;
    const contract = new ethers.Contract(contractAddress, MorphoCoinABI, thirdwebProvider);
    
    // DEFAULT_ADMIN_ROLE es bytes32(0)
    const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const MINTER_ROLE = ethers.utils.id('MINTER_ROLE');
    
    console.log('📋 Contrato:', contractAddress);
    console.log('🔑 DEFAULT_ADMIN_ROLE:', DEFAULT_ADMIN_ROLE);
    console.log('🔑 MINTER_ROLE:', MINTER_ROLE);
    console.log('\n--- Buscando admins ---\n');
    
    // Obtener eventos de RoleGranted desde el deploy
    const filter = contract.filters.RoleGranted();
    const events = await contract.queryFilter(filter, 0, 'latest');
    
    console.log(`📜 Encontrados ${events.length} eventos de RoleGranted\n`);
    
    const admins = new Set();
    const minters = new Set();
    
    for (const event of events) {
      const role = event.args.role;
      const account = event.args.account;
      const sender = event.args.sender;
      
      if (role === DEFAULT_ADMIN_ROLE) {
        admins.add(account);
        console.log('👑 ADMIN encontrado:', account);
        console.log('   Otorgado por:', sender);
        console.log('   Block:', event.blockNumber);
        console.log('   Tx:', event.transactionHash, '\n');
      }
      
      if (role === MINTER_ROLE) {
        minters.add(account);
        console.log('🪙 MINTER encontrado:', account);
        console.log('   Otorgado por:', sender);
        console.log('   Block:', event.blockNumber);
        console.log('   Tx:', event.transactionHash, '\n');
      }
    }
    
    // Verificar roles actuales
    console.log('\n--- Roles actuales ---\n');
    
    for (const admin of admins) {
      const hasRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, admin);
      console.log(`👑 ${admin}: ${hasRole ? '✅ Tiene ADMIN' : '❌ Ya no tiene ADMIN'}`);
    }
    
    for (const minter of minters) {
      const hasRole = await contract.hasRole(MINTER_ROLE, minter);
      console.log(`🪙 ${minter}: ${hasRole ? '✅ Tiene MINTER' : '❌ Ya no tiene MINTER'}`);
    }
    
    // Verificar tu wallet actual
    const backendWallet = '0x3f97287474486B8faBDa437f9B8b1e601EeCdb56';
    console.log('\n--- Tu wallet de backend ---');
    console.log('📍 Address:', backendWallet);
    const hasAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, backendWallet);
    const hasMinter = await contract.hasRole(MINTER_ROLE, backendWallet);
    console.log('👑 ADMIN:', hasAdmin ? '✅ SÍ' : '❌ NO');
    console.log('🪙 MINTER:', hasMinter ? '✅ SÍ' : '❌ NO');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.reason) console.error('Razón:', error.reason);
  }
}

checkAdmin();
