import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Calendar } from 'lucide-react';
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
        date: new Date(stat.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
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
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white animate-spin" />
        <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Processing Trends</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="modern-card text-center py-24 border-dashed">
        <Calendar className="w-12 h-12 mx-auto mb-6 text-slate-800" />
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">No Statistical Presence</p>
        <p className="text-slate-700 text-[9px] mt-3 font-bold uppercase tracking-widest">Aggregate data requires multiple entries</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
      {/* Blood Pressure Trend */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <TrendingUp className="w-5 h-5 text-white" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Pressure Analytics</h3>
        </div>
        <div className="modern-card !p-8 bg-black/40">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="0" stroke="#1A1A1A" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#333" 
                fontSize={9} 
                fontWeight={900}
                tickLine={false}
                axisLine={false}
                dy={15}
              />
              <YAxis 
                stroke="#333" 
                fontSize={9} 
                fontWeight={900}
                tickLine={false}
                axisLine={false}
                dx={-15}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: 'none',
                  borderRadius: '0',
                  boxShadow: '20px 20px 60px rgba(0,0,0,0.5)',
                  fontSize: '10px',
                  fontWeight: '900',
                  color: '#000',
                  textTransform: 'uppercase'
                }}
                itemStyle={{ color: '#000', padding: '4px 0' }}
                cursor={{ stroke: '#FFF', strokeWidth: 1 }}
              />
              <Legend 
                verticalAlign="top" 
                height={48} 
                iconType="square" 
                wrapperStyle={{ 
                  fontSize: '9px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px',
                  paddingBottom: '20px'
                }} 
              />
              <Line 
                type="stepAfter" 
                dataKey="systolic" 
                stroke="#FFFFFF" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#FFFFFF' }}
                name="Systolic" 
              />
              <Line 
                type="stepAfter" 
                dataKey="diastolic" 
                stroke="#404040" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#404040' }}
                name="Diastolic" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pulse Trend */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <Activity className="w-5 h-5 text-white" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Frequency Trend</h3>
        </div>
        <div className="modern-card !p-8 bg-black/40">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="0" stroke="#1A1A1A" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#333" 
                fontSize={9} 
                fontWeight={900}
                tickLine={false}
                axisLine={false}
                dy={15}
              />
              <YAxis 
                stroke="#333" 
                fontSize={9} 
                fontWeight={900}
                tickLine={false}
                axisLine={false}
                dx={-15}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: 'none',
                  borderRadius: '0',
                  boxShadow: '20px 20px 60px rgba(0,0,0,0.5)',
                  fontSize: '10px',
                  fontWeight: '900',
                  color: '#000',
                  textTransform: 'uppercase'
                }}
              />
              <Bar 
                dataKey="pulse" 
                fill="#FFFFFF" 
                radius={[0, 0, 0, 0]} 
                name="Pulse (BPM)"
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
