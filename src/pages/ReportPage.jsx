import { useState, useEffect } from 'react';
import { pressureService } from '../services/api.js';
import { getBPStatus } from '../utils/health.js';
import { Download, ShieldCheck, Printer } from 'lucide-react';

export const ReportPage = () => {
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState({ systolic: 0, diastolic: 0, pulse: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const DEPLOY_VERSION = 'v1.3.0-PRINT';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await pressureService.getReadings(200);
        const data = response.data;
        setReadings(data);
        
        if (data.length > 0) {
          const sums = data.reduce((acc, r) => ({
            systolic: acc.systolic + (r.systolic || 0),
            diastolic: acc.diastolic + (r.diastolic || 0),
            pulse: acc.pulse + (r.pulse || 0),
            pulseCount: acc.pulseCount + (r.pulse ? 1 : 0)
          }), { systolic: 0, diastolic: 0, pulse: 0, pulseCount: 0 });
          
          setStats({
            systolic: sums.systolic / data.length,
            diastolic: sums.diastolic / data.length,
            pulse: sums.pulseCount > 0 ? sums.pulse / sums.pulseCount : null,
            count: data.length
          });
        }
      } catch (err) {
        console.error('Report fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedReadings = readings.reduce((acc, curr) => {
    const date = curr.date || curr.created_at?.split('T')[0];
    if (!acc[date]) acc[date] = { date, Morning: null, Evening: null, Night: null };
    acc[date][curr.category || 'Morning'] = curr;
    return acc;
  }, {});

  const aggregatedRows = Object.values(groupedReadings).sort((a, b) => b.date.localeCompare(a.date));

  const handlePrint = () => {
     window.print();
  };

  const CompactReading = ({ reading }) => {
    if (!reading) return <span className="text-[#F5F5F5] print:text-[#EEEEEE] font-black tracking-widest text-[9px]">──</span>;
    const status = getBPStatus(reading.systolic, reading.diastolic);
    const isSerious = status.key.includes('stage-2') || status.key.includes('crisis');
    
    return (
      <div className="flex flex-col">
        <span className={`font-black text-lg tracking-tighter ${isSerious ? 'text-red-600' : 'text-[#111111]'}`}>
          {reading.systolic}<span className="text-[#DDDDDD] font-light mx-0.5">/</span>{reading.diastolic}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
           <span className="text-[9px] font-bold text-[#999999] uppercase tracking-tight">
             {reading.pulse ? `${reading.pulse} BPM` : 'No Pulse'}
           </span>
           <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full border ${status.badge} scale-90 origin-left print:border-black print:text-black`}>
              {status.label.split(' ')[0]}
           </span>
        </div>
      </div>
    );
  };

  if (loading) return <div className="page-container text-center py-24 text-[10px] font-black text-[#DDDDDD] uppercase tracking-[0.2em]">Syncing Clinical Ledger...</div>;

  return (
    <div className="page-container page-transition">
      
      {/* Header Section - Hidden during print except title */}
      <div className="header-section flex flex-col md:flex-row md:items-end justify-between gap-6 print:mb-8">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#777777] print:hidden">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authenticated Source
            <span className="ml-2 pl-2 border-l border-[#EEEEEE] text-[#BBBBBB]">{DEPLOY_VERSION}</span>
          </div>
          <h1 className="page-title print:text-2xl print:mb-2">
            Clinical <span className="text-[#DDDDDD] print:text-[#777777]">Biometric Report.</span>
          </h1>
          <p className="page-description print:text-xs">
            Aggregated cardiovascular performance summary for professional clinical oversight.
            <span className="hidden print:inline ml-2 text-[#999999]">| Generated on {new Date().toLocaleDateString()}</span>
          </p>
        </div>

        <button 
          onClick={handlePrint}
          className="btn-primary flex items-center gap-2.5 shadow-xl shadow-black/5 hover:-translate-y-0.5 print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print Report
        </button>
      </div>

      {/* Stats Summary - Simplified for Print */}
      <div className="grid grid-cols-3 gap-6 mb-8 hidden print:grid border-y border-[#EEEEEE] py-4">
         <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#999999] mb-1">Avg Systolic</p>
            <p className="text-xl font-black">{Math.round(stats.systolic)} <span className="text-[10px] text-[#BBBBBB]">mmHg</span></p>
         </div>
         <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#999999] mb-1">Avg Diastolic</p>
            <p className="text-xl font-black">{Math.round(stats.diastolic)} <span className="text-[10px] text-[#BBBBBB]">mmHg</span></p>
         </div>
         <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#999999] mb-1">Avg Pulse</p>
            <p className="text-xl font-black">{stats.pulse ? Math.round(stats.pulse) : '--'} <span className="text-[10px] text-[#BBBBBB]">BPM</span></p>
         </div>
      </div>

      <div className="modern-card !p-0 overflow-hidden border-[#F1F1F1] print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead className="bg-[#FAFAFA] border-b border-[#F1F1F1] print:bg-white print:border-b-2 print:border-black">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] print:text-black uppercase tracking-[0.2em] w-1/4">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] print:text-black uppercase tracking-[0.2em] w-1/4">Morning</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] print:text-black uppercase tracking-[0.2em] w-1/4">Evening</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] print:text-black uppercase tracking-[0.2em] w-1/4">Night</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1F1] print:divide-black">
              {aggregatedRows.length > 0 ? (
                aggregatedRows.map(row => (
                  <tr key={row.date} className="hover:bg-[#FCFCFC] transition-colors group print:break-inside-avoid">
                    <td className="px-6 py-5">
                       <p className="font-black text-[13px] text-[#111111]">{new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                       <p className="text-[9px] font-extrabold text-[#777777] uppercase tracking-widest mt-0.5">{new Date(row.date).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                    </td>
                    <td className="px-6 py-5"><CompactReading reading={row.Morning} /></td>
                    <td className="px-6 py-5"><CompactReading reading={row.Evening} /></td>
                    <td className="px-6 py-5"><CompactReading reading={row.Night} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-[10px] font-black text-[#CCCCCC] uppercase tracking-widest">
                    Empty clinical ledger
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-12 pt-8 border-t border-[#EEEEEE]">
         <p className="text-[10px] font-medium text-[#AAAAAA] italic text-center">
            This report is a digital synthesis of recorded biometric data. Please consult with a medical professional for clinical diagnosis.
         </p>
      </div>
    </div>
  );
};
