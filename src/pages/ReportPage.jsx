import { useState, useEffect } from 'react';
import { pressureService } from '../services/api.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Download, FileText, Activity, Heart, ShieldCheck } from 'lucide-react';

export const ReportPage = () => {
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState({ systolic: 0, diastolic: 0, pulse: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await pressureService.getReadings(100);
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
     
     // Summary Stats Table
     doc.autoTable({
       startY: 45,
       head: [['Metric', 'Average Value']],
       body: [
         ['Average Systolic', `${Math.round(stats.systolic)} mmHg`],
         ['Average Diastolic', `${Math.round(stats.diastolic)} mmHg`],
         ['Average Pulse', `${Math.round(stats.pulse)} BPM`]
       ],
       theme: 'striped',
       headStyles: { fillStyle: '#111111' }
     });

     // Readings Table
     const tableData = readings.map(r => [
       new Date(r.date || r.created_at).toLocaleDateString(),
       r.category,
       r.systolic,
       r.diastolic,
       r.pulse
     ]);

     doc.autoTable({
       startY: doc.lastAutoTable.finalY + 15,
       head: [['Date', 'Phase', 'Systolic', 'Diastolic', 'Pulse']],
       body: tableData,
       headStyles: { fillColor: '#111111' }
     });

     doc.save(`BP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-24 text-center">Loading Report...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-[#F5F5F5] pb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#999999]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Clinical Document
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter text-[#111111]">
            Patient <span className="text-[#DDDDDD]">Report.</span>
          </h1>
          <p className="text-[#888888] font-medium tracking-tight max-w-lg text-lg">
            High-fidelity clinical summary generated from your local measurement history.
          </p>
        </div>

        <button 
          onClick={generatePDF}
          className="btn-primary flex items-center gap-3 px-10 py-5 shadow-2xl shadow-black/10 active:scale-95 transition-all"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 bg-white rounded-2xl border border-[#F1F1F1] mb-5">
               <Activity className="w-5 h-5 text-[#111111]" />
            </div>
            <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest mb-1">Avg Systolic</p>
            <p className="text-4xl font-extrabold text-[#111111]">{Math.round(stats.systolic)} <span className="text-sm font-bold opacity-30">mmHg</span></p>
         </div>
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 bg-white rounded-2xl border border-[#F1F1F1] mb-5">
               <Activity className="w-5 h-5 text-[#BBBBBB]" />
            </div>
            <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest mb-1">Avg Diastolic</p>
            <p className="text-4xl font-extrabold text-[#111111]">{Math.round(stats.diastolic)} <span className="text-sm font-bold opacity-30">mmHg</span></p>
         </div>
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 bg-white rounded-2xl border border-[#F1F1F1] mb-5">
               <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest mb-1">Avg Pulse</p>
            <p className="text-4xl font-extrabold text-[#111111]">{Math.round(stats.pulse)} <span className="text-sm font-bold opacity-30">BPM</span></p>
         </div>
         <div className="modern-card bg-[#FAFAFA] border-none flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 bg-white rounded-2xl border border-[#F1F1F1] mb-5">
               <FileText className="w-5 h-5 text-[#111111]" />
            </div>
            <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest mb-1">Total Entries</p>
            <p className="text-4xl font-extrabold text-[#111111]">{stats.count}</p>
         </div>
      </div>

      <div className="modern-card !p-0 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FAFAFA] border-b border-[#F1F1F1]">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-widest">Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-widest">Phase</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-widest">Systolic</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-widest">Diastolic</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-widest">Pulse</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#AAAAAA] uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F5]">
            {readings.map(r => {
               const isHigh = r.systolic >= 140;
               return (
                  <tr key={r.id} className="hover:bg-[#FCFCFC] transition-colors">
                    <td className="px-8 py-5 font-bold text-sm text-[#111111]">{new Date(r.date || r.created_at).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                       <span className="px-2.5 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-lg text-[10px] font-bold text-[#999999] uppercase tracking-tighter">
                          {r.category}
                       </span>
                    </td>
                    <td className={`px-8 py-5 font-extrabold text-lg ${isHigh ? 'text-orange-600' : 'text-[#111111]'}`}>{r.systolic}</td>
                    <td className="px-8 py-5 font-extrabold text-lg text-[#111111]">{r.diastolic}</td>
                    <td className="px-8 py-5 font-bold text-sm text-[#999999]">{r.pulse} <span className="text-[10px] opacity-30">BPM</span></td>
                    <td className="px-8 py-5 text-right font-black uppercase text-[10px] tracking-widest text-[#CCCCCC]">
                       {r.systolic >= 140 ? 'CRITICAL' : 'OPTIMAL'}
                    </td>
                  </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
