import { useState } from 'react';
import { LogForm } from '../components/LogForm';
import { HistoryList } from '../components/HistoryList';
import { Clock } from 'lucide-react';

export const LogPage = () => {
  const [activeCategory, setActiveCategory] = useState('Morning');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const categories = ['Morning', 'Afternoon', 'Evening'];

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Record Daily Vitals</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Keep your health data accurate and up-to-date</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-4 space-y-8 animate-fade-in">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-4">Selection Category</p>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeCategory === category
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'glass-card text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-tight">{category}</span>
                    {activeCategory === category && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <LogForm category={activeCategory} onSuccess={handleSuccess} />
          </div>

          {/* History Section */}
          <div className="lg:col-span-8 animate-fade-in [animation-delay:200ms]">
            <HistoryList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};
