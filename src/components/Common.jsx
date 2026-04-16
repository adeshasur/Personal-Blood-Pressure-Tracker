import { Heart, Activity, Clock } from 'lucide-react';

export const StatusIndicator = ({ systolic, diastolic }) => {
  const getStatus = () => {
    if (systolic >= 180 || diastolic >= 120) return { label: 'Crisis', color: 'text-rose-500', bg: 'bg-rose-500/20', border: 'border-rose-500/30' };
    if (systolic >= 140 || diastolic >= 90) return { label: 'High', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
    if (systolic >= 130 && systolic < 140) return { label: 'Elevated', color: 'text-amber-500', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
    return { label: 'Normal', color: 'text-emerald-500', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
  };

  const status = getStatus();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} border ${status.border} ${status.color} animate-fade-in`}>
      <div className={`w-1.5 h-1.5 rounded-full fill-current ${status.color} bg-current`} />
      <span className="text-xs font-bold tracking-wide uppercase">{status.label}</span>
    </div>
  );
};

export const ReadingCard = ({ reading }) => {
  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">{reading.category}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">
              {reading.systolic}
              <span className="text-slate-500 mx-1">/</span>
              {reading.diastolic}
            </span>
            <span className="text-xs font-bold text-slate-500 ml-1 uppercase">mmHg</span>
          </div>
        </div>
        <StatusIndicator systolic={reading.systolic} diastolic={reading.diastolic} />
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">{reading.pulse}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase">BPM</p>
          </div>
        </div>
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
          {new Date(reading.date || reading.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export const StatBox = ({ label, value, unit, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    pink: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  return (
    <div className="glass-card flex items-center gap-5">
      <div className={`p-4 rounded-2xl border ${colors[color]} shrink-0`}>
        {Icon ? <Icon className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 truncate">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">{Math.round(value || 0)}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
};
