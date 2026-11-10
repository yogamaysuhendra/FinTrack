import React from 'react';

export default function Stat({ title, value, icon: Icon, tone='green', detail }) { 
  const tones = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
  }; 
  
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.15] hover:shadow-lg hover:shadow-black/40">
      {/* Efek kilau halus di sudut atas saat kursor mendekat */}
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl transition-all group-hover:bg-emerald-500/10" />
      
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-slate-400">{title}</p>
        <div className={`grid h-10 w-10 place-items-center rounded-xl border ${tones[tone]} shadow-sm`}>
          <Icon size={18}/>
        </div>
      </div>
      
      <p className="mt-4 text-[clamp(1.2rem,2vw,1.6rem)] font-bold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-[11px] text-slate-500">{detail}</p>
    </div>
  ); 
}