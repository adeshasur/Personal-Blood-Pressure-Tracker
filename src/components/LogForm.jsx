import { useState } from 'react';
import { Heart } from 'lucide-react';
import { pressureService } from '../services/api';
import { StatusIndicator } from './Common';

export const LogForm = ({ category, onSuccess }) => {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseInt(value) : ''
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
        category,
      });

      setMessage({ type: 'success', text: 'Reading recorded successfully!' });
      setFormData({ systolic: '', diastolic: '', pulse: '' });
      
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
    <div className="card-glass max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{category} Reading</h2>
        <p className="text-gray-400 text-sm mt-1">~{categoryTime[category]}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Systolic (Top)</label>
          <input
            type="number"
            name="systolic"
            value={formData.systolic}
            onChange={handleChange}
            placeholder="120"
            min="0"
            max="300"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Diastolic (Bottom)</label>
          <input
            type="number"
            name="diastolic"
            value={formData.diastolic}
            onChange={handleChange}
            placeholder="80"
            min="0"
            max="300"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Pulse (BPM)</label>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <input
              type="number"
              name="pulse"
              value={formData.pulse}
              onChange={handleChange}
              placeholder="72"
              min="0"
              max="200"
              className="input-field flex-1"
            />
          </div>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border border-red-500/30 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {formData.systolic && formData.diastolic && (
          <div className="pt-2 pb-4">
            <StatusIndicator systolic={formData.systolic} diastolic={formData.diastolic} />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Recording...' : 'Record Reading'}
        </button>
      </form>
    </div>
  );
};
