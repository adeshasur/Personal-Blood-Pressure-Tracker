import { useEffect, useState } from 'react';
import { Heart, Zap, TrendingUp, Calendar } from 'lucide-react';
import { pressureService } from '../services/api';
import { StatBox } from './Common';

export const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, latestRes] = await Promise.all([
        pressureService.getDashboardStats(),
        pressureService.getLatestReadings(),
      ]);

      setStats(statsRes.data);
      setLatest(latestRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayData = stats.find(s => s.date === today) || {};
  const avgSystolic = Math.round(todayData.avg_systolic || 0);
  const avgDiastolic = Math.round(todayData.avg_diastolic || 0);
  const avgPulse = Math.round(todayData.avg_pulse || 0);

  const morningReading = latest.find(r => r.category === 'Morning');
  const afternoonReading = latest.find(r => r.category === 'Afternoon');
  const eveningReading = latest.find(r => r.category === 'Evening');

  return (
    <div className="space-y-8">
      {/* Today's Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Today's Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox
            label="Avg Systolic"
            value={avgSystolic}
            unit="mmHg"
            icon={TrendingUp}
            color="blue"
          />
          <StatBox
            label="Avg Diastolic"
            value={avgDiastolic}
            unit="mmHg"
            icon={TrendingUp}
            color="green"
          />
          <StatBox
            label="Avg Pulse"
            value={avgPulse}
            unit="BPM"
            icon={Heart}
            color="pink"
          />
        </div>
      </div>

      {/* Daily Schedule Status */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Today's Log Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Morning */}
          <div className="card-glass">
            <p className="text-sm text-gray-400 mb-2">Morning (8:30 AM)</p>
            {morningReading ? (
              <div>
                <p className="text-2xl font-bold">{morningReading.systolic}/{morningReading.diastolic}</p>
                <p className="text-xs text-gray-400 mt-1">✓ Logged</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-2xl font-bold opacity-50">--/--</p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
            )}
          </div>

          {/* Afternoon */}
          <div className="card-glass">
            <p className="text-sm text-gray-400 mb-2">Afternoon (2:00 PM)</p>
            {afternoonReading ? (
              <div>
                <p className="text-2xl font-bold">{afternoonReading.systolic}/{afternoonReading.diastolic}</p>
                <p className="text-xs text-gray-400 mt-1">✓ Logged</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-2xl font-bold opacity-50">--/--</p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
            )}
          </div>

          {/* Evening */}
          <div className="card-glass">
            <p className="text-sm text-gray-400 mb-2">Evening (8:30 PM)</p>
            {eveningReading ? (
              <div>
                <p className="text-2xl font-bold">{eveningReading.systolic}/{eveningReading.diastolic}</p>
                <p className="text-xs text-gray-400 mt-1">✓ Logged</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-2xl font-bold opacity-50">--/--</p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
