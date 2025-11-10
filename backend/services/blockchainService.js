import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load ABIs
const MorphoCoinABI = JSON.parse(readFileSync(join(__dirname, '../contracts/abis/MorphoCoin.json'), 'utf8'));
const PlantationManagerABI = JSON.parse(readFileSync(join(__dirname, '../contracts/abis/PlantationManager.json'), 'utf8'));
const MorphoMarketplaceABI = JSON.parse(readFileSync(join(__dirname, '../contracts/abis/MorphoMarketplace.json'), 'utf8'));

class BlockchainService {
  constructor() {
    this.sdk = null;
    this.contracts = {
      morphoCoin: null,
      plantationManager: null,
      morphoMarketplace: null,
    };
    this.isInitialized = false;
  }

  /**
   * Inicializa el SDK de Thirdweb y carga los contratos
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        return;
      }

      const {
        WALLET_PRIVATE_KEY,
        CHAIN_ID,
        MORPHOCOIN_ADDRESS,
        PLANTATION_MANAGER_ADDRESS,
        MORPHO_MARKETPLACE_ADDRESS,
      } = process.env;

      // Validar variables de entorno
      if (!WALLET_PRIVATE_KEY) {
        throw new Error('WALLET_PRIVATE_KEY no está configurada en .env');
      }

      if (!MORPHOCOIN_ADDRESS || !PLANTATION_MANAGER_ADDRESS || !MORPHO_MARKETPLACE_ADDRESS) {
        throw new Error('Las direcciones de los contratos no están configuradas en .env');
      }

      // Inicializar SDK de Thirdweb con Sepolia
      this.sdk = ThirdwebSDK.fromPrivateKey(
        WALLET_PRIVATE_KEY,
        CHAIN_ID || '11155111', // Sepolia por defecto
        {
          secretKey: process.env.THIRDWEB_SECRET_KEY,
          clientId: process.env.THIRDWEB_CLIENT_ID, // Opcional pero recomendado
        }
      );

      // Obtener el signer y provider
      const signer = this.sdk.getSigner();
      const provider = this.sdk.getProvider();

      // Normalizar direcciones a lowercase para evitar problemas de checksum
      // ethers.Contract acepta direcciones sin checksum
      const morphoCoinAddress = MORPHOCOIN_ADDRESS.toLowerCase();
      const plantationManagerAddress = PLANTATION_MANAGER_ADDRESS.toLowerCase();
      const morphoMarketplaceAddress = MORPHO_MARKETPLACE_ADDRESS.toLowerCase();

      // Cargar contratos usando los ABIs
      this.contracts.morphoCoin = new ethers.Contract(
        morphoCoinAddress,
        MorphoCoinABI,
        signer
      );

      this.contracts.plantationManager = new ethers.Contract(
        plantationManagerAddress,
        PlantationManagerABI,
        signer
      );

      this.contracts.morphoMarketplace = new ethers.Contract(
        morphoMarketplaceAddress,
        MorphoMarketplaceABI,
        signer
      );

      this.isInitialized = true;

      console.log('✅ BlockchainService inicializado correctamente');
      console.log(`   Chain ID: ${CHAIN_ID || '11155111'}`);
      console.log(`   MorphoCoin: ${morphoCoinAddress}`);
      console.log(`   PlantationManager: ${plantationManagerAddress}`);
      console.log(`   MorphoMarketplace: ${morphoMarketplaceAddress}`);
    } catch (error) {
      console.error('❌ Error al inicializar BlockchainService:', error.message);
      throw error;
    }
  }

  /**
   * Obtiene la instancia del contrato MorphoCoin
   */
  getMorphoCoinContract() {
    if (!this.isInitialized) {
      throw new Error('BlockchainService no está inicializado. Llama a initialize() primero.');
    }
    return this.contracts.morphoCoin;
  }

  /**
   * Obtiene la instancia del contrato PlantationManager
   */
  getPlantationManagerContract() {
    if (!this.isInitialized) {
      throw new Error('BlockchainService no está inicializado. Llama a initialize() primero.');
    }
    return this.contracts.plantationManager;
  }

  /**
   * Obtiene la instancia del contrato MorphoMarketplace
   */
  getMarketplaceContract() {
    if (!this.isInitialized) {
      throw new Error('BlockchainService no está inicializado. Llama a initialize() primero.');
    }
    return this.contracts.morphoMarketplace;
  }

  /**
   * Obtiene el SDK de Thirdweb
   */
  getSDK() {
    if (!this.isInitialized) {
      throw new Error('BlockchainService no está inicializado. Llama a initialize() primero.');
    }
    return this.sdk;
  }

  /**
   * Obtiene la dirección de la wallet del backend
   */
  async getBackendWalletAddress() {
    if (!this.isInitialized) {
      throw new Error('BlockchainService no está inicializado. Llama a initialize() primero.');
    }
    const signer = this.sdk.getSigner();
    return await signer.getAddress();
  }

  /**
   * Helper para ejecutar transacciones con manejo de errores
   */
  async executeTransaction(contractMethod, ...args) {
    try {
      const tx = await contractMethod(...args);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        receipt,
      };
    } catch (error) {
      console.error('Error ejecutando transacción:', error);
      
      // Parsear el error para obtener más información
      let errorMessage = error.message;
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      return {
        success: false,
        error: errorMessage,
        originalError: error,
      };
    }
  }

  /**
   * Obtiene el balance de ETH de una dirección
   */
  async getETHBalance(address) {
    if (!this.isInitialized) {
      throw new Error('BlockchainService no está inicializado.');
    }
    const provider = this.sdk.getProvider();
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  /**
   * Verifica si la conexión blockchain está activa
   */
  async healthCheck() {
    try {
      if (!this.isInitialized) {
        return {
          status: 'error',
          message: 'BlockchainService no inicializado',
        };
      }

      const provider = this.sdk.getProvider();
      const blockNumber = await provider.getBlockNumber();
      const walletAddress = await this.getBackendWalletAddress();

      return {
        status: 'ok',
        chainId: process.env.CHAIN_ID || '11155111',
        blockNumber,
        walletAddress,
        contracts: {
          morphoCoin: process.env.MORPHOCOIN_ADDRESS,
          plantationManager: process.env.PLANTATION_MANAGER_ADDRESS,
          morphoMarketplace: process.env.MORPHO_MARKETPLACE_ADDRESS,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}

// Exportar instancia singleton
const blockchainService = new BlockchainService();

export default blockchainService;
