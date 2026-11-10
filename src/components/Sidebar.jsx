import React from 'react';
import { LayoutDashboard, ReceiptText, Wallet, SlidersHorizontal, Target, PieChart, Settings, CircleHelp, X, LogOut } from 'lucide-react';

export const navGroups = [
  { label: 'KEUANGAN', items: [{ label: 'Dashboard', icon: LayoutDashboard }, { label: 'Transaksi', icon: ReceiptText }, { label: 'Dompet', icon: Wallet }, { label: 'Anggaran', icon: SlidersHorizontal }, { label: 'Target Tabungan', icon: Target }, { label: 'Laporan', icon: PieChart }] },
  { label: 'LAINNYA', items: [{ label: 'Pengaturan', icon: Settings }, { label: 'Bantuan', icon: CircleHelp }] },
];

export default function Sidebar({ active, setActive, open, close, onLogout, user }) {
  return <>
    {open && <button aria-label="Tutup menu" onClick={close} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />}
    
    <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col bg-[#070e17] px-4 py-6 transition-transform lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Brand / Logo Area */}
      <div className="mb-8 flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/10">
            F
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white">FinTrack<span className="text-emerald-400">.</span></div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Enterprise Grade</div>
          </div>
        </div>
        <button onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"><X size={18}/></button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-500">{group.label}</p>
            <nav className="space-y-1">
              {group.items.map(({ label, icon: Icon }) => {
                const isActive = active === label;
                return (
                  <button 
                    key={label} 
                    onClick={() => { setActive(label); close(); }} 
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold' 
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                    }`}
                  >
                    <Icon size={16} className={`transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}/>
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Profile & Logout Footer (Permanen di Bawah) */}
      <div className="mt-auto pt-4 border-t border-white/[0.04]">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.01] border border-white/[0.03]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              {(user?.name || 'Yoga').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">{user?.name || 'Yoga May Suhendra'}</p>
              <p className="truncate text-[10px] text-slate-500">{user?.email || 'demo@fintrack.local'}</p>
            </div>
          </div>
          <button 
            title="Keluar" 
            onClick={onLogout} 
            className="rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut size={15}/>
          </button>
        </div>
      </div>

    </aside>
  </>;
}