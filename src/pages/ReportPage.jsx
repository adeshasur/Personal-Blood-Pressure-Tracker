import { useState, useEffect } from 'react';
import { pressureService } from '../services/api.js';
import jsPDF from 'jspdf';
import { getBPStatus } from '../utils/health.js';
import 'jspdf-autotable';
import { Download, ShieldCheck } from 'lucide-react';

export const ReportPage = () => {
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState({ systolic: 0, diastolic: 0, pulse: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const DEPLOY_VERSION = 'v1.2.5-STABLE';

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

  const groupedReadings = readings.reduce((acc, curr) => {
    const date = curr.date || curr.created_at?.split('T')[0];
    if (!acc[date]) acc[date] = { date, Morning: null, Evening: null, Night: null };
    acc[date][curr.category || 'Morning'] = curr;
    return acc;
  }, {});

  const aggregatedRows = Object.values(groupedReadings).sort((a, b) => b.date.localeCompare(a.date));

  const generatePDF = () => {
    try {
      console.log('Initiating PDF generation...');
      
      if (typeof jsPDF !== 'function' && typeof jsPDF?.default !== 'function') {
        throw new Error('PDF Library not loaded correctly');
      }

      const doc = new jsPDF();
      
      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('BLOOD PRESSURE REPORT', 14, 22);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
      
      // Clinical Summary Table
      const summaryBody = [
        ['Avg Systolic', stats?.systolic ? `${Math.round(stats.systolic)} mmHg` : 'N/A'],
        ['Avg Diastolic', stats?.diastolic ? `${Math.round(stats.diastolic)} mmHg` : 'N/A'],
        ['Avg Pulse', stats?.pulse ? `${Math.round(stats.pulse)} BPM` : 'N/A']
      ];

      doc.autoTable({
        startY: 35,
        head: [['Metric', 'Clinical Value']],
        body: summaryBody,
        theme: 'grid',
        headStyles: { fillColor: '#111111' },
        styles: { fontSize: 8, cellPadding: 3 }
      });

      // Daily Matrix Table
      const tableHeaders = [['Date', 'Morning (Sys/Dia)', 'Evening (Sys/Dia)', 'Night (Sys/Dia)']];
      const tableBody = aggregatedRows.map(row => [
        row.date ? new Date(row.date).toLocaleDateString() : 'Unknown Date',
        row.Morning ? `${row.Morning.systolic}/${row.Morning.diastolic}` : '-',
        row.Evening ? `${row.Evening.systolic}/${row.Evening.diastolic}` : '-',
        row.Night ? `${row.Night.systolic}/${row.Night.diastolic}` : '-'
      ]);

      const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 70;

      doc.autoTable({
        startY: lastY + 10,
        head: tableHeaders,
        body: tableBody,
        headStyles: { fillColor: '#111111' },
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 }
      });

      const fileName = `BP_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      console.log('PDF export successful:', fileName);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Unable to generate PDF. Please check your connection or data.');
    }
  };

  const CompactReading = ({ reading }) => {
    if (!reading) return <span className="text-[#F5F5F5] font-black tracking-widest text-[9px]">──</span>;
    const status = getBPStatus(reading.systolic, reading.diastolic);
    const isSerious = status.key.includes('stage-2') || status.key.includes('crisis');
    
    return (
      <div className="flex flex-col">
        <span className={`font-black text-lg tracking-tighter ${isSerious ? 'text-red-600' : 'text-[#111111]'}`}>
          {reading.systolic}<span className="text-[#DDDDDD] font-light mx-0.5">/</span>{reading.diastolic}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
           <span className="text-[9px] font-bold text-[#999999] uppercase tracking-tight">{reading.pulse} BPM</span>
           <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full border ${status.badge} scale-90 origin-left`}>
              {status.label.split(' ')[0]}
           </span>
        </div>
      </div>
    );
  };

  if (loading) return <div className="page-container text-center py-24 text-[10px] font-black text-[#DDDDDD] uppercase tracking-[0.2em]">Syncing Clinical Ledger...</div>;

  return (
    <div className="page-container page-transition">
      
      <div className="header-section flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#777777]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authenticated Source
            <span className="ml-2 pl-2 border-l border-[#EEEEEE] text-[#BBBBBB]">{DEPLOY_VERSION}</span>
          </div>
          <h1 className="page-title">
            Daily <span className="text-[#DDDDDD]">Metrics.</span>
          </h1>
          <p className="page-description">
            Aggregated clinical summary for streamlined oversight of your biometric performance.
          </p>
        </div>

        <button 
          onClick={generatePDF}
          className="btn-primary flex items-center gap-2.5 shadow-xl shadow-black/5 hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="modern-card !p-0 overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead className="bg-[#FAFAFA] border-b border-[#F1F1F1]">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.2em] w-1/4">Biometric Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.2em] w-1/4">Morning</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.2em] w-1/4">Evening</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.2em] w-1/4">Night</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1F1]">
              {aggregatedRows.length > 0 ? (
                aggregatedRows.map(row => (
                  <tr key={row.date} className="hover:bg-[#FCFCFC] transition-colors group">
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
                    Empty cloud ledger
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
