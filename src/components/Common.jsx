import { getBPStatus } from '../utils/health';

export const StatBox = ({ label, value, unit, icon: Icon }) => (
  <div className="modern-card">
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] flex items-center justify-center border border-[#F1F1F1]">
        <Icon className="w-4 h-4 text-[#111111]" />
      </div>
      <span className="text-[10px] font-black text-[#BBBBBB] uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-3xl font-black text-[#111111] tracking-tighter">
        {typeof value === 'number' ? Math.round(value) : '--'}
      </span>
      <span className="text-[10px] font-black text-[#DDDDDD] uppercase tracking-widest">{unit}</span>
    </div>
  </div>
);

export const HistoryItem = ({ reading }) => {
  const status = getBPStatus(reading.systolic, reading.diastolic);
  
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-[#F1F1F1] rounded-2xl hover:border-[#111111] transition-all group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-[#111111] uppercase tracking-[0.2em]">
            {reading.category}
          </span>
          <span className="text-[8px] font-bold text-[#CCCCCC] uppercase tracking-widest">
            {new Date(reading.date).toLocaleDateString(undefined, { weekday: 'short' })}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-[#111111] tracking-tighter">
            {reading.systolic}<span className="text-[#DDDDDD] font-light mx-0.5">/</span>{reading.diastolic}
          </span>
        </div>
      </div>
      <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${status.badge}`}>
        {status.label.split(' ')[0]}
      </div>
    </div>
  );
};

export const StatusIndicator = ({ systolic, diastolic }) => {
  const status = getBPStatus(systolic, diastolic);
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.badge}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
      <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
    </div>
  );
};
