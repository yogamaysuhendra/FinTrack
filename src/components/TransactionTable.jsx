import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import { money } from '../utils/helpers';

export default function TransactionTable({ transactions, onEdit, onDelete, compact }) {
  // Fungsi helper untuk mengubah format "YYYY-MM-DD" menjadi "DD-MM-YYYY"
  const formatDateID = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // Urutan: Tanggal - Bulan - Tahun
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <p className="text-xs text-slate-400">Belum ada data transaksi yang tercatat.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        {!compact && (
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] font-medium text-slate-400">
              <th className="py-3 px-5">TRANSAKSI</th>
              <th className="py-3 px-5">KATEGORI & DOMPET</th>
              <th className="py-3 px-5">TANGGAL</th>
              <th className="py-3 px-5 text-right">JUMLAH</th>
              {!compact && <th className="py-3 px-5 text-right">AKSI</th>}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-white/[0.04]">
          {transactions.map((t) => {
            const isIncome = t.type === 'income';
            return (
              <tr key={t.id || Math.random()} className="hover:bg-white/[0.02] transition">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-8 w-8 place-items-center rounded-xl ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {isIncome ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                    </div>
                    <div>
                      <strong className="font-semibold text-white block">{t.title}</strong>
                      <span className="text-[10px] text-slate-500 capitalize">{t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>
                    </div>
                  </div>
                </td>
                
                <td className="py-3.5 px-5">
                  <span className="font-medium text-slate-300 block">{t.category}</span>
                  <span className="text-[10px] text-slate-500">{t.wallet}</span>
                </td>

                {/* Tanggal yang sudah diubah formatnya menjadi DD-MM-YYYY */}
                <td className="py-3.5 px-5 font-mono text-slate-300">
                  {formatDateID(t.date)}
                </td>

                <td className={`py-3.5 px-5 text-right font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isIncome ? `+${money(t.amount)}` : `-${money(t.amount)}`}
                </td>

                {!compact && (
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(t)} 
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                          title="Edit"
                        >
                          <Edit2 size={14}/>
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(t.id)} 
                          className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/10 transition"
                          title="Hapus"
                        >
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}