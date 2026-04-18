import { Heart, Activity, Clock } from 'lucide-react';

export const StatusIndicator = ({ systolic, diastolic }) => {
  const getStatus = () => {
    if (systolic >= 180 || diastolic >= 120) return { label: 'Crisis', color: 'bg-red-50 text-red-600 border-red-100' };
    if (systolic >= 140 || diastolic >= 90) return { label: 'High', color: 'bg-orange-50 text-orange-600 border-orange-100' };
    if (systolic >= 130 && systolic < 140) return { label: 'Elevated', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: 'Normal', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  const status = getStatus();

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
      {status.label}
    </div>
  );
};

export const ReadingCard = ({ reading }) => {
  return (
    <div className="modern-card">
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#999999]">
            <div className="p-1 px-2 bg-[#FAFAFA] rounded-md text-[9px] font-bold uppercase tracking-widest border border-[#F1F1F1]">
              {reading.category}
            </div>
            <span className="text-[10px] font-medium opacity-60">
              {new Date(reading.date || reading.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-extrabold text-[#111111] tracking-tighter">
              {reading.systolic}
              <span className="text-[#DDDDDD] mx-1 font-light">/</span>
              {reading.diastolic}
            </span>
            <span className="text-[11px] font-bold text-[#AAAAAA] ml-1 uppercase">mmHg</span>
          </div>
        </div>
        <StatusIndicator systolic={reading.systolic} diastolic={reading.diastolic} />
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-[#F1F1F1]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FAFAFA] rounded-xl text-[#111111] border border-[#F1F1F1]">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <p className="text-base font-extrabold text-[#111111] leading-none">{reading.pulse}</p>
            <p className="text-[10px] text-[#AAAAAA] font-bold uppercase tracking-wider mt-0.5">Pulse BPM</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-40">
           <Clock className="w-3.5 h-3.5" />
           <span className="text-[10px] font-bold">08:30 AM</span>
        </div>
      </div>
    </div>
  );
};

export const StatBox = ({ label, value, unit, icon: Icon }) => {
  return (
    <div className="modern-card group border-none shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.05)] bg-[#FAFAFA]">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white rounded-2xl text-[#111111] border border-[#EEEEEE] group-hover:scale-110 transition-transform duration-500">
          {Icon ? <Icon className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
        </div>
        <span className="text-[10px] font-bold text-[#CCCCCC] bg-white px-2 py-1 rounded-lg border border-[#F1F1F1]">DAILY AVG</span>
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#999999] uppercase tracking-widest mb-1.5">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold text-[#111111] tracking-tight">{Math.round(value || 0)}</span>
          <span className="text-[11px] font-bold text-[#AAAAAA] uppercase tracking-tighter">{unit}</span>
        </div>
      </div>
    </div>
  );
};
