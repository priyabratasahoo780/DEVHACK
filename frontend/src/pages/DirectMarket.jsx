import { Store, ShoppingCart, Smartphone, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet';

const COMPANIES = [
  { name: 'e-NAM', desc: 'Government online mandi portal. Sell anywhere in India.', web: 'https://enam.gov.in', type: 'Govt Portal' },
  { name: 'DeHaat', desc: 'Direct procurement from farm gate.', web: 'https://agrevolution.in', type: 'Agri-Tech' },
  { name: 'WayCool', desc: 'Sells directly to restaurants and supermarkets.', web: 'https://waycool.in', type: 'Supply Chain' },
  { name: 'Ninjacart', desc: 'Fastest B2B fresh produce supply chain.', web: 'https://ninjacart.com', type: 'B2B Buyers' },
  { name: 'ITC e-Choupal', desc: 'Direct buying of soybeans, wheat, coffee, etc.', web: 'https://www.itcportal.com', type: 'Corporate' }
];

export default function DirectMarket() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Direct Market (B2B) — Bina Bichauliye Becho | AgriSaar</title>
        <meta name="description" content="Sell your produce directly to companies like e-NAM, DeHaat, Ninjacart, WayCool, and ITC e-Choupal. Remove middlemen and get 20-40% higher prices for your crops." />
        <meta property="og:title" content="Direct Market (B2B) — Bina Bichauliye Becho | AgriSaar" />
        <meta property="og:description" content="Connect directly with large buyers — e-NAM, DeHaat, Ninjacart. Skip the mandi middlemen and maximize your farm income." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="direct market, B2B farming, e-NAM, DeHaat, Ninjacart, sell crops online, no middleman, bichauliye, AgriSaar" />
      </Helmet>
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 py-16 text-center px-4">
        <Store className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Direct Sell (B2B)</h1>
        <p className="text-emerald-100 text-lg max-w-2xl mx-auto font-medium">Bypass middlemen. Sell your produce directly to large companies and mandis.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-center gap-4">
            <TrendingUp className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="font-bold text-emerald-900">15-20% Extra Profit</p>
              <p className="text-sm text-emerald-700">Save on commission</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 flex items-center gap-4">
            <Smartphone className="w-10 h-10 text-blue-600" />
            <div>
              <p className="font-bold text-blue-900">Direct Payment</p>
              <p className="text-sm text-blue-700">Seedha bank account mein</p>
            </div>
          </div>
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-amber-600" />
            <div>
              <p className="font-bold text-amber-900">Contract Farming</p>
              <p className="text-sm text-amber-700">Pehle se price fix</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-green-600" /> Top Buyers & Platforms
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPANIES.map((co, i) => (
            <a key={i} href={co.web} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-green-400 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                  {co.type}
                </span>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{co.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{co.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
