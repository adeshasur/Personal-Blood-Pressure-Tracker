import { useState, useEffect } from 'react';
import { pressureService } from '../services/api.js';
import { 
  Activity, 
  TrendingUp, 
  Heart, 
  BarChart3, 
  Calendar, 
  ChevronRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { StatBox, HistoryItem } from '../components/Common';

export const HomePage = () => {
  const [stats, setStats] = useState([]);
  const [latestReadings, setLatestReadings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await pressureService.getDashboardStats();
        const latestRes = await pressureService.getLatestReadings();
        setStats(statsRes.data);
        setLatestReadings(latestRes.data);
      } catch (err) {
        console.error('Data fetch failed:', err);
      }
    };
    fetchData();
  }, []);

  const todayAvg = stats.length > 0 ? stats[stats.length - 1] : { avg_systolic: 0, avg_diastolic: 0, avg_pulse: 0 };

  return (
    <div className="page-container page-transition">
      {/* Header */}
      <div className="header-section flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#777777]">
            <Activity className="w-3.5 h-3.5" />
            Vitals Overview
          </div>
          <h1 className="page-title">
            Biometric <span className="text-[#DDDDDD]">Dashboard.</span>
          </h1>
          <p className="page-description">
            Monitor real-time cardiovascular performance data and clinical trends across your cloud ledger.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#BBBBBB] uppercase tracking-widest leading-none mb-1">Status</span>
              <span className="text-[13px] font-black text-[#111111]">Cloud Sync Active</span>
           </div>
           <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#F1F1F1] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#111111]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Stats & Chart */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatBox label="Systolic" value={todayAvg.avg_systolic} unit="mmHg" icon={TrendingUp} />
            <StatBox label="Diastolic" value={todayAvg.avg_diastolic} unit="mmHg" icon={BarChart3} />
            <StatBox label="Pulse" value={todayAvg.avg_pulse} unit="BPM" icon={Heart} />
          </div>

          {/* Trend Chart */}
          <div className="modern-card">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[11px] font-black text-[#BBBBBB] uppercase tracking-[0.2em] mb-1">Health Trend</h3>
                <p className="text-sm font-black text-[#111111]">Daily Average Metrics</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#111111]"></div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Sys</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#DDDDDD]"></div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Dia</span>
                 </div>
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111111" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#AAAAAA' }}
                    dy={10}
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#AAAAAA' }}
                    domain={[60, 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: '800' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avg_systolic" 
                    stroke="#111111" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSys)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avg_diastolic" 
                    stroke="#DDDDDD" 
                    strokeWidth={3}
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <div className="header-section mb-6">
              <h3 className="text-[11px] font-black text-[#BBBBBB] uppercase tracking-[0.2em] mb-1">Journal</h3>
              <p className="text-sm font-black text-[#111111]">Latest Records</p>
            </div>
            
            <div className="space-y-4">
              {latestReadings.length > 0 ? (
                latestReadings.map(reading => (
                  <HistoryItem key={reading.id} reading={reading} />
                ))
              ) : (
                <div className="modern-card p-10 text-center border-dashed">
                   <p className="text-[10px] font-black text-[#DDDDDD] uppercase tracking-[0.2em]">Initial Record Needed</p>
                </div>
              )}
              
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#F1F1F1] hover:bg-[#FAFAFA] transition-all group">
                 <span className="text-[10px] font-black text-[#111111] uppercase tracking-[0.2em]">Explore All History</span>
                 <ChevronRight className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#111111] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
