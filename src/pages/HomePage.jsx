import { Dashboard } from '../components/Dashboard.jsx';
import { Charts } from '../components/Charts.jsx';
import { BarChart3 } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Health Intelligence
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
            Blood Pressure <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-500 to-rose-400">
              Insight Engine.
            </span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
            Monitor, analyze, and optimize your cardiovascular health with a precision-engineered tracking experience.
          </p>
        </header>

        <Dashboard />

        <section className="mt-24 pt-12 border-t border-white/5 animate-fade-in">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              30-Day Trends
            </h2>
            <p className="text-slate-500 text-sm mt-1 ml-11">Visual analytics of your progress over time</p>
          </div>
          <div className="glass-card !p-8">
            <Charts />
          </div>
        </section>
      </div>
    </div>
  );
};
