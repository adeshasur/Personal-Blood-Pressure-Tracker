import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
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
        pressureService.getReadings(10),
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

  const morningReading = latest.find(r => r.category === 'Morning');
  const eveningReading = latest.find(r => r.category === 'Evening');
  const nightReading = latest.find(r => r.category === 'Night');

  return (
    <div className="space-y-16 page-transition">
      {/* Metrics Header */}
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-4 h-4 text-[#111111]" />
              <h2 className="text-[11px] font-black text-[#BBBBBB] uppercase tracking-[0.2em]">Daily Metrics</h2>
            </div>
            <p className="text-xl font-black text-[#111111] tracking-tight">Clinical Summary Overview</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
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
        </div>
      </div>

      {/* Schedule Tracker */}
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-[#111111]" />
            <h2 className="text-[11px] font-black text-[#BBBBBB] uppercase tracking-[0.2em]">Measurement Schedule</h2>
          </div>
          <p className="text-xl font-black text-[#111111] tracking-tight">Frequency Compliance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: 'Morning', time: '08:30 AM', reading: morningReading },
            { label: 'Evening', time: '18:30 PM', reading: eveningReading },
            { label: 'Night',   time: '22:30 PM', reading: nightReading }
          ].map((item) => (
            <div key={item.label} className="modern-card group border-[#F1F1F1]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black text-[#BBBBBB] uppercase tracking-[0.2em] mb-1">{item.label}</p>
                  <p className="text-[9px] text-[#111111] font-bold uppercase tracking-widest">{item.time}</p>
                </div>
                {item.reading ? (
                  <div className="px-2.5 py-1 bg-[#111111] text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                    Complete
                  </div>
                ) : (
                  <div className="px-2.5 py-1 bg-[#FAFAFA] border border-[#F1F1F1] text-[#CCCCCC] text-[8px] font-black uppercase tracking-widest rounded-full">
                    Pending
                  </div>
                )}
              </div>

              {item.reading ? (
                <div className="animate-modern-fade">
                  <div className="flex items-baseline gap-1.5 pb-2">
                    <p className="text-3xl font-black text-[#111111] tracking-tighter">
                      {item.reading.systolic}<span className="text-[#DDDDDD] font-light mx-0.5">/</span>{item.reading.diastolic}
                    </p>
                    <p className="text-[9px] font-black text-[#BBBBBB] uppercase">mmHg</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center border border-dashed border-[#EEEEEE] group-hover:border-[#DDDDDD] transition-all rounded-xl">
                  <p className="text-3xl font-black text-[#F5F5F5] tracking-tighter italic">--/--</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

