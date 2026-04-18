import { useState, useEffect } from 'react';
import { BarChart3, Activity, Heart, TrendingUp, Calendar } from 'lucide-react';
import { pressureService } from '../services/api.js';
import { StatBox, ReadingCard } from '../components/Common.jsx';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const HomePage = () => {
  const [stats, setStats] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await pressureService.getDashboardStats();
        const latestRes = await pressureService.getLatestReadings();
        setStats(statsRes.data);
        setLatest(latestRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const todayAvg = stats.length > 0 ? stats[stats.length - 1] : { avg_systolic: 0, avg_diastolic: 0, avg_pulse: 0 };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#999999]">
            <Activity className="w-3 h-3" />
            Biometric Performance
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#111111]">
            Daily <span className="text-[#BBBBBB]">Metrics.</span>
          </h1>
          <p className="text-[#666666] font-medium tracking-tight max-w-md">
            Review your cardiovascular performance metrics and historical trends across the last 30 days.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[#CCCCCC] uppercase tracking-widest">Last Updated</span>
              <span className="text-sm font-bold text-[#111111]">Just Now</span>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] border border-[#F1F1F1] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#111111]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Stats & Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox label="Systolic" value={todayAvg.avg_systolic} unit="mmHg" icon={TrendingUp} />
            <StatBox label="Diastolic" value={todayAvg.avg_diastolic} unit="mmHg" icon={BarChart3} />
            <StatBox label="Avg Pulse" value={todayAvg.avg_pulse} unit="BPM" icon={Heart} />
          </div>

          {/* Trend Chart */}
          <div className="modern-card !p-8 h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-[#111111] tracking-tight">Pressure Trend</h3>
                <p className="text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider">Systolic vs Diastolic Over Time</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#111111]" />
                  <span className="text-[10px] font-bold text-[#666666]">Systolic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CCCCCC]" />
                  <span className="text-[10px] font-bold text-[#666666]">Diastolic</span>
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
                    tick={{fill: '#AAAAAA', fontSize: 10, fontWeight: 700}}
                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#AAAAAA', fontSize: 10, fontWeight: 700}}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontVariant: 'tabular-nums'}}
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
                    stroke="#CCCCCC" 
                    strokeWidth={3} 
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Latest Activity */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-sm font-black text-[#111111] uppercase tracking-[0.2em]">Latest Journal</h3>
             <span className="text-[10px] font-bold text-[#AAAAAA] uppercase">View All</span>
          </div>
          
          {latest.length > 0 ? (
            latest.map(r => <ReadingCard key={r.id} reading={r} />)
          ) : (
            <div className="modern-card text-center py-12 border-dashed">
              <p className="text-sm font-bold text-[#AAAAAA] uppercase tracking-widest">No readings today</p>
              <p className="text-[10px] text-[#DDDDDD] mt-1 font-bold">START LOGGING TO SEE TRENDS</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
