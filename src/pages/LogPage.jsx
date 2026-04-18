import { ClipboardCheck } from 'lucide-react';
import { LogForm } from '../components/LogForm';
import { HistoryList } from '../components/HistoryList';
import { pressureService } from '../services/api';
import { useState, useEffect } from 'react';

export const LogPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const response = await pressureService.getHistory();
            setHistory(response.data);
        } catch (err) {
            console.error('Fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        try {
            await pressureService.deleteReading(id);
            fetchHistory();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    return (
      <div className="page-container page-transition">
        
        {/* Header Section */}
        <div className="header-section flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#F1F1F1] rounded-full text-[10px] font-black uppercase tracking-widest text-[#999999]">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Electronic Health Record
            </div>
            <h1 className="page-title">
              Capture <span className="text-[#DDDDDD]">Journal.</span>
            </h1>
            <p className="page-description">
              Precisely record and archive your biometric readings into your secure cloud ledger.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <LogForm onSuccess={fetchHistory} />
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="modern-card p-12 text-center text-[10px] font-black text-[#DDDDDD] uppercase tracking-widest">
                Retrieving clinical history...
              </div>
            ) : (
              <HistoryList history={history} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    );
};
