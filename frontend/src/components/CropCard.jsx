import { TrendingUp, Award, Droplets, Sprout, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';
const CROP_IMAGES = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  rice: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
  maize: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
  cotton: 'https://images.unsplash.com/photo-1590483864197-0ec997a39833?auto=format&fit=crop&w=800&q=80',
  sugarcane: 'https://images.unsplash.com/photo-1596752718105-d326ccbc126f?auto=format&fit=crop&w=800&q=80',
  gram: 'https://images.unsplash.com/photo-1599557451369-0260afad9d19?auto=format&fit=crop&w=800&q=80',
  mustard: 'https://images.unsplash.com/photo-1616422329764-9dfcffc2bc4a?auto=format&fit=crop&w=800&q=80',
  soybean: 'https://images.unsplash.com/photo-1598284699564-9eb51e8adbc5?auto=format&fit=crop&w=800&q=80',
  bajra: 'https://images.unsplash.com/photo-1535405814088-7eecd04e4ecb?auto=format&fit=crop&w=800&q=80',
  jowar: 'https://images.unsplash.com/photo-1582239634952-b8d960f2bb97?auto=format&fit=crop&w=800&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1599839619711-2eb2ce0ab0eb?auto=format&fit=crop&w=800&q=80'
};

const getCropImage = (name) => {
  if (!name) return CROP_IMAGES.default;
  const lowerName = name.toLowerCase();
  for (const [key, url] of Object.entries(CROP_IMAGES)) {
    if (lowerName.includes(key)) return url;
  }
  return CROP_IMAGES.default;
};

export default function CropCard({ rank, name, score, reason }) {
  const isTop = rank === 1;
  const bgColors = {
    1: 'bg-green-50 border-green-200',
    2: 'bg-emerald-50 border-emerald-200',
    3: 'bg-lime-50 border-lime-200'
  };

  const textColors = {
    1: 'text-green-700',
    2: 'text-emerald-700',
    3: 'text-lime-700'
  };

  const barColors = {
    1: 'bg-gradient-to-r from-green-400 to-green-600',
    2: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    3: 'bg-gradient-to-r from-lime-400 to-lime-600'
  };

  const imageUrl = getCropImage(name);

  // Fake weather/season data for demo based on name length or static to make UI look good
  const season = name.length > 5 ? 'Kharif' : 'Rabi';
  const temp = name.length > 5 ? '28°C - 35°C' : '15°C - 25°C';

  return (
    <div className={`bg-white rounded-3xl shadow-sm border hover:border-green-400 relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 group flex flex-col ${bgColors[rank] || bgColors[3]}`}>
      <div className="h-48 w-full relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/30 to-transparent"></div>
        {isTop && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-green-800 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-green-100 uppercase tracking-widest">
            <Award className="w-4 h-4 text-green-600" /> Top Match
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center shadow-lg border border-gray-100 uppercase tracking-wider">
          {season}
        </div>

        <h4 className="absolute bottom-4 left-5 text-3xl font-black text-white drop-shadow-xl">{name}</h4>
      </div>

      <div className="p-6 flex-grow flex flex-col bg-white">

        <div className="flex gap-2 mb-5">
          <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Droplets className="w-3 h-3" /> Opt. Water
          </span>
          <span className="bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Thermometer className="w-3 h-3" /> {temp}
          </span>
        </div>

        {score && (
          <div className="mb-5 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between text-xs font-black mb-2 uppercase tracking-wide">
              <span className="text-gray-500">Soil Health Match</span>
              <span className={textColors[rank] || textColors[3]}>{score}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${barColors[rank] || barColors[3]}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        )}

        {reason && (
          <p className="text-sm text-gray-600 leading-relaxed font-medium mt-auto mb-5">
            <span className="text-green-600 font-black mr-2">Why?</span>{reason}
          </p>
        )}

        {/* Link to Fertilizer Planner */}
        <Link
          to="/fertilizer"
          className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-sm font-black transition-all shadow-md group-hover:shadow-lg"
        >
          <Sprout className="w-4 h-4" /> Plan Fertilizer
        </Link>
      </div>
    </div>
  );
}
