import { ExternalLink, CheckCircle2, Landmark, ShieldCheck } from 'lucide-react';

export default function SchemeCard({ name, benefit, eligibility, url, applySteps }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group">
      <div className="flex items-start gap-4 mb-5 pb-5 border-b border-gray-50">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 leading-snug">{name}</h4>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50/50 p-4 rounded-xl">
          <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Benefit</p>
          <p className="text-sm font-semibold text-gray-900">{benefit}</p>
        </div>

        <div className="flex items-start gap-3 px-1">
          <ShieldCheck className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-0.5">Eligibility</p>
            <p className="text-sm text-gray-700 font-medium">{eligibility}</p>
          </div>
        </div>

        {applySteps && applySteps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-primary-800 mb-3">How to Apply</p>
            {applySteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600 font-medium">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-gray-50 hover:bg-primary-50 text-primary-700 rounded-xl text-sm font-bold transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Website Visit Karein
        </a>
      )}
    </div>
  );
}
