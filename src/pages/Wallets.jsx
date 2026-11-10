import React, { useState } from 'react';
import { Plus, Trash2, CreditCard, ShieldCheck, Pencil } from 'lucide-react';
import { money } from '../utils/helpers';
import { walletService } from '../services/walletService';

export default function Wallets({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', balance: '' });
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSaveWallet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingWalletId) {
        // Mode Edit Dompet
        const updatedWallets = data.wallets.map(w => w.id === editingWalletId ? {
          ...w,
          name: form.name,
          balance: Number(form.balance) || 0
        } : w);
        await walletService.saveAll(updatedWallets);
        setData(d => ({ ...d, wallets: updatedWallets }));
      } else {
        // Mode Tambah Dompet Baru
        const newW = await walletService.create(form);
        const updatedWallets = [...data.wallets, newW];
        setData(d => ({ ...d, wallets: updatedWallets }));
      }
      setForm({ name: '', balance: '' });
      setEditingWalletId(null);
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (w) => {
    setEditingWalletId(w.id);
    setForm({ name: w.name, balance: w.balance });
    setShowModal(true);
  };

  const handleDeleteWallet = async (id) => {
    if (data.wallets.length <= 1) {
      alert('Minimal harus ada 1 dompet aktif!');
      return;
    }
    if (window.confirm('Hapus dompet ini?')) {
      await walletService.delete(id);
      const updatedWallets = data.wallets.filter(w => w.id !== id);
      setData(d => ({ ...d, wallets: updatedWallets }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Dompet</h1>
          <p className="mt-1 text-xs text-slate-400">Saldo dompet terhitung otomatis secara real-time dari transaksi masuk dan keluar.</p>
        </div>
        <button 
          onClick={() => { setEditingWalletId(null); setForm({ name: '', balance: '' }); setShowModal(true); }} 
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#062018] shadow-lg shadow-emerald-400/20 hover:bg-emerald-300 transition"
        >
          <Plus size={16}/> Tambah Dompet
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.wallets.map(w => {
          const walletIncome = data.transactions
            .filter(t => t.wallet === w.name && t.type === 'income')
            .reduce((s, t) => s + t.amount, 0);
          
          const walletExpense = data.transactions
            .filter(t => t.wallet === w.name && t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);

          const currentBalance = Number(w.balance || 0) + walletIncome - walletExpense;

          return (
            <div key={w.id || w.name} className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/30 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-500/20">
                    <CreditCard size={20}/>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{w.name}</h3>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck size={12} className="text-emerald-400"/> Terhubung Real-Time
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(w)} title="Edit Dompet" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition">
                    <Pencil size={14}/>
                  </button>
                  <button onClick={() => handleDeleteWallet(w.id)} title="Hapus Dompet" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Saldo Aktif</span>
                <p className="mt-1 text-2xl font-black text-white">{money(currentBalance)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && !loading && setShowModal(false)}>
          <form onSubmit={handleSaveWallet} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1622] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">{editingWalletId ? 'Edit Dompet' : 'Tambah Dompet Baru'}</h2>
            <p className="text-xs text-slate-400 mb-5">Atur nama dompet atau sesuaikan saldo awalnya.</p>
            
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Nama Dompet / Bank</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Contoh: Mandiri / DANA"/>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Saldo Awal (Rp)</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none" type="number" min="0" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} required placeholder="0"/>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5">Batal</button>
              <button disabled={loading} className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold text-[#062018] hover:bg-emerald-300">
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}