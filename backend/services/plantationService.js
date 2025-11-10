import { ethers } from 'ethers';
import blockchainService from './blockchainService.js';

class PlantationService {
  /**
   * Registra una nueva plantación en el contrato
   */
  async registerPlantation(plantationId, walletAddress) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      
      return await blockchainService.executeTransaction(
        contract.registerPlantation.bind(contract),
        plantationId,
        walletAddress
      );
    } catch (error) {
      throw new Error(`Error al registrar plantación: ${error.message}`);
    }
  }

  /**
   * Obtiene la información de una plantación por su ID
   */
  async getPlantation(plantationId) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const plantation = await contract.getPlantation(plantationId);
      
      return {
        plantationId: plantation.plantationId,
        walletAddress: plantation.walletAddress,
        totalMinted: ethers.utils.formatEther(plantation.totalMinted),
        frozenAmount: ethers.utils.formatEther(plantation.frozenAmount),
        isActive: plantation.isActive,
        registeredAt: new Date(plantation.registeredAt.toNumber() * 1000).toISOString(),
      };
    } catch (error) {
      throw new Error(`Error al obtener plantación: ${error.message}`);
    }
  }

  /**
   * Obtiene el ID de plantación asociado a una wallet
   */
  async getPlantationByWallet(walletAddress) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const plantationId = await contract.getPlantationByWallet(walletAddress);
      
      if (!plantationId || plantationId === '') {
        return null;
      }
      
      return plantationId;
    } catch (error) {
      throw new Error(`Error al obtener plantación por wallet: ${error.message}`);
    }
  }

  /**
   * Mintea tokens directamente a una plantación
   */
  async mintToPlantation(plantationId, amount) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.mintToPlantation.bind(contract),
        plantationId,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al mintear a plantación: ${error.message}`);
    }
  }

  /**
   * Congela tokens de una plantación
   */
  async freezePlantationTokens(plantationId, amount) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.freezePlantationTokens.bind(contract),
        plantationId,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al congelar tokens de plantación: ${error.message}`);
    }
  }

  /**
   * Descongela tokens de una plantación
   */
  async unfreezePlantationTokens(plantationId, amount) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.unfreezePlantationTokens.bind(contract),
        plantationId,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al descongelar tokens de plantación: ${error.message}`);
    }
  }

  /**
   * Desactiva una plantación
   */
  async deactivatePlantation(plantationId) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      
      return await blockchainService.executeTransaction(
        contract.deactivatePlantation.bind(contract),
        plantationId
      );
    } catch (error) {
      throw new Error(`Error al desactivar plantación: ${error.message}`);
    }
  }

  /**
   * Obtiene el total de plantaciones registradas
   */
  async getTotalPlantations() {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const total = await contract.getTotalPlantations();
      return total.toNumber();
    } catch (error) {
      throw new Error(`Error al obtener total de plantaciones: ${error.message}`);
    }
  }

  /**
   * Verifica si una cuenta tiene el rol de MANAGER
   */
  async hasManagerRole(address) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const managerRole = ethers.utils.id('MANAGER_ROLE');
      return await contract.hasRole(managerRole, address);
    } catch (error) {
      throw new Error(`Error al verificar rol de manager: ${error.message}`);
    }
  }

  /**
   * Otorga el rol de MANAGER a una cuenta (requiere ser admin)
   */
  async grantManagerRole(address) {
    try {
      const contract = blockchainService.getPlantationManagerContract();
      const managerRole = ethers.utils.id('MANAGER_ROLE');
      
      return await blockchainService.executeTransaction(
        contract.grantRole.bind(contract),
        managerRole,
        address
      );
    } catch (error) {
      throw new Error(`Error al otorgar rol de manager: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las plantaciones (limitado a las primeras N)
   * Nota: En producción, considera implementar paginación en el contrato
   */
  async getAllPlantations(limit = 100) {
    try {
      const total = await this.getTotalPlantations();
      const actualLimit = Math.min(total, limit);
      const contract = blockchainService.getPlantationManagerContract();
      
      const plantations = [];
      
      for (let i = 0; i < actualLimit; i++) {
        try {
          const plantationId = await contract.plantationIds(i);
          const plantationData = await this.getPlantation(plantationId);
          plantations.push(plantationData);
        } catch (error) {
          console.error(`Error al obtener plantación en índice ${i}:`, error.message);
        }
      }
      
      return {
        total,
        plantations,
        showing: plantations.length,
      };
    } catch (error) {
      throw new Error(`Error al obtener todas las plantaciones: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas generales de todas las plantaciones
   */
  async getPlantationStats() {
    try {
      const total = await this.getTotalPlantations();
      const contract = blockchainService.getPlantationManagerContract();
      
      let activeCount = 0;
      let totalMinted = ethers.BigNumber.from(0);
      let totalFrozen = ethers.BigNumber.from(0);
      
      // Obtener hasta las primeras 100 plantaciones para calcular stats
      const limit = Math.min(total, 100);
      
      for (let i = 0; i < limit; i++) {
        try {
          const plantationId = await contract.plantationIds(i);
          const plantation = await contract.getPlantation(plantationId);
          
          if (plantation.isActive) activeCount++;
          totalMinted = totalMinted.add(plantation.totalMinted);
          totalFrozen = totalFrozen.add(plantation.frozenAmount);
        } catch (error) {
          console.error(`Error al procesar stats de plantación ${i}:`, error.message);
        }
      }
      
      return {
        total,
        active: activeCount,
        inactive: total - activeCount,
        totalMinted: ethers.utils.formatEther(totalMinted),
        totalFrozen: ethers.utils.formatEther(totalFrozen),
        sampled: limit,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de plantaciones: ${error.message}`);
    }
  }
}

export default new PlantationService();
