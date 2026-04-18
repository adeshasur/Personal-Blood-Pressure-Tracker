import { Heart, Activity, Clock } from 'lucide-react';
import { getBPStatus } from '../utils/health.js';

export const StatusIndicator = ({ systolic, diastolic }) => {
  const status = getBPStatus(systolic, diastolic);

  return (
    <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${status.badge} shadow-sm transition-all duration-300`}>
      {status.label}
    </div>
  );
};

export const ReadingCard = ({ reading }) => {
  const status = getBPStatus(reading.systolic, reading.diastolic);
  
  return (
    <div className={`modern-card ${status.color.replace('bg-', 'bg-opacity-30 bg-')}`}>
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#999999]">
            <div className="p-1 px-3 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#F1F1F1] text-[#111111]">
              {reading.category}
            </div>
            <span className="text-[11px] font-bold opacity-60">
              {new Date(reading.date || reading.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-6xl font-extrabold text-[#111111] tracking-tighter">
              {reading.systolic}
              <span className="text-[#DDDDDD] mx-1 font-light">/</span>
              {reading.diastolic}
            </span>
            <span className="text-[12px] font-black text-[#AAAAAA] ml-1 uppercase leading-none">mmHg</span>
          </div>
        </div>
        <StatusIndicator systolic={reading.systolic} diastolic={reading.diastolic} />
      </div>
      
      <div className="flex items-center justify-between pt-7 border-t border-[#F1F1F1]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-2xl text-[#111111] border border-[#F1F1F1] shadow-sm">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div>
            <p className="text-xl font-black text-[#111111] leading-none tracking-tighter">{reading.pulse}</p>
            <p className="text-[9px] text-[#999999] font-black uppercase tracking-[0.15em] mt-1">Pulse BPM</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-30 text-[#111111]">
           <Clock className="w-4 h-4" />
           <span className="text-[10px] font-black tracking-widest">RECORDED</span>
        </div>
      </div>
    </div>
  );
};

export const StatBox = ({ label, value, unit, icon: Icon }) => {
  return (
    <div className="modern-card group border-none shadow-[0_4px_25px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_50px_rgb(0,0,0,0.06)] bg-[#FAFAFA] transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="p-4 bg-white rounded-2xl text-[#111111] border border-[#EEEEEE] transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black/5">
          {Icon ? <Icon className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
        </div>
        <span className="text-[9px] font-black text-[#999999] bg-white px-3 py-1.5 rounded-full border border-[#F1F1F1] tracking-widest uppercase">DAILY AVG</span>
      </div>
      <div>
        <p className="text-[11px] font-black text-[#999999] uppercase tracking-[0.2em] mb-3">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-[#111111] tracking-tighter">{Math.round(value || 0)}</span>
          <span className="text-[13px] font-black text-[#BBBBBB] uppercase tracking-tighter">{unit}</span>
        </div>
      </div>
    </div>
  );
};
