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
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            Log Reading
          </h1>
          <p className="text-gray-400">Record your blood pressure and pulse</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="space-y-3 mb-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeCategory === category
                      ? 'glass border-blue-500/50 border'
                      : 'glass hover:border-gray-600/50 border border-gray-700/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <LogForm category={activeCategory} onSuccess={handleSuccess} />
          </div>

          {/* History Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Recent Readings</h2>
            <HistoryList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};
