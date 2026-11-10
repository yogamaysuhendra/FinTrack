import React from 'react';
import { Plus } from 'lucide-react';

export default function PageTitle({title, subtitle, action}) { 
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      {action && 
        <button onClick={action} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-[#062018]">
          <Plus size={16}/> Catat transaksi
        </button>
      }
    </div>
  ); 
}