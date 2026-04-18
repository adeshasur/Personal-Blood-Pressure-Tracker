import { useState } from 'react';
import { LogForm } from '../components/LogForm.jsx';
import { HistoryList } from '../components/HistoryList.jsx';
import { Calendar, History, ClipboardCheck } from 'lucide-react';

export const LogPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReadingsUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-black uppercase tracking-widest text-[#999999]">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Electronic Health Record
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-[#111111] leading-[0.9]">
              Capture <span className="text-[#DDDDDD]">Journal.</span>
            </h1>
            <p className="text-[#888888] font-medium tracking-tight max-w-lg text-lg">
              Precisely record and archive your biometric readings into your secure local ledger for clinical oversight.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-[#BBBBBB] uppercase tracking-widest leading-none mb-1.5">System Date</span>
               <span className="text-sm font-black text-[#111111]">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#FAFAFA] border border-[#F1F1F1] flex items-center justify-center shadow-sm">
               <Calendar className="w-6 h-6 text-[#111111]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Column */}
          <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-36 h-fit">
            <div className="space-y-6">
               <div className="flex items-center gap-3 mb-2 px-1">
                 <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white font-black text-xs shadow-lg">01</div>
                 <h3 className="text-sm font-black text-[#111111] uppercase tracking-[0.25em]">Biometric Entry</h3>
               </div>
               <LogForm onReadingsUpdate={handleReadingsUpdate} />
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-12 xl:col-span-8">
            <div className="space-y-6">
               <div className="flex items-center justify-between mb-2 px-1">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAFAFA] border border-[#F1F1F1] flex items-center justify-center text-[#111111] font-black text-xs shadow-sm">02</div>
                    <h3 className="text-sm font-black text-[#111111] uppercase tracking-[0.25em]">Archive History</h3>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-[#BBBBBB] uppercase tracking-widest">
                    <History className="w-3.5 h-3.5" />
                    Archive Sync Active
                 </div>
               </div>
               <HistoryList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
