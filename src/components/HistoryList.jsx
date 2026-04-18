import { useState, useEffect } from 'react';
import { Trash2, CalendarDays, AlertCircle } from 'lucide-react';
import { pressureService } from '../services/api.js';

// ── Status helpers ──────────────────────────────────────────────────────────
const getStatus = (systolic, diastolic) => {
  if (systolic >= 180 || diastolic >= 120) return 'crisis';
  if (systolic >= 140 || diastolic >= 90)  return 'high';
  if (systolic >= 130)                      return 'elevated';
  return 'normal';
};

const STATUS_META = {
  normal:   { label: 'Normal',   bg: 'bg-white/5',      text: 'text-slate-300',  badge: 'bg-white/10 text-white'           },
  elevated: { label: 'Elevated', bg: 'bg-amber-500/5',  text: 'text-amber-200',  badge: 'bg-amber-500/20 text-amber-400'   },
  high:     { label: 'High',     bg: 'bg-orange-500/5', text: 'text-orange-200', badge: 'bg-orange-500/20 text-orange-400' },
  crisis:   { label: 'Crisis',   bg: 'bg-red-500/8',    text: 'text-red-200',    badge: 'bg-red-500/20 text-red-400'       },
};

// The 3 fixed daily time slots in display order
const DAILY_SLOTS = [
  { category: 'Morning',   time: '08:30' },
  { category: 'Afternoon', time: '14:00' },
  { category: 'Evening',   time: '20:30' },
];

// Format date like "Apr 16, 2026 · Wednesday"
const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  const day  = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const week = d.toLocaleDateString('en-US', { weekday: 'long' });
  return { day, week };
};

// ── SlotRow ─────────────────────────────────────────────────────────────────
const SlotRow = ({ slot, reading, onDelete }) => {
  const isEmpty = !reading;
  const status  = isEmpty ? null : getStatus(reading.systolic, reading.diastolic);
  const meta    = isEmpty ? null : STATUS_META[status];

  if (isEmpty) {
    return (
      <div className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0 opacity-30">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest w-20">
          {slot.category}
        </span>
        <span className="text-[9px] font-bold text-slate-700 tracking-widest w-12">{slot.time}</span>
        <div className="flex items-center gap-2 ml-2">
          <AlertCircle className="w-3 h-3 text-slate-700" />
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
            No Record Found
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 transition-colors ${meta.bg}`}>
      {/* Category + time */}
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-20">
        {slot.category}
      </span>
      <span className="text-[9px] font-bold text-slate-600 tracking-widest w-12">{slot.time}</span>

      {/* BP value */}
      <div className="flex items-baseline gap-1 flex-1">
        <span className={`text-xl font-black tracking-tighter ${meta.text}`}>
          {reading.systolic}
          <span className="text-slate-700 mx-0.5">/</span>
          {reading.diastolic}
        </span>
        <span className="text-[9px] font-black text-slate-700 ml-0.5 uppercase">mmHg</span>
      </div>

      {/* Pulse */}
      <span className="text-[10px] text-slate-600 font-bold w-16 text-right">
        {reading.pulse} <span className="text-slate-700">bpm</span>
      </span>

      {/* Status badge */}
      <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 ${meta.badge} w-20 text-center`}>
        {meta.label}
      </span>

      {/* Delete (appears on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button
          onClick={() => onDelete(reading.id)}
          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors"
          title="Delete Record"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── DayBlock ─────────────────────────────────────────────────────────────────
const DayBlock = ({ dateStr, readings, onDelete }) => {
  const { day, week } = formatDate(dateStr);
  const readingsByCategory = {};
  for (const r of readings) readingsByCategory[r.category] = r;

  // Determine the worst status across readings for the day border accent
  const statuses = readings.map(r => getStatus(r.systolic, r.diastolic));
  const priority = ['crisis', 'high', 'elevated', 'normal'];
  const worstStatus = priority.find(s => statuses.includes(s)) || 'normal';

  const accentColor = {
    normal:   'border-l-white/20',
    elevated: 'border-l-amber-500/40',
    high:     'border-l-orange-500/50',
    crisis:   'border-l-red-500/70',
  }[worstStatus];

  return (
    <div className={`modern-card !p-0 overflow-hidden border-l-2 ${accentColor} animate-modern-fade`}>
      {/* Date header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="p-1.5 border border-white/10">
          <CalendarDays className="w-4 h-4 text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-black text-white tracking-tight">{day}</p>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">{week}</p>
        </div>
        <div className="ml-auto text-[9px] font-black text-slate-700 uppercase tracking-widest">
          {readings.length}/3 readings
        </div>
      </div>

      {/* Slot rows */}
      <div>
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
  const [history, setHistory] = useState([]);   // [{ date, readings[] }]
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
      console.error('Failed to fetch history:', err);
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reading?')) return;
    try {
      await pressureService.deleteReading(id);
      // Optimistic update: remove from state
      setHistory(prev =>
        prev
          .map(day => ({ ...day, readings: day.readings.filter(r => r.id !== id) }))
          .filter(day => day.readings.length > 0)
      );
    } catch (err) {
      console.error('Failed to delete reading:', err);
      alert('Delete failed. Please retry.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="modern-card !p-0 overflow-hidden animate-pulse">
            <div className="h-14 bg-white/[0.03] border-b border-white/5" />
            {[1, 2, 3].map(j => (
              <div key={j} className="h-12 border-b border-white/5 bg-transparent" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-card text-center py-12 border-red-500/20 border-l-2 border-l-red-500/50">
        <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-3" />
        <p className="text-red-400 font-black uppercase tracking-widest text-sm">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="modern-card text-center py-16 border-dashed border-white/5">
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No records found</p>
        <p className="text-slate-600 text-[10px] mt-2 font-medium uppercase tracking-tighter">
          Your measurements will appear here after your first log
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
