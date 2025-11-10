import { ethers } from 'ethers';
import blockchainService from './blockchainService.js';

class MorphoCoinService {
  /**
   * Obtiene el balance de MorphoCoin de una dirección
   */
  async getBalance(address) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const balance = await contract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Error al obtener balance: ${error.message}`);
    }
  }

  /**
   * Obtiene el balance disponible (no congelado) de una dirección
   */
  async getAvailableBalance(address) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const balance = await contract.availableBalanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Error al obtener balance disponible: ${error.message}`);
    }
  }

  /**
   * Obtiene el balance congelado de una dirección
   */
  async getFrozenBalance(address) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const balance = await contract.frozenBalanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Error al obtener balance congelado: ${error.message}`);
    }
  }

  /**
   * Transfiere tokens de MorphoCoin
   */
  async transfer(toAddress, amount) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.transfer.bind(contract),
        toAddress,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al transferir tokens: ${error.message}`);
    }
  }

  /**
   * Mintea tokens a una dirección (requiere rol MINTER_ROLE)
   */
  async mintTo(toAddress, amount) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.mintTo.bind(contract),
        toAddress,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al mintear tokens: ${error.message}`);
    }
  }

  /**
   * Mintea tokens a una plantación específica
   */
  async mintToPlantation(plantationAddress, amount, plantationId) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.mintToPlantation.bind(contract),
        plantationAddress,
        amountInWei,
        plantationId
      );
    } catch (error) {
      throw new Error(`Error al mintear tokens a plantación: ${error.message}`);
    }
  }

  /**
   * Congela tokens de una cuenta (requiere rol FREEZER_ROLE)
   */
  async freezeTokens(address, amount) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.freezeTokens.bind(contract),
        address,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al congelar tokens: ${error.message}`);
    }
  }

  /**
   * Descongela tokens de una cuenta (requiere rol FREEZER_ROLE)
   */
  async unfreezeTokens(address, amount) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.unfreezeTokens.bind(contract),
        address,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al descongelar tokens: ${error.message}`);
    }
  }

  /**
   * Quema tokens del balance del llamador
   */
  async burn(amount) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.burn.bind(contract),
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al quemar tokens: ${error.message}`);
    }
  }

  /**
   * Quema tokens de otra cuenta (requiere allowance)
   */
  async burnFrom(fromAddress, amount) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      return await blockchainService.executeTransaction(
        contract.burnFrom.bind(contract),
        fromAddress,
        amountInWei
      );
    } catch (error) {
      throw new Error(`Error al quemar tokens desde cuenta: ${error.message}`);
    }
  }

  /**
   * Obtiene la información general del token
   */
  async getTokenInfo() {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      return {
        name,
        symbol,
        decimals,
        totalSupply: ethers.utils.formatEther(totalSupply),
        address: process.env.MORPHOCOIN_ADDRESS,
      };
    } catch (error) {
      throw new Error(`Error al obtener información del token: ${error.message}`);
    }
  }

  /**
   * Verifica si una cuenta tiene un rol específico
   */
  async hasRole(role, address) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      
      // Roles disponibles
      const roles = {
        ADMIN: ethers.constants.HashZero, // DEFAULT_ADMIN_ROLE = 0x00
        MINTER: ethers.utils.id('MINTER_ROLE'),
        FREEZER: ethers.utils.id('FREEZER_ROLE'),
      };

      const roleHash = roles[role.toUpperCase()] || role;
      return await contract.hasRole(roleHash, address);
    } catch (error) {
      throw new Error(`Error al verificar rol: ${error.message}`);
    }
  }

  /**
   * Otorga un rol a una cuenta (requiere ser admin)
   */
  async grantRole(role, address) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      
      const roles = {
        MINTER: ethers.utils.id('MINTER_ROLE'),
        FREEZER: ethers.utils.id('FREEZER_ROLE'),
      };

      const roleHash = roles[role.toUpperCase()] || role;
      
      return await blockchainService.executeTransaction(
        contract.grantRole.bind(contract),
        roleHash,
        address
      );
    } catch (error) {
      throw new Error(`Error al otorgar rol: ${error.message}`);
    }
  }

  /**
   * Obtiene el allowance que un owner ha dado a un spender
   */
  async getAllowance(owner, spender) {
    try {
      const contract = blockchainService.getMorphoCoinContract();
      const allowance = await contract.allowance(owner, spender);
      return ethers.utils.formatEther(allowance);
    } catch (error) {
      throw new Error(`Error al obtener allowance: ${error.message}`);
    }
  }
}

export default new MorphoCoinService();
