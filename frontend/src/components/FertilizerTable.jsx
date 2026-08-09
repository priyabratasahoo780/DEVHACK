import { CheckCircle2, FlaskConical } from 'lucide-react';

export default function FertilizerTable({ quickReference }) {
  if (!quickReference || quickReference.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Soil is perfectly balanced!</h3>
        <p className="text-gray-500 font-medium tracking-wide">All nutrients are balanced — no extra fertilizer needed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-primary-900 px-6 py-5 flex items-center gap-3">
        <FlaskConical className="w-6 h-6 text-primary-200" />
        <h3 className="text-white font-bold text-lg tracking-wide">Fertilizer Plan</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50 border-b border-primary-100">
              <th className="text-left px-6 py-4 text-xs font-extrabold tracking-wider uppercase text-primary-800">Nutrient</th>
              <th className="text-left px-6 py-4 text-xs font-extrabold tracking-wider uppercase text-primary-800">Status</th>
              <th className="text-left px-6 py-4 text-xs font-extrabold tracking-wider uppercase text-primary-800">Fertilizer</th>
              <th className="text-left px-6 py-4 text-xs font-extrabold tracking-wider uppercase text-primary-800">Dose/Acre</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {quickReference.map((item, i) => (
              <tr key={i} className="hover:bg-primary-50/20 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-900">{item.nutrient}</td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-red-700">
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 font-bold text-primary-700">{item.fertilizer}</td>
                <td className="px-6 py-5">
                  <span className="bg-gray-50 px-3 py-1.5 rounded-md text-gray-700 font-semibold text-sm">
                    {item.dose}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
