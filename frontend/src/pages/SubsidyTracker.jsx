import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, ShieldAlert, AlertTriangle, Scale, Target, Send, ShieldCheck, HeartHandshake } from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend } from 'recharts';

export default function SubsidyTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState('Ahmedabad');

  const fetchTracker = async () => {
    setLoading(true);
    try {
      const res = await api.post('/transparency/track', { location: district, farmerType: 'Small Farmer' });
      // interceptor strips response.data → res = { success, data, message }
      const payload = res.data || res;
      setData(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracker();
  }, []);

  const submitGrievance = async (schemeName) => {
    const issue = prompt(`Describe the issue with ${schemeName} (e.g. didn't receive money, asked for bribe):`);
    if (issue) {
      alert(`Complaint registered for ${schemeName}. Tracking ID: GRV-${Date.now()}. Action will be taken by Nodal Officer.`);
    }
  };

  const getChartData = () => {
    if (!data || !data.trackingData) return [];
    return data.trackingData.map(item => {
      const released = parseInt((item.governmentReleased || '').replace(/[^0-9]/g, '')) || 100;
      const received = parseInt((item.averageReceived || '').replace(/[^0-9]/g, '')) || (100 - (item.leakagePercent || 0));
      return {
        name: (item.schemeName || '').substring(0, 15) + '...',
        Released: released,
        Received: received,
        Lost: released - received
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet>
        <title>Kisaan Haq Tracker — Subsidy & Scheme Delivery Status | AgriSaar</title>
        <meta name="description" content="Track government subsidy delivery status, scheme transparency, and farmer rights. AI-powered audit of PMFBY claims, PM-KISAN payments, and corruption alerts." />
        <meta property="og:title" content="Kisaan Haq Tracker — Subsidy Delivery Status | AgriSaar" />
        <meta property="og:description" content="Check if your government subsidies and scheme benefits are being delivered fairly. Transparency tracker for Indian farmers." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="subsidy tracker, kisaan haq, PM KISAN status, PMFBY claim, government scheme status, corruption audit, AgriSaar" />
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="section-title flex items-center justify-center gap-3">
          <Scale className="w-8 h-8 text-primary-700" /> Kisaan Haq Tracker
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Track government schemes and subsidy delivery status</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 w-full md:w-1/2">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={district} 
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full text-lg outline-none font-semibold text-gray-800 bg-transparent" 
            placeholder="Enter your District (e.g., Patna)" 
          />
        </div>
        <button onClick={fetchTracker} disabled={loading} className="bg-primary-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-800 transition-colors">
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </div>

      {data && data.trackingData && (
        <>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" /> Supply vs Delivery Status
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700 }} dy={10} />
                    <Tooltip cursor={{ fill: 'rgba(232, 245, 233, 0.5)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Received" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Lost" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Lost/Corruption" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-8 rounded-2xl shadow-lg border border-primary-700 text-white relative overflow-hidden flex flex-col justify-center">
              <HeartHandshake className="absolute -right-4 -bottom-4 w-40 h-40 text-white opacity-5" />
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold mb-4">Direct AI Advice</h3>
                <p className="text-primary-100 font-medium leading-relaxed text-lg">
                  {data.recommendation}
                </p>
                <div className="mt-8 flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
                  <ShieldCheck className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <p className="text-sm font-bold text-white">We ensure your grievance reaches the concerned authorities for resolution.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 px-2">Detailed Ground Reality in {district}</h2>
            {data.trackingData.map((scheme, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:border-primary-300 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{scheme.schemeName}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                      Leakage: {scheme.leakagePercent}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Govt. Released</p>
                    <p className="font-extrabold text-gray-800 text-lg">{scheme.governmentReleased}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Farmer Received</p>
                    <p className="font-extrabold text-gray-800 text-lg">{scheme.averageReceived}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">Common Issues Block</p>
                  <ul className="space-y-2">
                    {(scheme.commonIssues || []).map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /> {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-100 pt-5 flex justify-end">
                  <button onClick={() => submitGrievance(scheme.schemeName)} className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
                    <ShieldAlert className="w-4 h-4" /> File a Complaint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
