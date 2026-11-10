import React, { useState } from 'react';
import Dashboard from './Dashboard';
import TransactionTable from '../components/TransactionTable';
import Wallets from './Wallets';
import { Plus, Trash2, Target, Pencil, AlertCircle, Settings, Server, User, RefreshCw, HelpCircle, BookOpen, MessageCircle } from 'lucide-react';
import { money } from '../utils/helpers';
import { categoryOptions } from '../utils/constants';

export default function AppPage({ active, data, setData, totals, onAdd, onEdit, onDelete, setActive }) {
  // State modal Anggaran & Target Tabungan
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  
  const [budgetForm, setBudgetForm] = useState({ category: 'Makanan', limit: '' });
  
  // State Form Target Tabungan (Mendukung Mode Edit / Top-up)
  const [goalForm, setGoalForm] = useState({ title: '', target: '', current: '' });
  const [editingGoalId, setEditingGoalId] = useState(null);

  // State Pengaturan Backend Mode
  const [useBackend, setUseBackend] = useState(false);

  // Handler Anggaran
  const handleAddBudget = (e) => {
    e.preventDefault();
    const newB = { id: Date.now(), category: budgetForm.category, limit: Number(budgetForm.limit) };
    setData(d => ({ ...d, budgets: [...(d.budgets || []), newB] }));
    setBudgetForm({ category: 'Makanan', limit: '' });
    setShowBudgetModal(false);
  };

  const handleDeleteBudget = (id) => {
    setData(d => ({ ...d, budgets: d.budgets.filter(b => b.id !== id) }));
  };

  // Handler Target Tabungan (Create & Update/Top-up)
  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (editingGoalId) {
      setData(d => ({
        ...d,
        goals: d.goals.map(g => g.id === editingGoalId ? {
          ...g,
          title: goalForm.title,
          target: Number(goalForm.target),
          current: Number(goalForm.current) || 0
        } : g)
      }));
    } else {
      const newG = { 
        id: Date.now(), 
        title: goalForm.title, 
        target: Number(goalForm.target), 
        current: Number(goalForm.current) || 0 
      };
      setData(d => ({ ...d, goals: [...(d.goals || []), newG] }));
    }
    setGoalForm({ title: '', target: '', current: '' });
    setEditingGoalId(null);
    setShowGoalModal(false);
  };

  const handleOpenEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setGoalForm({ title: goal.title, target: goal.target, current: goal.current });
    setShowGoalModal(true);
  };

  const handleDeleteGoal = (id) => {
    setData(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) }));
  };

  const handleResetData = () => {
    if (window.confirm('PERINGATAN: Semua data transaksi, dompet, dan anggaran akan direset ke pengaturan awal. Lanjutkan?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* 📊 DASHBOARD */}
      {active === 'Dashboard' && (
        <Dashboard data={data} totals={totals} onAdd={onAdd} setActive={setActive} />
      )}

      {/* 📝 TRANSAKSI */}
      {active === 'Transaksi' && (
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Daftar Transaksi</h1>
              <p className="mt-1 text-xs text-slate-400">Semua riwayat pemasukan dan pengeluaran tercatat di sini.</p>
            </div>
            <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#062018] hover:bg-emerald-300">
              <Plus size={16}/> Catat Transaksi
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl">
            <TransactionTable transactions={data.transactions} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      )}

      {/* 💳 DOMPET */}
      {active === 'Dompet' && (
        <Wallets data={data} setData={setData} />
      )}

      {/* 🎯 ANGGARAN */}
      {active === 'Anggaran' && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Anggaran</h1>
              <p className="mt-1 text-xs text-slate-400">Atur batasan limit pengeluaran per kategori agar keuangan tetap terkontrol.</p>
            </div>
            <button onClick={() => setShowBudgetModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#062018] hover:bg-emerald-300">
              <Plus size={16}/> Buat Anggaran Baru
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(data.budgets || []).map(b => {
              const spent = data.transactions
                .filter(t => t.type === 'expense' && t.category === b.category)
                .reduce((s, t) => s + t.amount, 0);
              const percent = b.limit ? Math.min(Math.round((spent / b.limit) * 100), 100) : 0;
              const isOver = spent > b.limit;

              return (
                <div key={b.id} className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">{b.category}</span>
                      <button onClick={() => handleDeleteBudget(b.id)} className="text-slate-500 hover:text-rose-400 p-1"><Trash2 size={16}/></button>
                    </div>
                    <div className="mt-4 flex justify-between text-xs">
                      <span className="text-slate-400">Terpakai: <strong className="text-white">{money(spent)}</strong></span>
                      <span className="text-slate-400">Limit: <strong className="text-white">{money(b.limit)}</strong></span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className={isOver ? 'text-rose-400 font-bold' : 'text-slate-400'}>{percent}% dari limit</span>
                      {isOver && <span className="text-rose-400 font-bold flex items-center gap-1"><AlertCircle size={12}/> Over Budget!</span>}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🚀 TARGET TABUNGAN */}
      {active === 'Target Tabungan' && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Target Tabungan & Impian</h1>
              <p className="mt-1 text-xs text-slate-400">Pantau progres pencapaian dana impian dan atur nominal tabunganmu.</p>
            </div>
            <button 
              onClick={() => { setEditingGoalId(null); setGoalForm({ title: '', target: '', current: '' }); setShowGoalModal(true); }} 
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#062018] hover:bg-emerald-300"
            >
              <Plus size={16}/> Tambah Target Baru
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(data.goals || []).map(g => {
              const percent = g.target ? Math.min(Math.round((g.current / g.target) * 100), 100) : 0;
              return (
                <div key={g.id} className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20"><Target size={18}/></div>
                        <h3 className="text-sm font-bold text-white">{g.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenEditGoal(g)} title="Edit / Top-up" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition">
                          <Pencil size={14}/>
                        </button>
                        <button onClick={() => handleDeleteGoal(g.id)} title="Hapus" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between text-xs">
                      <span className="text-slate-400">Terkumpul: <strong className="text-emerald-400">{money(g.current)}</strong></span>
                      <span className="text-slate-400">Target: <strong className="text-white">{money(g.target)}</strong></span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] mb-1.5 text-slate-400">
                      <span>Progres Pencapaian</span>
                      <span className="font-bold text-white">{percent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 📈 LAPORAN KEUANGAN TERINTEGRASI */}
      {active === 'Laporan' && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Laporan Keuangan Komprehensif</h1>
              <p className="mt-1 text-xs text-slate-400">Analisis menyeluruh arus kas, saldo awal dompet, pemasukan, dan pengeluaran.</p>
            </div>
            <button onClick={() => window.print()} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition">
              Cetak / Ekspor Laporan
            </button>
          </div>

          {(() => {
            const initialWalletsBalance = data.wallets.reduce((s, w) => s + Number(w.balance || 0), 0);
            const totalIncomeWithWallets = totals.income + initialWalletsBalance;
            const netCashflow = totalIncomeWithWallets - totals.expense;

            return (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-500/10 to-transparent p-6 backdrop-blur-xl">
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Total Pemasukan (+ Saldo Awal)</span>
                    <p className="mt-2 text-2xl font-black text-emerald-400">{money(totalIncomeWithWallets)}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Termasuk saldo awal dompet {money(initialWalletsBalance)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-sky-500/10 to-transparent p-6 backdrop-blur-xl">
                    <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Total Pengeluaran</span>
                    <p className="mt-2 text-2xl font-black text-sky-400">{money(totals.expense)}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Akumulasi seluruh transaksi keluar</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-purple-500/10 to-transparent p-6 backdrop-blur-xl">
                    <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Sisa Arus Kas Bersih</span>
                    <p className="mt-2 text-2xl font-black text-purple-300">{money(netCashflow)}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Total dana keseluruhan saat ini</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl">
                  <h3 className="text-sm font-bold text-white mb-4">Rincian Pengeluaran Berdasarkan Kategori</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      data.transactions
                        .filter(t => t.type === 'expense')
                        .reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {})
                    ).map(([cat, amount]) => {
                      const percentage = totals.expense ? Math.round((amount / totals.expense) * 100) : 0;
                      return (
                        <div key={cat} className="flex items-center justify-between text-xs border-b border-white/[0.04] pb-3">
                          <div>
                            <span className="font-semibold text-white">{cat}</span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{percentage}% dari total pengeluaran</div>
                          </div>
                          <strong className="text-slate-200">{money(amount)}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ⚙️ PENGATURAN */}
      {active === 'Pengaturan' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Pengaturan Sistem</h1>
            <p className="mt-1 text-xs text-slate-400">Kelola preferensi akun, konfigurasi penyimpanan, dan koneksi backend.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-500/20">
                  <User size={20}/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Informasi Akun</h3>
                  <p className="text-[11px] text-slate-400">Akun yang sedang aktif saat ini</p>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Nama Pengguna</span>
                  <div className="rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white font-medium">Yoga May Suhendra</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Email / Akses</span>
                  <div className="rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-white font-medium">demo@fintrack.local</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-400/10 text-sky-400 border border-sky-500/20">
                  <Server size={20}/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Koneksi Backend Laravel</h3>
                  <p className="text-[11px] text-slate-400">Atur mode penyimpanan data API</p>
                </div>
              </div>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#070f18] p-3.5">
                  <div>
                    <span className="font-semibold text-white block">Gunakan API Laravel (Live Server)</span>
                    <span className="text-[10px] text-slate-400">Sambungkan ke backend kelompok untuk UAS</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={useBackend} 
                    onChange={e => {
                      setUseBackend(e.target.checked);
                      alert(e.target.checked ? 'Mode Backend Laravel diaktifkan. Pastikan endpoint API sudah siap.' : 'Mode Lokal (LocalStorage) diaktifkan kembali.');
                    }} 
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">URL Endpoint Backend</span>
                  <input className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none" value="http://localhost:8000/api" readOnly/>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw size={16} className="text-rose-400"/> Reset Data Aplikasi
              </h3>
              <p className="text-xs text-slate-400 mt-1">Hapus seluruh riwayat transaksi, dompet kustom, dan kembalikan data ke awal.</p>
            </div>
            <button onClick={handleResetData} className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition whitespace-nowrap">
              Reset Data Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ❓ BANTUAN & PANDUAN PENGGUNAAN TERINTEGRASI */}
      {active === 'Bantuan' && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Pusat Bantuan & Status Sistem</h1>
              <p className="mt-1 text-xs text-slate-400">Panduan penggunaan aplikasi FinTrack dan pemantauan status data kelompok UAS.</p>
            </div>
          </div>

          {/* Kartu Status Integrasi Sistem */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-500/10 to-transparent p-6 backdrop-blur-xl">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Total Transaksi Tercatat</span>
              <p className="mt-2 text-2xl font-black text-white">{data.transactions.length} Aktivitas</p>
              <p className="mt-1 text-[11px] text-slate-400">Sinkron dengan Dashboard & Laporan</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-sky-500/10 to-transparent p-6 backdrop-blur-xl">
              <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Dompet Aktif</span>
              <p className="mt-2 text-2xl font-black text-white">{data.wallets.length} Akun Dompet</p>
              <p className="mt-1 text-[11px] text-slate-400">Saldo terhitung otomatis real-time</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-purple-500/10 to-transparent p-6 backdrop-blur-xl">
              <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Target & Anggaran</span>
              <p className="mt-2 text-2xl font-black text-white">{(data.budgets?.length || 0) + (data.goals?.length || 0)} Aktif</p>
              <p className="mt-1 text-[11px] text-slate-400">Kontrol keuangan kelompok</p>
            </div>
          </div>

          {/* Tombol Navigasi Pintas */}
          <div className="grid gap-4 sm:grid-cols-3">
            <button onClick={() => setActive('Transaksi')} className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left backdrop-blur-xl hover:border-emerald-500/30 transition group">
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Kelola Transaksi</h4>
                <p className="text-xs text-slate-400 mt-0.5">Tambah, edit, atau hapus riwayat</p>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
            </button>
            <button onClick={() => setActive('Dompet')} className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left backdrop-blur-xl hover:border-emerald-500/30 transition group">
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Atur Dompet</h4>
                <p className="text-xs text-slate-400 mt-0.5">Cek saldo bank & e-wallet</p>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
            </button>
            <button onClick={() => setActive('Laporan')} className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left backdrop-blur-xl hover:border-emerald-500/30 transition group">
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Cek Laporan</h4>
                <p className="text-xs text-slate-400 mt-0.5">Rekapitulasi total kas bersih</p>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
            </button>
          </div>

          {/* Panduan & FAQ Teknis UAS */}
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-400"/> Panduan Teknis UAS & Integrasi Backend Laravel
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-[#070f18] p-4">
                <strong className="text-white block mb-1">1. Sinkronisasi Data Real-Time</strong>
                <p className="text-slate-400">Seluruh perubahan pada menu Transaksi, Dompet, Anggaran, dan Target Tabungan langsung memperbarui state utama aplikasi secara instan dan tersimpan otomatis ke dalam LocalStorage.</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#070f18] p-4">
                <strong className="text-white block mb-1">2. Integrasi Endpoint API Laravel (Untuk Anggota Backend)</strong>
                <p className="text-slate-400">Pastikan tim backend menyiapkan endpoint REST API berikut di Laravel: <code className="text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">/api/transactions</code>, <code className="text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">/api/wallets</code>, dan <code className="text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">/api/budgets</code> dengan metode GET, POST, PUT, dan DELETE.</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#070f18] p-4">
                <strong className="text-white block mb-1">3. Mode Pengujian (Demo Mode)</strong>
                <p className="text-slate-400">Aplikasi dilengkapi data dummy otomatis agar dosen penguji atau rekan kelompok dapat langsung mendemonstrasikan fitur tanpa harus mengisi data dari nol.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ANGGARAN */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && setShowBudgetModal(false)}>
          <form onSubmit={handleAddBudget} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1622] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">Buat Anggaran Kategori</h2>
            <p className="text-xs text-slate-400 mb-5">Tentukan batas maksimal pengeluaran per kategori.</p>
            
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Pilih Kategori</span>
                <select className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none" value={budgetForm.category} onChange={e => setBudgetForm({...budgetForm, category: e.target.value})}>
                  {categoryOptions.expense.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Limit Maksimal (Rp)</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none" type="number" min="1" value={budgetForm.limit} onChange={e => setBudgetForm({...budgetForm, limit: e.target.value})} required placeholder="Contoh: 1500000"/>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
              <button type="button" onClick={() => setShowBudgetModal(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5">Batal</button>
              <button className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold text-[#062018] hover:bg-emerald-300">Simpan Anggaran</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL TARGET TABUNGAN */}
      {showGoalModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && setShowGoalModal(false)}>
          <form onSubmit={handleSaveGoal} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1622] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">{editingGoalId ? 'Edit / Top-up Target Tabungan' : 'Tambah Target Tabungan'}</h2>
            <p className="text-xs text-slate-400 mb-5">Perbarui nominal target atau jumlah yang sudah terkumpul.</p>
            
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Nama Target / Impian</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none" value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} required placeholder="Contoh: Beli Laptop Baru"/>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Target Dana (Rp)</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none" type="number" min="1" value={goalForm.target} onChange={e => setGoalForm({...goalForm, target: e.target.value})} required placeholder="10000000"/>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Terkumpul Saat Ini (Rp)</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#070f18] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none" type="number" min="0" value={goalForm.current} onChange={e => setGoalForm({...goalForm, current: e.target.value})} placeholder="1000000"/>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
              <button type="button" onClick={() => setShowGoalModal(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5">Batal</button>
              <button className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold text-[#062018] hover:bg-emerald-300">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

