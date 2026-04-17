import { useEffect, useState } from 'react';
import { Heart, Activity, TrendingUp, Calendar } from 'lucide-react';
import { pressureService } from '../services/api.js';
import { StatBox } from './Common.jsx';

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
    return <div className="text-center py-24 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Initializing Dashboard...</div>;
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
    <div className="space-y-24 animate-modern-fade">
      {/* Today's Stats */}
      <div>
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2 border border-white/20 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Metrics</h2>
          </div>
          <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] ml-14">Daily cardiovascular overview</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox
            label="Avg Systolic"
            value={avgSystolic}
            unit="mmHg"
            icon={TrendingUp}
          />
          <StatBox
            label="Avg Diastolic"
            value={avgDiastolic}
            unit="mmHg"
            icon={TrendingUp}
          />
          <StatBox
            label="Avg Pulse"
            value={avgPulse}
            unit="BPM"
            icon={Heart}
          />
        </div>
      </div>

      {/* Daily Schedule Status */}
      <div>
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2 border border-white/20 text-white">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Schedule</h2>
          </div>
          <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] ml-14">Measurement frequency tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Morning', time: '8:30 AM', reading: morningReading },
            { label: 'Afternoon', time: '2:00 PM', reading: afternoonReading },
            { label: 'Evening', time: '8:30 PM', reading: eveningReading }
          ].map((item) => (
            <div key={item.label} className="modern-card group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                  <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">{item.time}</p>
                </div>
                {item.reading ? (
                  <div className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest">
                    Recorded
                  </div>
                ) : (
                  <div className="px-3 py-1 border border-white/10 text-slate-600 text-[9px] font-black uppercase tracking-widest">
                    Waiting
                  </div>
                )}
              </div>

              {item.reading ? (
                <div className="animate-modern-fade">
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-4xl font-black text-white tracking-tighter">
                      {item.reading.systolic}/{item.reading.diastolic}
                    </p>
                    <p className="text-[10px] font-black text-slate-600 uppercase">mmHg</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-white">
                    <Heart className="w-3.5 h-3.5" />
                    <p className="text-sm font-black text-white italic">{item.reading.pulse} <span className="text-[9px] text-slate-600 font-bold uppercase not-italic">BPM</span></p>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center border border-dashed border-white/5 group-hover:border-white/20 transition-all duration-500">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter italic">--/--</p>
                  <p className="text-[9px] font-black text-slate-800 uppercase mt-2 tracking-[0.3em]">Nil Data</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
