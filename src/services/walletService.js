import api from './api';

const USE_REAL_API = false;

export const walletService = {
  async getAll() {
    if (USE_REAL_API) {
      const res = await api.get('/wallets');
      return res.data;
    } else {
      const data = localStorage.getItem('fintrack_wallets');
      return data ? JSON.parse(data) : [
        { id: 1, name: 'Tunai', balance: 500000 },
        { id: 2, name: 'BCA', balance: 10000000 },
        { id: 3, name: 'E-Wallet (OVO/GoPay)', balance: 750000 }
      ];
    }
  },

  async create(walletData) {
    if (USE_REAL_API) {
      const res = await api.post('/wallets', walletData);
      return res.data;
    } else {
      const current = await this.getAll() || [];
      const newWallet = { ...walletData, id: Date.now(), balance: Number(walletData.balance) || 0 };
      const updated = [...current, newWallet];
      localStorage.setItem('fintrack_wallets', JSON.stringify(updated));
      return newWallet;
    }
  },

  async delete(id) {
    if (USE_REAL_API) {
      const res = await api.delete(`/wallets/${id}`);
      return res.data;
    } else {
      const current = await this.getAll() || [];
      const updated = current.filter(w => w.id !== id);
      localStorage.setItem('fintrack_wallets', JSON.stringify(updated));
      return true;
    }
  },

  async saveAll(wallets) {
    localStorage.setItem('fintrack_wallets', JSON.stringify(wallets));
  }
};