import { useEffect, useState } from 'react';
import { Heart, Zap, TrendingUp, Calendar } from 'lucide-react';
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
    <div className="space-y-12 animate-fade-in">
      {/* Today's Stats */}
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            Today's Metrics
          </h2>
          <p className="text-slate-500 text-sm mt-1 ml-11">Overview of your vitals for today</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Zap className="w-6 h-6" />
            </div>
            Logging Progress
          </h2>
          <p className="text-slate-500 text-sm mt-1 ml-11">Track your daily measurement schedule</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Morning', time: '8:30 AM', reading: morningReading },
            { label: 'Afternoon', time: '2:00 PM', reading: afternoonReading },
            { label: 'Evening', time: '8:30 PM', reading: eveningReading }
          ].map((item) => (
            <div key={item.label} className="glass-card group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                  <p className="text-[10px] text-slate-600 font-medium uppercase tracking-tighter">{item.time}</p>
                </div>
                {item.reading ? (
                  <div className="p-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    Logged
                  </div>
                ) : (
                  <div className="p-1 px-2 rounded-lg bg-white/5 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-white/5">
                    Pending
                  </div>
                )}
              </div>

              {item.reading ? (
                <div className="animate-fade-in">
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-black text-white tracking-tighter">
                      {item.reading.systolic}/{item.reading.diastolic}
                    </p>
                    <p className="text-xs font-bold text-slate-500 uppercase">mmHg</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Heart className="w-3 h-3 text-rose-500 fill-current" />
                    <p className="text-sm font-bold text-slate-300">{item.reading.pulse} <span className="text-[10px] text-slate-500 uppercase">BPM</span></p>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl group-hover:border-indigo-500/20 transition-colors">
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">--/--</p>
                  <p className="text-[10px] font-bold text-slate-700 uppercase mt-1 tracking-widest">No Data</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
