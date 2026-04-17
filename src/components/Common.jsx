import { Heart, Activity, Clock } from 'lucide-react';

export const StatusIndicator = ({ systolic, diastolic }) => {
  const getStatus = () => {
    if (systolic >= 180 || diastolic >= 120) return { label: 'Crisis' };
    if (systolic >= 140 || diastolic >= 90) return { label: 'High' };
    if (systolic >= 130 && systolic < 140) return { label: 'Elevated' };
    return { label: 'Normal' };
  };

  const status = getStatus();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.1em] animate-modern-fade">
      <span>{status.label}</span>
    </div>
  );
};

export const ReadingCard = ({ reading }) => {
  return (
    <div className="modern-card animate-modern-fade">
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{reading.category}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">
              {reading.systolic}
              <span className="text-slate-700 mx-1">/</span>
              {reading.diastolic}
            </span>
            <span className="text-[10px] font-black text-slate-600 ml-1 uppercase">mmHg</span>
          </div>
        </div>
        <StatusIndicator systolic={reading.systolic} diastolic={reading.diastolic} />
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="text-white">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-white leading-none">{reading.pulse}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">BPM</p>
          </div>
        </div>
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">
          {new Date(reading.date || reading.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export const StatBox = ({ label, value, unit, icon: Icon }) => {
  return (
    <div className="modern-card flex items-center gap-6 group">
      <div className="p-4 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
        {Icon ? <Icon className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 truncate">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-white group-hover:text-white/80 transition-colors">{Math.round(value || 0)}</span>
          <span className="text-[10px] font-black text-slate-600 uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
};
