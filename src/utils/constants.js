export const STORE_KEY = 'fintrack_app_data_v3';

export const today = new Date().toISOString().split('T')[0];
export const monthNow = today.slice(0, 7);

export const colors = ['#34d399', '#60a5fa', '#a78bfa', '#f43f5e', '#fbbf24', '#38bdf8', '#fb7185'];

export const categoryOptions = {
  expense: ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Lainnya'],
  income: ['Gaji', 'Freelance', 'Investasi', 'Hadiah', 'Pendapatan Lain']
};

export const defaultData = {
  wallets: [
    { id: 1, name: 'Tunai', balance: 0 },
    { id: 2, name: 'BCA', balance: 0 },
    { id: 3, name: 'E-Wallet', balance: 0 }
  ],
  transactions: [], // SUDAH DIKOSONGKAN
  budgets: [],      // SUDAH DIKOSONGKAN
  goals: []         // SUDAH DIKOSONGKAN
};