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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-[#F5F5F5] pb-12">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#999999]">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Electronic Health Record
            </div>
            <h1 className="text-6xl font-extrabold tracking-tighter text-[#111111]">
              Data <span className="text-[#DDDDDD]">Journal.</span>
            </h1>
            <p className="text-[#888888] font-medium tracking-tight max-w-lg text-lg">
              Precisely record your biometric readings into your secure local ledger for long-term clinical oversight.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="modern-card !p-4 flex items-center gap-3 border-none bg-[#FAFAFA] shadow-none">
              <div className="p-2.5 bg-white border border-[#F1F1F1] rounded-xl">
                 <Calendar className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-[#AAAAAA] uppercase">Current Date</p>
                 <p className="text-sm font-bold text-[#111111]">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 h-fit">
            <div className="space-y-6">
               <div className="flex items-center gap-3 mb-2 px-1">
                 <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold text-xs shadow-lg">01</div>
                 <h3 className="text-sm font-black text-[#111111] uppercase tracking-[0.2em]">Capture Data</h3>
               </div>
               <LogForm onReadingsUpdate={handleReadingsUpdate} />
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
               <div className="flex items-center justify-between mb-2 px-1">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAFAFA] border border-[#F1F1F1] flex items-center justify-center text-[#111111] font-bold text-xs">02</div>
                    <h3 className="text-sm font-black text-[#111111] uppercase tracking-[0.2em]">Entry History</h3>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-[#CCCCCC] uppercase tracking-widest">
                    <History className="w-3.5 h-3.5" />
                    Real-time Sync
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
