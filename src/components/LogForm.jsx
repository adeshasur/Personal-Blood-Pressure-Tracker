import { useState } from 'react';
import { Heart } from 'lucide-react';
import { pressureService } from '../services/api.js';
import { StatusIndicator } from './Common';

export const LogForm = ({ category, onSuccess }) => {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'date' ? value : (value ? parseInt(value) : '')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.systolic || !formData.diastolic || !formData.pulse) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      await pressureService.createReading({
        systolic: formData.systolic,
        diastolic: formData.diastolic,
        pulse: formData.pulse,
        date: formData.date,
        category,
      });

      setMessage({ type: 'success', text: 'Reading recorded successfully!' });
      setFormData(prev => ({ 
        systolic: '', 
        diastolic: '', 
        pulse: '',
        date: prev.date // Keep the selected date for potentially multiple entries
      }));
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to record reading' 
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryTime = {
    Morning: '8:30 AM',
    Afternoon: '2:00 PM',
    Evening: '8:30 PM'
  };

  return (
    <div className="glass-card max-w-md mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{category} Reading</h2>
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-11">Suggested Time: {categoryTime[category]}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Measurement Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Systolic</label>
            <input
              type="number"
              name="systolic"
              value={formData.systolic}
              onChange={handleChange}
              placeholder="120"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Diastolic</label>
            <input
              type="number"
              name="diastolic"
              value={formData.diastolic}
              onChange={handleChange}
              placeholder="80"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Pulse (BPM)</label>
          <input
            type="number"
            name="pulse"
            value={formData.pulse}
            onChange={handleChange}
            placeholder="72"
            className="input-field"
          />
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest animate-fade-in ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            {message.text}
          </div>
        )}

        {formData.systolic && formData.diastolic && (
          <div className="pt-2">
            <StatusIndicator systolic={formData.systolic} diastolic={formData.diastolic} />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-4 !py-4"
        >
          {loading ? 'Recording...' : 'Save Reading'}
        </button>
      </form>
    </div>
  );
};
