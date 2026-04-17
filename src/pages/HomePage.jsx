import { Dashboard } from '../components/Dashboard.jsx';
import { Charts } from '../components/Charts.jsx';
import { BarChart3 } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-8">
        <header className="mb-32 animate-modern-fade">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mb-8">
            Diagnostic Monitor
          </div>
          <h1 className="text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            HEART <br/>
            LEDR SYSTEM.
          </h1>
          <p className="text-slate-600 text-lg font-bold max-w-xl leading-relaxed uppercase tracking-tight">
            High-precision cardiovascular data monitoring and historical analysis engine.
          </p>
        </header>

        <Dashboard />

        <section className="mt-32 pt-24 border-t border-white/5 animate-modern-fade">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 border border-white/20 text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Trend Analysis</h2>
            </div>
            <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.2em] ml-14">Aggregate data visualization (30-day index)</p>
          </div>
          <div className="modern-card !p-12">
            <Charts />
          </div>
        </section>
      </div>
    </div>
  );
};
