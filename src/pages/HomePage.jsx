import { useState, useEffect } from 'react';
import { pressureService } from '../services/api.js';
import { 
  Activity, 
  TrendingUp, 
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
import { StatBox, HistoryItem } from '../components/Common.jsx';

export const HomePage = () => {
  const [stats, setStats] = useState([]);
  const [latestReadings, setLatestReadings] = useState([]);
  const [todayAvg, setTodayAvg] = useState({ avg_systolic: 0, avg_diastolic: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, latestRes] = await Promise.all([
          pressureService.getDashboardStats(),
          pressureService.getReadings(4)
        ]);
        
        setStats(statsRes.data);
        setLatestReadings(latestRes.data);
        
        if (statsRes.data.length > 0) {
          setTodayAvg(statsRes.data[statsRes.data.length - 1]);
        }
      } catch (err) {
        console.error('Dashboard load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <div className="page-container text-center py-24 text-[10px] font-black text-[#DDDDDD] uppercase tracking-[0.2em]">Syncing Clinical Ledger...</div>;

  return (
    <div className="page-container page-transition h-full flex flex-col">
      <div className="header-section flex-shrink-0 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-4">
            <Activity className="w-3.5 h-3.5" />
            Vitals Monitoring Live
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

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-5 pb-2">
        {/* Main Column: Stats & Chart */}
        <div className="md:col-span-8 flex flex-col gap-5 min-h-0">
          
          {/* Summary Grid */}
          <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-5">
            <StatBox label="Systolic" value={todayAvg.avg_systolic} unit="mmHg" icon={TrendingUp} />
            <StatBox label="Diastolic" value={todayAvg.avg_diastolic} unit="mmHg" icon={BarChart3} />
          </div>

          {/* Trend Chart */}
          <div className="modern-card flex-1 flex flex-col min-h-0 mb-0">
            <div className="flex items-center justify-between mb-5 flex-shrink-0">
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
            
            <div className="flex-1 w-full min-h-0">
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
        <div className="md:col-span-4 flex flex-col min-h-0 mb-0">
          <div className="modern-card flex-1 flex flex-col p-4 sm:p-5 border border-[#F1F1F1] shadow-none min-h-0">
            <div className="header-section flex-shrink-0 mb-4">
              <h3 className="text-[11px] font-black text-[#BBBBBB] uppercase tracking-[0.2em] mb-1">Journal</h3>
              <p className="text-sm font-black text-[#111111]">Latest Records</p>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1 pb-2">
              {latestReadings.length > 0 ? (
                latestReadings.map(reading => (
                  <HistoryItem key={reading.id} reading={reading} />
                ))
              ) : (
                <div className="modern-card text-center py-12">
                   <p className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-widest">No readings found</p>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 mt-3 pt-3 border-t border-[#F1F1F1]">
              <button className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#777777] hover:text-[#111111] transition-colors border border-dashed border-[#EEEEEE] rounded-2xl bg-[#FAFAFA]">
                 Full History Archive <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
