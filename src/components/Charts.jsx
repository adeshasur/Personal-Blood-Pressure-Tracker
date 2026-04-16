import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { pressureService } from '../services/api.js';

export const Charts = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await pressureService.getDashboardStats();
      setStats(response.data.map(stat => ({
        date: new Date(stat.date).toLocaleDateString(),
        systolic: Math.round(stat.avg_systolic),
        diastolic: Math.round(stat.avg_diastolic),
        pulse: Math.round(stat.avg_pulse),
      })));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading charts...</div>;
  }

  if (stats.length === 0) {
    return (
      <div className="card-glass text-center py-8">
        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-400">No data available yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Blood Pressure Trend */}
      <div className="card-glass">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Blood Pressure Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} name="Systolic" />
            <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pulse Trend */}
      <div className="card-glass">
        <h3 className="text-lg font-semibold mb-4">Average Pulse</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="pulse" fill="#ec4899" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
