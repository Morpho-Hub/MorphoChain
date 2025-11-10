import { ethers } from 'ethers';
import blockchainService from './blockchainService.js';

class MarketplaceService {
  /**
   * Crea un nuevo listing en el marketplace
   */
  async createListing(amount, pricePerToken) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      const priceInWei = ethers.utils.parseEther(pricePerToken.toString());
      
      const result = await blockchainService.executeTransaction(
        contract.createListing.bind(contract),
        amountInWei,
        priceInWei
      );

      if (result.success) {
        // Buscar el evento ListingCreated en los logs
        const listingCreatedEvent = result.receipt.events?.find(
          e => e.event === 'ListingCreated'
        );
        
        if (listingCreatedEvent) {
          result.listingId = listingCreatedEvent.args.listingId.toString();
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Error al crear listing: ${error.message}`);
    }
  }

  /**
   * Compra tokens de un listing
   */
  async buyFromListing(listingId, amount) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      // Primero obtenemos el listing para calcular el precio total
      const listing = await this.getListing(listingId);
      const totalPrice = ethers.utils.parseEther(
        (parseFloat(listing.pricePerToken) * parseFloat(amount)).toString()
      );
      
      return await blockchainService.executeTransaction(
        contract.buyFromListing.bind(contract),
        listingId,
        amountInWei,
        { value: totalPrice } // Enviar ETH para la compra
      );
    } catch (error) {
      throw new Error(`Error al comprar del listing: ${error.message}`);
    }
  }

  /**
   * Cancela un listing
   */
  async cancelListing(listingId) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      
      return await blockchainService.executeTransaction(
        contract.cancelListing.bind(contract),
        listingId
      );
    } catch (error) {
      throw new Error(`Error al cancelar listing: ${error.message}`);
    }
  }

  /**
   * Obtiene la información de un listing específico
   */
  async getListing(listingId) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const listing = await contract.getListing(listingId);
      
      return {
        listingId: listing.listingId.toString(),
        seller: listing.seller,
        amount: ethers.utils.formatEther(listing.amount),
        pricePerToken: ethers.utils.formatEther(listing.pricePerToken),
        isActive: listing.isActive,
        createdAt: new Date(listing.createdAt.toNumber() * 1000).toISOString(),
      };
    } catch (error) {
      throw new Error(`Error al obtener listing: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los listings activos
   */
  async getActiveListings() {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const activeIds = await contract.getActiveListings();
      
      const listings = await Promise.all(
        activeIds.map(async (id) => {
          try {
            return await this.getListing(id.toString());
          } catch (error) {
            console.error(`Error al obtener listing ${id}:`, error.message);
            return null;
          }
        })
      );
      
      return listings.filter(listing => listing !== null);
    } catch (error) {
      throw new Error(`Error al obtener listings activos: ${error.message}`);
    }
  }

  /**
   * Obtiene los listings de un vendedor específico
   */
  async getSellerListings(sellerAddress) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const listingIds = await contract.getSellerListings(sellerAddress);
      
      const listings = await Promise.all(
        listingIds.map(async (id) => {
          try {
            return await this.getListing(id.toString());
          } catch (error) {
            console.error(`Error al obtener listing ${id}:`, error.message);
            return null;
          }
        })
      );
      
      return listings.filter(listing => listing !== null);
    } catch (error) {
      throw new Error(`Error al obtener listings del vendedor: ${error.message}`);
    }
  }

  /**
   * Obtiene el total de listings creados
   */
  async getTotalListings() {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const total = await contract.getTotalListings();
      return total.toNumber();
    } catch (error) {
      throw new Error(`Error al obtener total de listings: ${error.message}`);
    }
  }

  /**
   * Obtiene la comisión de la plataforma (en basis points: 1 bp = 0.01%)
   */
  async getPlatformFee() {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const feeBps = await contract.platformFeeBps();
      return {
        basisPoints: feeBps.toNumber(),
        percentage: (feeBps.toNumber() / 100).toFixed(2),
      };
    } catch (error) {
      throw new Error(`Error al obtener comisión de plataforma: ${error.message}`);
    }
  }

  /**
   * Actualiza la comisión de la plataforma (requiere rol OPERATOR_ROLE)
   */
  async updatePlatformFee(newFeeBps) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      
      return await blockchainService.executeTransaction(
        contract.updatePlatformFee.bind(contract),
        newFeeBps
      );
    } catch (error) {
      throw new Error(`Error al actualizar comisión: ${error.message}`);
    }
  }

  /**
   * Obtiene la dirección del receptor de comisiones
   */
  async getFeeRecipient() {
    try {
      const contract = blockchainService.getMarketplaceContract();
      return await contract.feeRecipient();
    } catch (error) {
      throw new Error(`Error al obtener receptor de comisiones: ${error.message}`);
    }
  }

  /**
   * Actualiza el receptor de comisiones (requiere rol OPERATOR_ROLE)
   */
  async updateFeeRecipient(newRecipient) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      
      return await blockchainService.executeTransaction(
        contract.updateFeeRecipient.bind(contract),
        newRecipient
      );
    } catch (error) {
      throw new Error(`Error al actualizar receptor de comisiones: ${error.message}`);
    }
  }

  /**
   * Verifica si una cuenta tiene el rol de OPERATOR
   */
  async hasOperatorRole(address) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const operatorRole = ethers.utils.id('OPERATOR_ROLE');
      return await contract.hasRole(operatorRole, address);
    } catch (error) {
      throw new Error(`Error al verificar rol de operador: ${error.message}`);
    }
  }

  /**
   * Otorga el rol de OPERATOR a una cuenta (requiere ser admin)
   */
  async grantOperatorRole(address) {
    try {
      const contract = blockchainService.getMarketplaceContract();
      const operatorRole = ethers.utils.id('OPERATOR_ROLE');
      
      return await blockchainService.executeTransaction(
        contract.grantRole.bind(contract),
        operatorRole,
        address
      );
    } catch (error) {
      throw new Error(`Error al otorgar rol de operador: ${error.message}`);
    }
  }

  /**
   * Calcula el costo total de comprar cierta cantidad de un listing
   */
  async calculatePurchaseCost(listingId, amount) {
    try {
      const listing = await this.getListing(listingId);
      
      if (!listing.isActive) {
        throw new Error('El listing no está activo');
      }

      const availableAmount = parseFloat(listing.amount);
      if (amount > availableAmount) {
        throw new Error(`Solo hay ${availableAmount} tokens disponibles`);
      }

      const subtotal = parseFloat(listing.pricePerToken) * amount;
      const fee = await this.getPlatformFee();
      const feeAmount = (subtotal * fee.basisPoints) / 10000;
      const total = subtotal + feeAmount;

      return {
        amount,
        pricePerToken: listing.pricePerToken,
        subtotal: subtotal.toString(),
        platformFee: feeAmount.toString(),
        total: total.toString(),
        feePercentage: fee.percentage,
      };
    } catch (error) {
      throw new Error(`Error al calcular costo de compra: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas del marketplace
   */
  async getMarketplaceStats() {
    try {
      const [totalListings, activeListings, platformFee] = await Promise.all([
        this.getTotalListings(),
        this.getActiveListings(),
        this.getPlatformFee(),
      ]);

      let totalVolume = ethers.BigNumber.from(0);
      let totalValue = ethers.BigNumber.from(0);

      activeListings.forEach(listing => {
        const amount = ethers.utils.parseEther(listing.amount);
        const price = ethers.utils.parseEther(listing.pricePerToken);
        totalVolume = totalVolume.add(amount);
        totalValue = totalValue.add(amount.mul(price).div(ethers.utils.parseEther('1')));
      });

      return {
        totalListings,
        activeListings: activeListings.length,
        inactiveListings: totalListings - activeListings.length,
        totalVolumeAvailable: ethers.utils.formatEther(totalVolume),
        totalValueLocked: ethers.utils.formatEther(totalValue),
        platformFee: platformFee.percentage,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas del marketplace: ${error.message}`);
    }
  }
}

export default new MarketplaceService();
