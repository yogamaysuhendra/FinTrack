import React, { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Activity, ChartNoAxesCombined, PieChart as PieChartIcon, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from 'recharts';
import { today, colors } from '../utils/constants';
import { money } from '../utils/helpers';
import Stat from '../components/ui/Stat';
import TransactionTable from '../components/TransactionTable';

export default function Dashboard({ data, totals, onAdd, setActive }) {
  // 1. Grafik bulanan dengan parsing string "YYYY-MM-DD" yang akurat
  const monthly = useMemo(() => { 
    const labels = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']; 
    
    return labels.map((label, i) => {
      const targetMonthNum = i + 1;

      return {
        month: label,
        income: data.transactions.filter(t => {
          if (!t.date || typeof t.date !== 'string') return false;
          const parts = t.date.split('-');
          if (parts.length < 2) return false;
          return parseInt(parts[1], 10) === targetMonthNum && t.type === 'income';
        }).reduce((s, t) => s + t.amount, 0),

        expense: data.transactions.filter(t => {
          if (!t.date || typeof t.date !== 'string') return false;
          const parts = t.date.split('-');
          if (parts.length < 2) return false;
          return parseInt(parts[1], 10) === targetMonthNum && t.type === 'expense';
        }).reduce((s, t) => s + t.amount, 0)
      };
    }); 
  }, [data.transactions]);

  const expenses = data.transactions.filter(t => t.type === 'expense'); 
  const byCategory = Object.entries(expenses.reduce((a, t) => (a[t.category] = (a[t.category] || 0) + t.amount, a), {})).map(([name, value]) => ({ name, value }));

  // 2. Total keseluruhan (untuk Total Saldo & Total Kas)
  const totalIncomeAll = data.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenseAll = data.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const initialWalletsBalance = data.wallets.reduce((s, w) => s + Number(w.balance || 0), 0);
  
  const currentBalance = initialWalletsBalance + totalIncomeAll - totalExpenseAll;

  // 3. Deteksi bulan aktif (menggunakan bulan dari transaksi terakhir atau tanggal sistem)
  const activeMonthPrefix = useMemo(() => {
    if (data.transactions.length > 0) {
      // Ambil tahun-bulan dari transaksi terbaru yang diinput pengguna
      const sorted = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date));
      return sorted[0].date.slice(0, 7); // Contoh: "2026-01" atau "2026-11"
    }
    return today.slice(0, 7);
  }, [data.transactions]);

  const incomeThisMonth = data.transactions
    .filter(t => t.date && t.date.startsWith(activeMonthPrefix) && t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const expenseThisMonth = data.transactions
    .filter(t => t.date && t.date.startsWith(activeMonthPrefix) && t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const netCashFlowThisMonth = incomeThisMonth - expenseThisMonth;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs text-slate-500">{new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date())}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">Ringkasan keuangan</h1>
          <p className="mt-1 text-xs text-slate-400">Berikut gambaran aktivitas keuanganmu secara real-time (Periode: {activeMonthPrefix})</p>
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total saldo" value={money(currentBalance)} icon={Wallet} detail="Akumulasi seluruh dompet & kas bersih"/>
        <Stat title="Pemasukan bulan ini" value={money(incomeThisMonth)} icon={ArrowDownLeft} tone="blue" detail={`Pemasukan periode ${activeMonthPrefix}`}/>
        <Stat title="Pengeluaran bulan ini" value={money(expenseThisMonth)} icon={ArrowUpRight} tone="amber" detail={`Pengeluaran periode ${activeMonthPrefix}`}/>
        <Stat title="Sisa arus kas" value={money(netCashFlowThisMonth)} icon={Activity} tone="purple" detail="Pemasukan dikurangi pengeluaran bulan ini"/>
      </div>

      {/* Grid Grafik */}
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Arus kas tahun ini</h2>
              <p className="mt-1 text-xs text-slate-400">Total pemasukan dan pengeluaran per bulan</p>
            </div>
            <ChartNoAxesCombined className="text-slate-500" size={18}/>
          </div>
          <div className="mt-5 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{top:8,right:8,left:-18,bottom:0}}>
                <defs>
                  <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={.2}/>
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#263647" strokeDasharray="3 5" vertical={false}/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#8290a0',fontSize:10}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:'#8290a0',fontSize:10}} tickFormatter={v=>v===0?'0':`${Math.round(v/1000000)}jt`}/>
                <Tooltip contentStyle={{background:'#101d2a',border:'1px solid #344454',borderRadius:8,color:'#e2e8f0',fontSize:11}} formatter={v=>money(v)}/>
                <Area dataKey="income" name="Pemasukan" stroke="#34d399" fill="url(#inc)" strokeWidth={2.2}/>
                <Area dataKey="expense" name="Pengeluaran" stroke="#60a5fa" fill="transparent" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5 backdrop-blur-xl">
          <div>
            <h2 className="text-sm font-bold text-white">Komposisi pengeluaran</h2>
            <p className="mt-1 text-xs text-slate-400">Berdasarkan kategori keseluruhan</p>
          </div>
          {byCategory.length ? (
            <>
              <div className="relative mx-auto mt-3 h-[190px] max-w-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={58} outerRadius={83} paddingAngle={3} stroke="none">
                      {byCategory.map((x, i) => <Cell key={x.name} fill={colors[i % colors.length]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:'#101d2a',border:'1px solid #344454',borderRadius:8,color:'#e2e8f0',fontSize:11}} formatter={v => money(v)}/>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-slate-500">Total keluar</span>
                  <strong className="mt-1 text-sm text-white">{money(totalExpenseAll)}</strong>
                </div>
              </div>
              <div className="space-y-2 mt-2">
                {byCategory.map((x, i) => (
                  <div key={x.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-400"><i className="h-2 w-2 rounded-full" style={{background:colors[i%colors.length]}}/>{x.name}</span>
                    <b className="font-medium text-slate-200">{money(x.value)}</b>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[230px] flex-col items-center justify-center text-center">
              <PieChartIcon size={25} className="text-slate-600"/>
              <p className="mt-3 text-xs text-slate-400">Belum ada pengeluaran tercatat</p>
            </div>
          )}
        </section>
      </div>

      {/* Tabel Transaksi Terbaru */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">Transaksi terbaru</h2>
            <p className="mt-1 text-[11px] text-slate-400">Aktivitas keuangan terakhir</p>
          </div>
          <button onClick={() => setActive('Transaksi')} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
            Lihat semua →
          </button>
        </div>
        <TransactionTable transactions={[...data.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)} compact/>
      </section>
    </div>
  );
}