import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { categoryOptions } from '../utils/constants';

export default function TransactionForm({ initial, wallets, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'expense',
    category: 'Makanan',
    amount: '',
    wallet: wallets[0]?.name || 'Tunai',
    date: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
  });

  // State untuk input terpisah (Hari, Bulan, Tahun) agar urutannya pasti
  const [day, setDay] = useState(new Date().getDate().toString().padStart(2, '0'));
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (initial && initial.date) {
      setFormData(initial);
      const parts = initial.date.split('-');
      if (parts.length === 3) {
        setYear(parts[0]);
        setMonth(parts[1]);
        setDay(parts[2]);
      }
    }
  }, [initial]);

  // Setiap kali Hari/Bulan/Tahun diubah, gabungkan otomatis ke format YYYY-MM-DD untuk disimpan
  const handleDateChange = (newDay, newMonth, newYear) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);
    
    const formattedDate = `${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, date: formattedDate }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1622] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="text-base font-bold text-white">{initial ? 'Edit Transaksi' : 'Catat Transaksi Baru'}</h2>
            <p className="text-xs text-slate-400">Masukkan rincian arus kas masuk atau keluar.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition">
            <X size={18}/>
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Tipe Transaksi */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#070f18] border border-white/10">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: categoryOptions.income[0] })}
              className={`py-2.5 rounded-lg font-bold transition ${formData.type === 'income' ? 'bg-emerald-400 text-[#062018] shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category: categoryOptions.expense[0] })}
              className={`py-2.5 rounded-lg font-bold transition ${formData.type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Nama Transaksi */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Nama Transaksi</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              required
              placeholder="Contoh: Gaji Bulanan / Beli Makan"
              className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Nominal */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Jumlah (Rp)</label>
            <input 
              type="number" 
              min="1"
              value={formData.amount} 
              onChange={e => setFormData({ ...formData, amount: e.target.value })} 
              required
              placeholder="Contoh: 500000"
              className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Kategori & Dompet */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Kategori</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white focus:border-emerald-400 focus:outline-none"
              >
                {(categoryOptions[formData.type] || []).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1.5">Sumber Dompet</label>
              <select 
                value={formData.wallet} 
                onChange={e => setFormData({ ...formData, wallet: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white focus:border-emerald-400 focus:outline-none"
              >
                {wallets.map(w => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal dengan Format: TANGGAL - BULAN - TAHUN */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Tanggal, Bulan, Tahun</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">Tanggal (DD)</span>
                <input 
                  type="number" 
                  min="1" 
                  max="31" 
                  value={day} 
                  onChange={e => handleDateChange(e.target.value, month, year)} 
                  required
                  placeholder="01"
                  className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white text-center focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">Bulan (MM)</span>
                <input 
                  type="number" 
                  min="1" 
                  max="12" 
                  value={month} 
                  onChange={e => handleDateChange(day, e.target.value, year)} 
                  required
                  placeholder="01"
                  className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white text-center focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">Tahun (YYYY)</span>
                <input 
                  type="number" 
                  value={year} 
                  onChange={e => handleDateChange(day, month, e.target.value)} 
                  required
                  placeholder="2026"
                  className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white text-center focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5">Batal</button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold text-[#062018] hover:bg-emerald-300">
            <Check size={16}/> Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
}