import api from './api';

const USE_REAL_API = false; 

export const transactionService = {
  async getAll() {
    if (USE_REAL_API) {
      const res = await api.get('/transactions');
      return res.data;
    } else {
      const data = localStorage.getItem('fintrack_transactions');
      return data ? JSON.parse(data) : null;
    }
  },

  async create(transactionData) {
    if (USE_REAL_API) {
      const res = await api.post('/transactions', transactionData);
      return res.data;
    } else {
      const current = await this.getAll() || [];
      const newTransaction = { ...transactionData, id: Date.now() };
      const updated = [newTransaction, ...current];
      localStorage.setItem('fintrack_transactions', JSON.stringify(updated));
      return newTransaction;
    }
  },

  async update(id, transactionData) {
    if (USE_REAL_API) {
      const res = await api.put(`/transactions/${id}`, transactionData);
      return res.data;
    } else {
      const current = await this.getAll() || [];
      const updated = current.map(t => t.id === id ? { ...t, ...transactionData } : t);
      localStorage.setItem('fintrack_transactions', JSON.stringify(updated));
      return updated.find(t => t.id === id);
    }
  },

  async delete(id) {
    if (USE_REAL_API) {
      const res = await api.delete(`/transactions/${id}`);
      return res.data;
    } else {
      const current = await this.getAll() || [];
      const updated = current.filter(t => t.id !== id);
      localStorage.setItem('fintrack_transactions', JSON.stringify(updated));
      return true;
    }
  }
};