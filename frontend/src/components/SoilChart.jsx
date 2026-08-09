import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Leaf, Droplets, Flame, Activity } from 'lucide-react';

const COLORS = ['#e2e8f0', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Gauge = ({ name, value, max, icon, color, unit, statusText, advice }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const data = [
    { name: 'Value', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="flex items-center gap-2 mb-2 w-full">
        {icon}
        <h4 className="font-extrabold text-gray-800 tracking-wide text-sm">{name}</h4>
      </div>
      
      <div className="h-40 w-full relative -mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="70%"
              innerRadius="60%"
              outerRadius="80%"
              stroke="none"
              cornerRadius={10}
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
          <span className="text-3xl font-black" style={{ color }}>{value}</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{unit}</span>
        </div>
      </div>
      
      <div className="w-full text-center mt-6">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3"
           style={{ backgroundColor: `${color}15`, color }}>
          {statusText}
        </div>
        <p className="text-sm font-semibold text-gray-600 leading-relaxed min-h-[40px]">
          {advice}
        </p>
      </div>
    </div>
  );
};

export default function SoilChart({ nutrients }) {
  if (!nutrients) return null;

  const n = nutrients.nitrogen?.value || 0;
  const p = nutrients.phosphorus?.value || 0;
  const k = nutrients.potassium?.value || 0;
  const ph = nutrients.ph?.value || 0;

  // Simple logic for plain-language advice
  const getStatus = (val, min, max) => {
    if (val < min) return { text: 'Low', advice: 'Soil is deficient. Consider increasing this nutrient.', color: '#ef4444' };
    if (val > max) return { text: 'High', advice: 'Excess amount detected. Do not add more right now.', color: '#f59e0b' };
    return { text: 'Optimal', advice: 'Perfect level! Keep it up.', color: '#10b981' };
  };

  const phStatus = 
    ph < 6 ? { text: 'Acidic', advice: 'Apply lime (calcium) to correct the pH level.', color: '#f59e0b' } :
    ph > 7.5 ? { text: 'Alkaline', advice: 'Consider using gypsum to correct soil pH.', color: '#ef4444' } :
    { text: 'Normal', advice: 'Soil pH level is excellent.', color: '#10b981' };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
      <Gauge 
        name="Nitrogen (N)" 
        value={n} 
        max={400} 
        unit="kg/ha"
        icon={<Leaf className="w-5 h-5 text-blue-500" />}
        color={getStatus(n, 150, 300).color}
        statusText={getStatus(n, 150, 300).text}
        advice={getStatus(n, 150, 300).advice}
      />
      <Gauge 
        name="Phosphorus (P)" 
        value={p} 
        max={100} 
        unit="kg/ha"
        icon={<Flame className="w-5 h-5 text-purple-500" />}
        color={getStatus(p, 25, 60).color}
        statusText={getStatus(p, 25, 60).text}
        advice={getStatus(p, 25, 60).advice}
      />
      <Gauge 
        name="Potassium (K)" 
        value={k} 
        max={400} 
        unit="kg/ha"
        icon={<Droplets className="w-5 h-5 text-amber-500" />}
        color={getStatus(k, 150, 250).color}
        statusText={getStatus(k, 150, 250).text}
        advice={getStatus(k, 150, 250).advice}
      />
      <Gauge 
        name="Soil pH" 
        value={ph} 
        max={14} 
        unit="pH Scale"
        icon={<Activity className="w-5 h-5 text-pink-500" />}
        color={phStatus.color}
        statusText={phStatus.text}
        advice={phStatus.advice}
      />
    </div>
  );
}
