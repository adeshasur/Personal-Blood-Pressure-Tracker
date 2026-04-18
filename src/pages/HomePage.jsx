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
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-black uppercase tracking-widest text-[#999999]">
            <Activity className="w-3.5 h-3.5" />
            Vitals Overview
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter text-[#111111] leading-[0.9]">
            Biometric <span className="text-[#DDDDDD]">Dashboard.</span>
          </h1>
          <p className="text-[#888888] font-medium tracking-tight max-w-lg text-lg">
            Monitor real-time cardiovascular performance data and clinical trends across your local ledger.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#BBBBBB] uppercase tracking-widest leading-none mb-1.5">Last Record</span>
              <span className="text-sm font-black text-[#111111]">Updated Today</span>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-[#FAFAFA] border border-[#F1F1F1] flex items-center justify-center shadow-sm">
              <Calendar className="w-6 h-6 text-[#111111]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Column: Stats & Chart */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox label="Systolic" value={todayAvg.avg_systolic} unit="mmHg" icon={TrendingUp} />
            <StatBox label="Diastolic" value={todayAvg.avg_diastolic} unit="mmHg" icon={BarChart3} />
            <StatBox label="Pulse" value={todayAvg.avg_pulse} unit="BPM" icon={Heart} />
          </div>

          {/* Trend Chart */}
          <div className="modern-card !p-10 h-[450px] shadow-[0_30px_70px_rgb(0,0,0,0.03)] border-none">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-[#111111] tracking-tighter">Pressure Trends</h3>
                <p className="text-[11px] font-black text-[#999999] uppercase tracking-[0.2em] mt-1">SYSTOLIC VS DIASTOLIC OVER TIME</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#111111]" />
                  <span className="text-[11px] font-black text-[#666666] tracking-tight">Sys</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#DDDDDD]" />
                  <span className="text-[11px] font-black text-[#666666] tracking-tight">Dia</span>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#999999', fontSize: 11, fontWeight: 800, letterSpacing: -0.5}}
                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    dy={16}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#999999', fontSize: 11, fontWeight: 800}}
                    domain={['dataMin - 10', 'dataMax + 10']}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontVariant: 'tabular-nums'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avg_systolic" 
                    stroke="#111111" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorSys)" 
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avg_diastolic" 
                    stroke="#DDDDDD" 
                    strokeWidth={4} 
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Latest Activity */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-sm font-black text-[#111111] uppercase tracking-[0.25em]">Recent Activity</h3>
             <span className="text-[10px] font-black text-[#BBBBBB] uppercase tracking-widest cursor-pointer hover:text-[#111111] transition-colors">History »</span>
          </div>
          
          <div className="space-y-5">
            {latest.length > 0 ? (
              latest.map(r => <ReadingCard key={r.id} reading={r} />)
            ) : (
              <div className="modern-card text-center py-16 border-dashed bg-[#FAFAFA]/40">
                <p className="text-[10px] font-black text-[#AAAAAA] uppercase tracking-widest">No Biometrics Detected</p>
                <p className="text-[11px] text-[#DDDDDD] mt-2 font-black uppercase">Start logging to see performance</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
