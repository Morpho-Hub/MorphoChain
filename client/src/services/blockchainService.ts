import { api } from './api';

export const blockchainService = {
  getEthBalance: async (address: string) => {
    return api.get<{ balance: string }>(`/blockchain/eth/balance/${address}`);
  },

  getTokenBalance: async (address: string) => {
    return api.get<{ address: string; totalBalance: string; availableBalance: string; frozenBalance: string }>(`/blockchain/token/balance/${address}`);
  },
};
