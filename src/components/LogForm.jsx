import { useState } from 'react';
import { pressureService } from '../services/api.js';
import { Coffee, Sunset, Moon, CheckCircle2 } from 'lucide-react';

export const LogForm = ({ onReadingsUpdate }) => {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
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
        diastolic: parseInt(formData.diastolic)
      });
      onReadingsUpdate();
      setLastSaved(true);
      setTimeout(() => setLastSaved(false), 3000);
      setFormData({ ...formData, systolic: '', diastolic: '' });
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'Morning', icon: Coffee },
    { id: 'Evening', icon: Sunset },
    { id: 'Night',   icon: Moon }
  ];

  return (
    <div className="modern-card !p-8 border-[#F1F1F1] shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phase Selector */}
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
              className="input-field h-[72px] !text-[15px] !font-black !tracking-tighter"
            />
          </div>
        </div>

        {/* Main Inputs */}
        <div className="grid grid-cols-2 gap-8 border-t border-[#F5F5F5] pt-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] ml-1">Systolic</label>
            <div className="relative">
              <input
                required
                type="number"
                placeholder="000"
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                className="input-field h-20 text-3xl font-black pr-20"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#DDDDDD] uppercase">mmHg</span>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] ml-1">Diastolic</label>
            <div className="relative">
              <input
                required
                type="number"
                placeholder="000"
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                className="input-field h-20 text-3xl font-black pr-20"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#DDDDDD] uppercase">mmHg</span>
            </div>
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
 Riverside
