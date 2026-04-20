import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        date: new Date(stat.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        systolic: Math.round(stat.avg_systolic),
        diastolic: Math.round(stat.avg_diastolic),
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
        <div className="w-8 h-8 border-2 border-[#111111]/10 border-t-[#111111] animate-spin" />
        <p className="text-[#999999] font-black uppercase tracking-[0.4em] text-[10px]">Processing Trends</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="modern-card text-center py-24 border-dashed">
        <Calendar className="w-12 h-12 mx-auto mb-6 text-[#111111]" />
        <p className="text-[#999999] font-black uppercase tracking-[0.2em] text-sm">No Statistical Presence</p>
        <p className="text-[#777777] text-[9px] mt-3 font-bold uppercase tracking-widest">Aggregate data requires multiple entries</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Blood Pressure Trend */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <TrendingUp className="w-5 h-5 text-[#111111]" />
          <h3 className="text-sm font-black text-[#111111] uppercase tracking-[0.2em]">Pressure Analytics</h3>
        </div>
        <div className="modern-card !p-8 bg-white border border-[#F1F1F1]">
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#BBBBBB" 
                fontSize={9} 
                fontWeight={900}
                tickLine={false}
                axisLine={false}
                dy={15}
              />
              <YAxis 
                stroke="#BBBBBB" 
                fontSize={9} 
                fontWeight={900}
                tickLine={false}
                axisLine={false}
                dx={-15}
                domain={[60, 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: '1px solid #F1F1F1',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  fontSize: '10px',
                  fontWeight: '900',
                  color: '#111',
                  textTransform: 'uppercase'
                }}
                itemStyle={{ color: '#000', padding: '4px 0' }}
                cursor={{ stroke: '#EEEEEE', strokeWidth: 1 }}
              />
              <Legend 
                verticalAlign="top" 
                height={48} 
                iconType="circle" 
                wrapperStyle={{ 
                  fontSize: '9px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px',
                  paddingBottom: '20px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="systolic" 
                stroke="#111111" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#111111' }}
                name="Systolic" 
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                stroke="#DDDDDD" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#DDDDDD' }}
                name="Diastolic" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCCCCC]">End of Analytics Stream</p>
      </div>
    </div>
  );
};

