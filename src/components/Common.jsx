import { Heart } from 'lucide-react';

export const StatusIndicator = ({ systolic, diastolic }) => {
  const getStatus = () => {
    if (systolic >= 180 || diastolic >= 120) return { label: 'Critical', color: 'bg-red-500', textColor: 'text-red-500' };
    if (systolic >= 140 || diastolic >= 90) return { label: 'High', color: 'bg-red-400', textColor: 'text-red-400' };
    if (systolic >= 130 && systolic < 140) return { label: 'Elevated', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { label: 'Normal', color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const status = getStatus();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.color} bg-opacity-20 border ${status.textColor} border-opacity-30`}>
      <div className={`w-2 h-2 rounded-full ${status.color}`} />
      <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
    </div>
  );
};

export const ReadingCard = ({ reading }) => {
  return (
    <div className="card-glass">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-300 mb-2">{reading.category}</p>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-2xl font-bold">{reading.systolic}/{reading.diastolic}</p>
              <p className="text-xs text-gray-400">mmHg</p>
            </div>
            <div className="flex items-center gap-1 text-pink-400">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-lg font-semibold">{reading.pulse}</span>
            </div>
          </div>
        </div>
        <StatusIndicator systolic={reading.systolic} diastolic={reading.diastolic} />
      </div>
      <p className="text-xs text-gray-400">
        {new Date(reading.recorded_at).toLocaleString()}
      </p>
    </div>
  );
};

export const StatBox = ({ label, value, unit, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="card-glass">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-2">{label}</p>
          <p className="text-3xl font-bold mb-1">
            {typeof value === 'number' ? Math.round(value) : value}
            <span className="text-sm ml-2 text-gray-400">{unit}</span>
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
