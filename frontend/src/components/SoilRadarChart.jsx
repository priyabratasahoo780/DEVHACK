import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function SoilRadarChart({ nutrients }) {
  if (!nutrients) return null;

  // Normalize data for Radar Chart (0 to 100 based on standard ranges)
  const normalize = (val, max) => Math.min(100, Math.max(0, (val / max) * 100));

  const data = [
    { subject: 'Nitrogen (N)', A: normalize(nutrients.nitrogen?.value || 0, 400), fullMark: 100 },
    { subject: 'Phosphorus (P)', A: normalize(nutrients.phosphorus?.value || 0, 100), fullMark: 100 },
    { subject: 'Potassium (K)', A: normalize(nutrients.potassium?.value || 0, 400), fullMark: 100 },
    { subject: 'Soil pH', A: normalize(nutrients.ph?.value || 0, 14), fullMark: 100 },
    { subject: 'Org. Carbon (%)', A: normalize((nutrients.organicCarbon?.value || 0) * 100, 200), fullMark: 100 }
  ];

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all">
      <h3 className="text-lg font-extrabold text-gray-900 mb-4 text-center">Nutrient Balance Web</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Soil Health" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center text-gray-500 font-medium mt-2">A balanced shape indicates ideal soil health.</p>
    </div>
  );
}
