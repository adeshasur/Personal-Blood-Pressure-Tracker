import { useState } from 'react';
import { pressureService } from '../services/api.js';
import { Coffee, Sunset, Moon, CheckCircle2 } from 'lucide-react';

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
    { id: 'Morning', icon: Coffee,  time: '08:30 AM' },
    { id: 'Evening', icon: Sunset,  time: '18:30 PM' },
    { id: 'Night',   icon: Moon,    time: '22:30 PM' }
  ];

  return (
    <div className="modern-card shadow-[0_20px_60px_rgb(0,0,0,0.04)] border-none">
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Category Selector */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] ml-1">Phase</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.id })}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
                  formData.category === cat.id
                    ? 'bg-[#111111] border-[#111111] text-white shadow-xl scale-[1.02]'
                    : 'bg-[#FAFAFA] border-[#F1F1F1] text-[#AAAAAA] hover:border-[#CCCCCC]'
                }`}
              >
                <cat.icon className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] ml-1">Archive Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input-field !text-[15px] !font-black !tracking-tighter"
          />
        </div>

        {/* Main Inputs Row */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] ml-1">Sys</label>
            <div className="relative">
              <input
                required
                type="number"
                placeholder="000"
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                className="input-field text-2xl font-black pr-14"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#DDDDDD] uppercase">mmHg</span>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] ml-1">Dia</label>
            <div className="relative">
              <input
                required
                type="number"
                placeholder="000"
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                className="input-field text-2xl font-black pr-14"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#DDDDDD] uppercase">mmHg</span>
            </div>
          </div>
        </div>

        {/* Pulse Input */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] ml-1">Biometric Pulse</label>
          <div className="relative">
            <input
              required
              type="number"
              placeholder="00"
              value={formData.pulse}
              onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
              className="input-field text-2xl font-black pr-14"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#DDDDDD] uppercase">BPM</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-6 flex items-center justify-center gap-4 active:scale-95 transition-all text-[15px] font-black uppercase tracking-[0.15em] shadow-2xl shadow-black/10"
        >
          {loading ? 'Processing...' : lastSaved ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Capture Successful
            </>
          ) : 'Submit Entry'}
        </button>
      </form>
    </div>
  );
};
