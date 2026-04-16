import { useState, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { pressureService } from '../services/api';
import { ReadingCard } from './Common';

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
    <div>
      {readings.length === 0 ? (
        <div className="card-glass text-center py-12">
          <p className="text-gray-400">No readings recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {readings.map(reading => (
            <div key={reading.id} className="group relative">
              <ReadingCard reading={reading} />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(reading.id)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {readings.length === limit && (
            <button
              onClick={handleLoadMore}
              className="btn-secondary w-full"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};
