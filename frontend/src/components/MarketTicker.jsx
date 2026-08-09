import { Wheat, Leaf, Sprout, Flower2, CircleDollarSign } from 'lucide-react';

const tickers = [
  { name: 'Wheat', price: '₹2,275/q', change: '▲2.1%', up: true },
  { name: 'Rice', price: '₹3,100/q', change: '▲1.4%', up: true },
  { name: 'Mustard', price: '₹5,650/q', change: '▼0.8%', up: false },
  { name: 'Soybean', price: '₹4,200/q', change: '▲3.2%', up: true },
  { name: 'Maize', price: '₹1,985/q', change: '▲0.5%', up: true },
  { name: 'Onion', price: '₹2,800/q', change: '▼1.2%', up: false },
  { name: 'Potato', price: '₹1,450/q', change: '▲4.1%', up: true },
  { name: 'Tomato', price: '₹3,900/q', change: '▲7.3%', up: true },
  { name: 'Cotton', price: '₹6,200/q', change: '▲1.8%', up: true },
  { name: 'Groundnut', price: '₹5,850/q', change: '▼0.4%', up: false },
];

export default function MarketTicker() {
  return (
    <div className="bg-gradient-to-r from-[#0a1a0c] via-[#0d2210] to-[#0a1a0c] border-y border-green-900/50 py-2.5 overflow-hidden relative z-30">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-green-500 text-white text-xs font-black px-4 py-1 rounded-r-full tracking-widest uppercase shadow-lg z-10">
          LIVE MANDI
        </div>
        <div className="overflow-hidden flex-1">
          <div
            className="flex gap-8 whitespace-nowrap"
            style={{ animation: 'ticker 35s linear infinite' }}
          >
            {[...tickers, ...tickers].map((item, i) => (
              <span key={i} className="text-sm text-green-100 font-semibold tracking-wide inline-flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-green-400" />
                {item.name} {item.price} <span className={item.up ? 'text-green-400' : 'text-red-400'}>{item.change}</span>
                <span className="text-green-700 mx-4">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
