import { useState, useEffect } from 'react';
import { Trash2, CalendarDays, AlertCircle } from 'lucide-react';
import { pressureService } from '../services/api.js';
import { getBPStatus } from '../utils/health.js';

const DAILY_SLOTS = [
  { category: 'Morning', time: '08:30' },
  { category: 'Eve',     time: '18:30' },
  { category: 'Night',   time: '22:30' },
];

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  const day  = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const week = d.toLocaleDateString('en-US', { weekday: 'long' });
  return { day, week };
};

// ── SlotRow ─────────────────────────────────────────────────────────────────
const SlotRow = ({ slot, reading, onDelete }) => {
  const isEmpty = !reading;
  const status  = isEmpty ? null : getBPStatus(reading.systolic, reading.diastolic);

  if (isEmpty) {
    return (
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#F5F5F5] last:border-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[#EEEEEE]" />
        <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider w-20">
          {slot.category}
        </span>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[10px] font-bold text-[#EEEEEE] uppercase tracking-[0.2em] border border-dashed border-[#EEEEEE] px-3 py-1 rounded-lg">
            No Record
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#EEEEEE] tracking-tight">{slot.time}</span>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-4 px-6 py-4 border-b border-[#F5F5F5] last:border-0 transition-all ${status.color}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status.badge.split(' ')[1].replace('text-', 'bg-')}`} />
      
      <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider w-20">
        {slot.category}
      </span>

      <div className="flex items-baseline gap-1.5 flex-1">
        <span className={`text-2xl font-extrabold tracking-tighter ${status.badge.split(' ')[1]}`}>
          {reading.systolic}
          <span className="text-[#DDDDDD] mx-0.5 font-light">/</span>
          {reading.diastolic}
        </span>
        <span className="text-[10px] font-bold text-[#BBBBBB] uppercase">mmHg</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[11px] text-[#999999] font-bold text-right">
          {reading.pulse} <span className="opacity-50">bpm</span>
        </span>
        
        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${status.badge} w-32 text-center shadow-sm`}>
          {status.label}
        </span>

        <div className="opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onDelete(reading.id)}
            className="p-2 rounded-xl bg-white hover:bg-red-50 text-[#CCCCCC] hover:text-red-500 border border-[#F1F1F1] hover:border-red-100 transition-all shadow-sm"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── DayBlock ─────────────────────────────────────────────────────────────────
const DayBlock = ({ dateStr, readings, onDelete }) => {
  const { day, week } = formatDate(dateStr);
  const readingsByCategory = {};
  for (const r of readings) readingsByCategory[r.category] = r;

  return (
    <div className="modern-card !p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F1F1F1] bg-[#FAFAFA]/50">
        <div className="p-2.5 bg-white border border-[#F1F1F1] rounded-2xl shadow-sm text-[#111111]">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <p className="text-base font-extrabold text-[#111111] tracking-tight">{day}</p>
          <p className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">{week}</p>
        </div>
        <div className="ml-auto text-[10px] font-black text-[#DDDDDD] uppercase tracking-[0.2em] bg-white px-3 py-1.5 rounded-full border border-[#F1F1F1]">
          {readings.length}/3 ENTRIES
        </div>
      </div>

      <div className="bg-white">
        {DAILY_SLOTS.map(slot => (
          <SlotRow
            key={slot.category}
            slot={slot}
            reading={readingsByCategory[slot.category] || null}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

// ── HistoryList (main export) ─────────────────────────────────────────────────
export const HistoryList = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pressureService.getHistory();
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Connection failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirm deletion of this record?')) return;
    try {
      await pressureService.deleteReading(id);
      setHistory(prev =>
        prev
          .map(day => ({ ...day, readings: day.readings.filter(r => r.id !== id) }))
          .filter(day => day.readings.length > 0)
      );
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="modern-card !p-0 overflow-hidden animate-pulse">
            <div className="h-16 bg-[#FAFAFA] border-b border-[#F1F1F1]" />
            {[1, 2, 3].map(j => (
              <div key={j} className="h-14 border-b border-[#F1F1F1]" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-card text-center py-16 bg-red-50/30 border-red-100">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 font-extrabold uppercase tracking-widest text-xs">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="modern-card text-center py-24 border-dashed bg-[#FAFAFA]/30">
        <p className="text-[#AAAAAA] font-extrabold uppercase tracking-widest text-xs">No entries recorded</p>
        <p className="text-[#999999] text-[11px] mt-2 font-bold uppercase">Begin logging to populate your clinical history</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {history.map(({ date, readings }) => (
        <DayBlock
          key={date}
          dateStr={date}
          readings={readings}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
