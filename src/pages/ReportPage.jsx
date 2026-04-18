import { useState, useEffect } from 'react';
import { pressureService } from '../services/api.js';
import { jsPDF } from 'jspdf';
import { getBPStatus } from '../utils/health.js';
import 'jspdf-autotable';
import { Download, ShieldCheck } from 'lucide-react';

export const ReportPage = () => {
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState({ systolic: 0, diastolic: 0, pulse: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await pressureService.getReadings(200);
        const data = response.data;
        setReadings(data);
        
        if (data.length > 0) {
          const sums = data.reduce((acc, r) => ({
            systolic: acc.systolic + r.systolic,
            diastolic: acc.diastolic + r.diastolic,
            pulse: acc.pulse + r.pulse
          }), { systolic: 0, diastolic: 0, pulse: 0 });
          
          setStats({
            systolic: sums.systolic / data.length,
            diastolic: sums.diastolic / data.length,
            pulse: sums.pulse / data.length,
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

  // Group readings by date for the aggregated table view
  const groupedReadings = readings.reduce((acc, curr) => {
    const date = curr.date || curr.created_at?.split('T')[0];
    if (!acc[date]) acc[date] = { date, Morning: null, Evening: null, Night: null };
    acc[date][curr.category] = curr;
    return acc;
  }, {});

  const aggregatedRows = Object.values(groupedReadings).sort((a, b) => b.date.localeCompare(a.date));

  const generatePDF = () => {
     const doc = new jsPDF();
     doc.setFont('helvetica', 'bold');
     doc.setFontSize(22);
     doc.text('BLOOD PRESSURE REPORT', 14, 22);
     
     doc.setFontSize(10);
     doc.setFont('helvetica', 'normal');
     doc.setTextColor(100);
     doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
     doc.text(`Total Records: ${stats.count}`, 14, 35);
     
     doc.autoTable({
       startY: 45,
       head: [['Summary Metrics', 'Average']],
       body: [
         ['Average Systolic', `${Math.round(stats.systolic)} mmHg`],
         ['Average Diastolic', `${Math.round(stats.diastolic)} mmHg`],
         ['Average Pulse', `${Math.round(stats.pulse)} BPM`]
       ],
       theme: 'grid',
       headStyles: { fillColor: '#111111' }
     });

     const tableHeaders = [['Date', 'Morning', 'Evening', 'Night']];
     const tableBody = aggregatedRows.map(row => [
       new Date(row.date).toLocaleDateString(),
       row.Morning ? `${row.Morning.systolic}/${row.Morning.diastolic}` : '-',
       row.Evening ? `${row.Evening.systolic}/${row.Evening.diastolic}` : '-',
       row.Night ? `${row.Night.systolic}/${row.Night.diastolic}` : '-'
     ]);

     doc.autoTable({
       startY: doc.lastAutoTable.finalY + 15,
       head: tableHeaders,
       body: tableBody,
       headStyles: { fillColor: '#111111' },
       theme: 'grid'
     });

     doc.save(`BP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const CompactReading = ({ reading }) => {
    if (!reading) return <span className="text-[#F0F0F0] font-black tracking-widest text-[10px]">──</span>;
    const status = getBPStatus(reading.systolic, reading.diastolic);
    const isSerious = status.key.includes('stage-2') || status.key.includes('crisis');
    
    return (
      <div className="flex flex-col">
        <span className={`font-black text-xl tracking-tighter ${isSerious ? 'text-red-600' : 'text-[#111111]'}`}>
          {reading.systolic}<span className="text-[#DDDDDD] font-light mx-0.5">/</span>{reading.diastolic}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
           <span className="text-[10px] font-black text-[#888888] uppercase tracking-tight">{reading.pulse} BPM</span>
           <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${status.badge} leading-none scale-90 origin-left`}>
              {status.label.split(' ')[0]}
           </span>
        </div>
      </div>
    );
  };

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-24 text-center">Loading Data Source...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-black uppercase tracking-widest text-[#999999]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cloud Database
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-[#111111] leading-[0.9]">
            Daily <span className="text-[#DDDDDD]">Metrics.</span>
          </h1>
          <p className="text-[#888888] font-medium tracking-tight max-w-lg text-lg">
            Aggregated clinical summary for streamlined oversight of your biometric performance across devices.
          </p>
        </div>

        <button 
          onClick={generatePDF}
          className="btn-primary flex items-center gap-3 px-10 py-5 shadow-2xl shadow-black/10 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
        >
          <Download className="w-5 h-5 text-white" />
          Export Report
        </button>
      </div>

      {/* Main Table Matrix */}
      <div className="modern-card !p-0 overflow-hidden shadow-sm border-none bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead className="bg-[#FAFAFA] border-b border-[#F1F1F1]">
              <tr>
                <th className="px-8 py-6 text-[11px] font-black text-[#AAAAAA] uppercase tracking-[0.25em] w-1/4">Biometric Date</th>
                <th className="px-8 py-6 text-[11px] font-black text-[#AAAAAA] uppercase tracking-[0.25em] w-1/4">Morning</th>
                <th className="px-8 py-6 text-[11px] font-black text-[#AAAAAA] uppercase tracking-[0.25em] w-1/4">Evening</th>
                <th className="px-8 py-6 text-[11px] font-black text-[#AAAAAA] uppercase tracking-[0.25em] w-1/4">Night</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1F1]">
              {aggregatedRows.length > 0 ? (
                aggregatedRows.map(row => (
                  <tr key={row.date} className="hover:bg-[#FCFCFC] transition-colors group">
                    <td className="px-8 py-8">
                       <p className="font-black text-sm text-[#111111]">{new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                       <p className="text-[10px] font-extrabold text-[#777777] uppercase tracking-widest mt-1">{new Date(row.date).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                    </td>
                    <td className="px-8 py-8"><CompactReading reading={row.Morning} /></td>
                    <td className="px-8 py-8"><CompactReading reading={row.Evening} /></td>
                    <td className="px-8 py-8"><CompactReading reading={row.Night} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-[10px] font-black text-[#CCCCCC] uppercase tracking-widest">
                    No historical records discovered in cloud storage
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
