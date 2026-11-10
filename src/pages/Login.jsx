import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { defaultData, STORE_KEY } from '../utils/constants';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('demo@fintrack.local');
  const [password, setPassword] = useState('fintrack123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name: 'Yoga May Suhendra', email };
    onLogin(userData);
  };

  const handleDemoFill = () => {
    setEmail('demo@fintrack.local');
    setPassword('fintrack123');
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#0b111a] text-slate-200 selection:bg-emerald-500 selection:text-black font-sans">
      
      {/* Sisi Kiri: Branding & Informasi (Minimalist Dark) */}
      <div className="flex flex-col justify-between p-8 lg:w-[45%] lg:p-16 border-b lg:border-b-0 lg:border-r border-[#1a2332] bg-[#070c14]">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-black font-black text-lg">
            F.
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FinTrack</span>
        </div>

        {/* Hero Copy */}
        <div className="my-auto py-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.1]">
            Kendalikan <br />
            arus kas Anda.
          </h1>
          <p className="mt-6 text-sm text-slate-400 max-w-md leading-relaxed">
            Platform pencatatan finansial terintegrasi untuk melacak pemasukan, pengeluaran, dan memantau target anggaran secara presisi.
          </p>

          {/* Feature List (Clean) */}
          <div className="mt-12 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#131e2d] text-[10px] font-bold text-emerald-400">01</div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Catat Transaksi</p>
                <p className="text-xs text-slate-500 mt-1">Rekam setiap mutasi keuangan dengan cepat.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#131e2d] text-[10px] font-bold text-emerald-400">02</div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Pantau Anggaran</p>
                <p className="text-xs text-slate-500 mt-1">Alokasikan dana dan cegah pengeluaran berlebih.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] font-medium text-slate-600 tracking-wide uppercase">
          Proyek Sistem Informasi Akademik &copy; 2026
        </div>
      </div>

      {/* Sisi Kanan: Form Login (Solid & Flat) */}
      <div className="flex flex-col justify-center p-8 lg:w-[55%] lg:p-16 bg-[#0b111a]">
        <div className="mx-auto w-full max-w-[380px] space-y-10">
          
          {/* Header Form */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Masuk</h2>
            <p className="mt-2 text-sm text-slate-400">Akses dashboard finansial Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Alamat Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full rounded-lg border border-[#1e293b] bg-[#0f1724] px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-[#131d2b] focus:outline-none transition-colors"
                placeholder="nama@email.com"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kata Sandi
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="w-full rounded-lg border border-[#1e293b] bg-[#0f1724] px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-[#131d2b] focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button 
              type="submit"
              className="group w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3.5 text-sm font-bold text-[#02100b] hover:bg-emerald-400 transition-colors"
            >
              Masuk ke Akun <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Kotak Akun Demo (Clean) */}
          <div className="rounded-lg border border-[#1e293b] bg-[#0d131f] p-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Kredensial Demo</span>
                <p className="text-sm font-mono text-slate-300">demo@fintrack.local</p>
                <p className="text-sm font-mono text-slate-300 mt-1">fintrack123</p>
              </div>
              <button 
                type="button" 
                onClick={handleDemoFill}
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-md"
              >
                Isi Otomatis
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}