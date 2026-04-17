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
    <div className="pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-8">
        <header className="mb-24 animate-modern-fade">
          <div className="flex items-center gap-6">
            <div className="p-4 border border-white/20 text-white">
              <Clock className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Logging.</h1>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Biometric data acquisition interface</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Section */}
          <div className="lg:col-span-4 space-y-12 animate-modern-fade">
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] ml-1 mb-6">Phase Selector</p>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black tracking-widest text-[11px] uppercase">{category}</span>
                    {activeCategory === category && (
                      <div className="w-1 h-3 bg-black" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <LogForm category={activeCategory} onSuccess={handleSuccess} />
          </div>

          {/* History Section */}
          <div className="lg:col-span-8 animate-modern-fade [animation-delay:150ms]">
            <HistoryList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};
