import { useState, useEffect } from 'react';
import { pressureService } from '../services/api.js';
import { jsPDF } from 'jspdf';
import { getBPStatus } from '../utils/health.js';
import 'jspdf-autotable';
import { Download, FileText, Activity, Heart, ShieldCheck } from 'lucide-react';

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
       head: [['Metric', 'Average Value']],
       body: [
         ['Average Systolic', `${Math.round(stats.systolic)} mmHg`],
         ['Average Diastolic', `${Math.round(stats.diastolic)} mmHg`],
         ['Average Pulse', `${Math.round(stats.pulse)} BPM`]
       ],
       theme: 'striped',
       headStyles: { fillColor: '#111111' }
     });

     const tableData = readings.map(r => [
       new Date(r.date || r.created_at).toLocaleDateString(),
       r.category,
       r.systolic,
       r.diastolic,
       r.pulse,
       getBPStatus(r.systolic, r.diastolic).label
     ]);

     doc.autoTable({
       startY: doc.lastAutoTable.finalY + 15,
       head: [['Date', 'Phase', 'Sys', 'Dia', 'Pulse', 'Status']],
       body: tableData,
       headStyles: { fillColor: '#111111' }
     });

     doc.save(`BP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-24 text-center">Loading Report...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-black uppercase tracking-widest text-[#999999]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Clinical Analysis
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter text-[#111111] leading-[0.9]">
            Patient <span className="text-[#DDDDDD]">Report.</span>
          </h1>
          <p className="text-[#888888] font-medium tracking-tight max-w-lg text-lg">
            High-fidelity clinical summary and automated trend analysis generated from your medical history.
          </p>
        </div>

        <button 
          onClick={generatePDF}
          className="btn-primary flex items-center gap-3 px-10 py-5 shadow-2xl shadow-black/10 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
        >
          <Download className="w-5 h-5 text-white" />
          Export PDF
        </button>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-12 text-center shadow-none hover:bg-[#F8F8F8]">
            <div className="p-4 bg-white rounded-2xl border border-[#F1F1F1] mb-5 shadow-sm">
               <Activity className="w-6 h-6 text-[#111111]" />
            </div>
            <p className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] mb-2">Avg Systolic</p>
            <p className="text-4xl font-black text-[#111111] tracking-tighter">{Math.round(stats.systolic)} <span className="text-xs font-bold opacity-30 tracking-tight">mmHg</span></p>
         </div>
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-12 text-center shadow-none hover:bg-[#F8F8F8]">
            <div className="p-4 bg-white rounded-2xl border border-[#F1F1F1] mb-5 shadow-sm">
               <Activity className="w-6 h-6 text-[#BBBBBB]" />
            </div>
            <p className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] mb-2">Avg Diastolic</p>
            <p className="text-4xl font-black text-[#111111] tracking-tighter">{Math.round(stats.diastolic)} <span className="text-xs font-bold opacity-30 tracking-tight">mmHg</span></p>
         </div>
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-12 text-center shadow-none hover:bg-[#F8F8F8]">
            <div className="p-4 bg-white rounded-2xl border border-[#F1F1F1] mb-5 shadow-sm">
               <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            </div>
            <p className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] mb-2">Avg Pulse</p>
            <p className="text-4xl font-black text-[#111111] tracking-tighter">{Math.round(stats.pulse)} <span className="text-xs font-bold opacity-30 tracking-tight">BPM</span></p>
         </div>
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-12 text-center shadow-none hover:bg-[#F8F8F8]">
            <div className="p-4 bg-white rounded-2xl border border-[#F1F1F1] mb-5 shadow-sm">
               <FileText className="w-6 h-6 text-[#111111]" />
            </div>
            <p className="text-[10px] font-black text-[#999999] uppercase tracking-[0.2em] mb-2">Audit Count</p>
            <p className="text-4xl font-black text-[#111111] tracking-tighter">{stats.count}</p>
         </div>
      </div>

      {/* Main Table Matrix */}
      <div className="modern-card !p-0 overflow-hidden shadow-sm border-none bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FAFAFA] border-b border-[#F1F1F1]">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.25em]">Biometric Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.25em]">Phase</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.25em]">Sys</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.25em]">Dia</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.25em]">Pulse</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.25em] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1F1]">
              {readings.map(r => {
                 const status = getBPStatus(r.systolic, r.diastolic);
                 const isSerious = status.key.includes('stage-2') || status.key.includes('crisis');
                 return (
                    <tr key={r.id} className="hover:bg-[#FCFCFC] transition-colors group">
                      <td className="px-6 py-6 font-bold text-sm text-[#111111]">{new Date(r.date || r.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-6 font-black text-[10px] text-[#999999] uppercase tracking-widest">{r.category}</td>
                      <td className={`px-6 py-6 font-black text-xl tracking-tighter ${isSerious ? 'text-red-600' : 'text-[#111111]'}`}>{r.systolic}</td>
                      <td className={`px-6 py-6 font-black text-xl tracking-tighter ${isSerious ? 'text-red-500' : 'text-[#111111]'}`}>{r.diastolic}</td>
                      <td className="px-6 py-6 font-black text-sm text-[#999999] tracking-tighter">{r.pulse} <span className="text-[10px] opacity-20 ml-0.5">BPM</span></td>
                      <td className="px-6 py-6 text-right">
                         <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${status.badge}`}>
                            {status.label}
                         </span>
                      </td>
                    </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
