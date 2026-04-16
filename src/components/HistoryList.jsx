import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { pressureService } from '../services/api.js';
import { ReadingCard } from './Common.jsx';

export const HistoryList = ({ refreshTrigger }) => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchReadings();
  }, [refreshTrigger]);

  const fetchReadings = async (pageOffset = 0) => {
    try {
      setLoading(true);
      const response = await pressureService.getReadings(limit, pageOffset);
      setReadings(response.data);
      setOffset(pageOffset);
    } catch (error) {
      console.error('Failed to fetch readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reading?')) return;

    try {
      await pressureService.deleteReading(id);
      setReadings(readings.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete reading:', error);
      alert('Failed to delete reading');
    }
  };

  const handleLoadMore = () => {
    fetchReadings(offset + limit);
  };

  if (loading && readings.length === 0) {
    return <div className="text-center py-8">Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      {readings.length === 0 ? (
        <div className="glass-card text-center py-16 border-dashed border-white/5">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No records found</p>
          <p className="text-slate-600 text-[10px] mt-2 font-medium uppercase tracking-tighter">Your recent measurements will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {readings.map(reading => (
            <div key={reading.id} className="group relative">
              <ReadingCard reading={reading} />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => handleDelete(reading.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4 shadow-sm" />
                </button>
              </div>
            </div>
          ))}
          
          {readings.length >= limit && (
            <div className="col-span-full pt-4">
              <button
                onClick={handleLoadMore}
                className="btn-secondary w-full !py-4"
              >
                Load More History
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
