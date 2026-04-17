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
      setMessage({ type: 'error', text: 'Incomplete data. Please check fields.' });
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

      setMessage({ type: 'success', text: 'Reading committed to ledger.' });
      setFormData(prev => ({ 
        systolic: '', 
        diastolic: '', 
        pulse: '',
        date: prev.date 
      }));
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Transmission failure.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryTime = {
    Morning: '08:30',
    Afternoon: '14:00',
    Evening: '20:30'
  };

  return (
    <div className="modern-card max-w-md mx-auto animate-modern-fade">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 border border-white/20 text-white">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{category} LOG</h2>
        </div>
        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] ml-14">REF TIME: {categoryTime[category]}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Log Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Systolic</label>
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
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Diastolic</label>
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
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Pulse (Rate)</label>
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
          <div className={`p-4 text-[10px] font-black uppercase tracking-widest animate-modern-fade border ${
            message.type === 'success' 
              ? 'bg-white text-black border-white' 
              : 'bg-black text-white border-white/20'
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
          className="btn-primary w-full mt-6"
        >
          {loading ? 'Processing...' : 'Commit Reading'}
        </button>
      </form>
    </div>
  );
};
