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
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analyzing Trends...</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="glass-card text-center py-16 border-dashed border-white/5">
        <Calendar className="w-10 h-10 mx-auto mb-4 text-slate-700" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Insufficient Analytics Data</p>
        <p className="text-slate-600 text-[10px] mt-2 font-medium uppercase tracking-tighter">Record more measurements to see trends</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Blood Pressure Trend */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Pressure Over Time</h3>
        </div>
        <div className="glass-card !p-4 !bg-slate-950/20 backdrop-blur-3xl border-indigo-500/10">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
                itemStyle={{ padding: '2px 0' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }} />
              <Line 
                type="monotone" 
                dataKey="systolic" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Systolic" 
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Diastolic" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pulse Trend */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Heart Rate Trend</h3>
        </div>
        <div className="glass-card !p-4 !bg-slate-950/20 backdrop-blur-3xl border-rose-500/10">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Bar 
                dataKey="pulse" 
                fill="url(#pulseGradient)" 
                radius={[6, 6, 0, 0]} 
                name="Pulse (BPM)"
              />
              <defs>
                <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
