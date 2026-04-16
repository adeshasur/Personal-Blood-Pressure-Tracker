import { Dashboard } from '../components/Dashboard';
import { Charts } from '../components/Charts';
import { BarChart3, TrendingUp } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Blood Pressure Tracker
          </h1>
          <p className="text-gray-400 text-lg">Monitor your health with ease</p>
        </div>

        <Dashboard />

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-400" />
            30-Day Trends
          </h2>
          <Charts />
        </div>
      </div>
    </div>
  );
};
