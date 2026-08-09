import { TrendingUp, TrendingDown, Minus, Wheat, Lightbulb } from 'lucide-react';

export default function MarketCard({ crop, price, trend, recommendation }) {
  const trendConfig = {
    up: { icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-700', bg: 'bg-green-50 border-green-100', label: 'Price Badhega' },
    down: { icon: <TrendingDown className="w-4 h-4" />, color: 'text-red-700', bg: 'bg-red-50 border-red-100', label: 'Price Girega' },
    stable: { icon: <Minus className="w-4 h-4" />, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-100', label: 'Stable Price' }
  };

  const t = trendConfig[trend] || trendConfig.stable;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Wheat className="w-5 h-5 text-gray-600" />
          </div>
          {crop}
        </h4>
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${t.bg} ${t.color}`}>
          {t.icon} {t.label}
        </span>
      </div>

      {price && (
        <div className="mb-5 pb-5 border-b border-gray-50">
          <span className="text-4xl font-extrabold text-primary-900">₹{price}</span>
          <span className="text-sm font-semibold text-gray-400 ml-2 tracking-wide uppercase">/ quintal</span>
        </div>
      )}

      {recommendation && (
        <div className="bg-primary-50/50 p-4 rounded-xl flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium text-gray-700 leading-relaxed max-w-sm">{recommendation}</p>
        </div>
      )}
    </div>
  );
}
