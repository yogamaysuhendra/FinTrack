import React, { useState, useEffect } from 'react';
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import AppPage from "./pages/AppPage";
import TransactionForm from "./components/TransactionForm";
// Service eksternal dinonaktifkan sementara karena memicu bug data hilang
// import { transactionService } from "./services/transactionService";
// import { walletService } from "./services/walletService";
import { STORE_KEY, defaultData } from "./utils/constants";
import { Menu } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fintrack_user');
    return saved ? JSON.parse(saved) : { name: 'Yoga May Suhendra', email: 'demo@fintrack.local' };
  });
  const [active, setActive] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORE_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Otomatis tersimpan ke LocalStorage setiap ada penambahan/perubahan
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }, [data]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fintrack_user');
  };

  // LOGIKA SIMPAN YANG SUDAH DIPERBAIKI (Data lama tidak akan tertimpa)
  const handleSaveTransaction = (formData) => {
    const transactionWithId = {
      ...formData,
      id: formData.id || Date.now().toString()
    };

    setData(prevData => {
      let updatedTransactions;
      if (editingTransaction) {
        updatedTransactions = (prevData.transactions || []).map(t => 
          t.id === transactionWithId.id ? transactionWithId : t
        );
      } else {
        // Gabungkan transaksi baru di urutan teratas, diikuti data yang sudah ada
        updatedTransactions = [transactionWithId, ...(prevData.transactions || [])];
      }

      return {
        ...prevData,
        transactions: updatedTransactions
      };
    });

    setShowForm(false);
    setEditingTransaction(null);
  };

  // LOGIKA HAPUS YANG SUDAH DIPERBAIKI
  const handleDeleteTransaction = (id) => {
    if (window.confirm('Apakah kamu yakin ingin menghapus transaksi ini?')) {
      setData(prev => ({
        ...prev,
        transactions: (prev.transactions || []).filter(t => t.id !== id)
      }));
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const totals = React.useMemo(() => {
    const income = (data.transactions || []).filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
    const expense = (data.transactions || []).filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
    const balance = (data.wallets || []).reduce((s, w) => s + Number(w.balance || 0), 0) + income - expense;
    return { income, expense, balance };
  }, [data.transactions, data.wallets]);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#070e17] text-slate-100 selection:bg-emerald-500 selection:text-black">
      <Sidebar 
        active={active} 
        setActive={setActive} 
        open={sidebarOpen} 
        close={() => setSidebarOpen(false)} 
        onLogout={handleLogout}
        user={user}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[.06] bg-[#070e17]/80 px-4 sm:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden">
              <Menu size={20}/>
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-white">FinTrack</span>
              <span>/</span>
              <span className="font-semibold text-emerald-400">{active}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8">
          <AppPage 
            active={active} 
            data={data} 
            setData={setData}
            totals={totals} 
            onAdd={() => { setEditingTransaction(null); setShowForm(true); }}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            setActive={setActive}
          />
        </main>
      </div>

      {showForm && (
        <TransactionForm 
          initial={editingTransaction}
          wallets={data.wallets}
          onSave={handleSaveTransaction}
          onClose={() => { setShowForm(false); setEditingTransaction(null); }}
        />
      )}
    </div>
  );
}