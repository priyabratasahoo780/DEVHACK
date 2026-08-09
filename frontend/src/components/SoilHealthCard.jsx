import { Activity } from 'lucide-react';

export default function SoilHealthCard({ score, soilType, nutrients }) {
  const getScoreColor = (s) => {
    if (s >= 75) return { color: '#22c55e', label: 'Excellent', bg: 'bg-green-50' };
    if (s >= 50) return { color: '#f59e0b', label: 'Average', bg: 'bg-yellow-50' };
    return { color: '#ef4444', label: 'Poor', bg: 'bg-red-50' };
  };

  const scoreInfo = getScoreColor(score || 0);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - ((score || 0) / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest text-sm">Soil Health Score</h3>
      </div>

      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90 filter drop-shadow-sm" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="12" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke={scoreInfo.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold" style={{ color: scoreInfo.color }}>{score || 0}</span>
          <span className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">out of 100</span>
        </div>
      </div>

      <div className={`inline-block px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${scoreInfo.bg}`} style={{ color: scoreInfo.color }}>
        {scoreInfo.label}
      </div>

      {soilType && (
        <p className="mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500">
          Soil Type: <span className="font-extrabold text-gray-900">{soilType}</span>
        </p>
      )}

      {nutrients && (
        <div className="mt-4 space-y-3">
          {Object.entries(nutrients).map(([key, data]) => (
            <div key={key} className="flex items-center justify-between text-sm px-2">
              <span className="text-gray-600 font-semibold capitalize">{key}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((data.value / 400) * 100, 100)}%`,
                      backgroundColor: data.level === 'High' ? '#22c55e' : data.level === 'Medium' ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  data.level === 'High' ? 'bg-green-50 text-green-700' :
                  data.level === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {data.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
