import { useState } from 'react';
import { pressureService } from '../services/api.js';
import { Coffee, Sun, Moon, CheckCircle2 } from 'lucide-react';

export const LogForm = ({ onReadingsUpdate }) => {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    category: 'Morning',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pressureService.createReading({
        ...formData,
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic),
        pulse: parseInt(formData.pulse)
      });
      onReadingsUpdate();
      setLastSaved(true);
      setTimeout(() => setLastSaved(false), 3000);
      setFormData({ ...formData, systolic: '', diastolic: '', pulse: '' });
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'Morning', icon: Coffee, time: '08:30 AM' },
    { id: 'Afternoon', icon: Sun, time: '02:00 PM' },
    { id: 'Evening', icon: Moon, time: '08:30 PM' }
  ];

  return (
    <div className="modern-card shadow-[0_20px_50px_rgb(0,0,0,0.03)] border-none">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Category Selector */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest ml-1">Measurement Phase</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.id })}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                  formData.category === cat.id
                    ? 'bg-[#111111] border-[#111111] text-white shadow-lg'
                    : 'bg-[#FAFAFA] border-[#F1F1F1] text-[#999999] hover:border-[#DDDDDD]'
                }`}
              >
                <cat.icon className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase tracking-tighter">{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest ml-1">Log Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input-field !text-sm !font-bold"
          />
        </div>

        {/* Main Inputs Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest ml-1">Systolic</label>
            <div className="relative">
              <input
                required
                type="number"
                placeholder="120"
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                className="input-field text-xl font-extrabold pr-12"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#CCCCCC]">SYS</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest ml-1">Diastolic</label>
            <div className="relative">
              <input
                required
                type="number"
                placeholder="80"
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                className="input-field text-xl font-extrabold pr-12"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#CCCCCC]">DIA</span>
            </div>
          </div>
        </div>

        {/* Pulse Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest ml-1">Heart Pulse</label>
          <div className="relative">
            <input
              required
              type="number"
              placeholder="72"
              value={formData.pulse}
              onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
              className="input-field text-xl font-extrabold pr-12"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#CCCCCC]">BPM</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-5 flex items-center justify-center gap-3 active:scale-95 transition-all text-base font-bold shadow-xl shadow-black/10"
        >
          {loading ? 'Processing...' : lastSaved ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Saved Successfully
            </>
          ) : 'Complete Entry'}
        </button>
      </form>
    </div>
  );
};
