import { MapPin, Target, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, FlaskConical, Beaker, Flame, ThermometerSun, Leaf } from 'lucide-react';

const soilSchema = z.object({
  nitrogen: z.coerce.number().min(0, 'Must be positive').max(1000),
  phosphorus: z.coerce.number().min(0, 'Must be positive').max(500),
  potassium: z.coerce.number().min(0, 'Must be positive').max(1000),
  ph: z.coerce.number().min(0).max(14, 'pH must be 0-14'),
  organicCarbon: z.coerce.number().min(0).max(10).optional(),
  location: z.string().min(2, 'Enter location').optional(),
  crop: z.string().optional()
});

export default function SoilForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(soilSchema),
    defaultValues: { nitrogen: '', phosphorus: '', potassium: '', ph: '', organicCarbon: '', location: '', crop: '' }
  });

  const fields = [
    { name: 'nitrogen', label: 'Nitrogen (N)', placeholder: 'e.g. 240 kg/ha', icon: <Leaf className="w-4 h-4 text-green-500" /> },
    { name: 'phosphorus', label: 'Phosphorus (P)', placeholder: 'e.g. 18 kg/ha', icon: <Beaker className="w-4 h-4 text-blue-500" /> },
    { name: 'potassium', label: 'Potassium (K)', placeholder: 'e.g. 200 kg/ha', icon: <Flame className="w-4 h-4 text-orange-500" /> },
    { name: 'ph', label: 'pH Level', placeholder: 'e.g. 6.5', icon: <FlaskConical className="w-4 h-4 text-purple-500" /> },
    { name: 'organicCarbon', label: 'Organic Carbon (%)', placeholder: 'e.g. 0.65', icon: <ThermometerSun className="w-4 h-4 text-amber-600" /> }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {fields.map(field => (
          <div key={field.name}>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              {field.icon} {field.label}
            </label>
            <input
              type="number"
              step="any"
              {...register(field.name)}
              placeholder={field.placeholder}
              className={`input-field bg-[#f8f9fa] border-none shadow-clay-input focus:shadow-clay-card transition-shadow rounded-xl ${errors[field.name] ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {errors[field.name].message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" /> Location
          </label>
          <input
            type="text"
            {...register('location')}
            placeholder="e.g. Ahmedabad, Gujarat"
            className="input-field bg-[#f8f9fa] border-none shadow-clay-input focus:shadow-clay-card transition-shadow rounded-xl"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" /> Crop (optional)
          </label>
          <input
            type="text"
            {...register('crop')}
            placeholder="e.g. Wheat, Rice"
            className="input-field bg-[#f8f9fa] border-none shadow-clay-input focus:shadow-clay-card transition-shadow rounded-xl"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-green-500 text-white rounded-[2rem] py-4 px-6 font-black text-lg flex items-center justify-center gap-3 hover:shadow-clay-card shadow-clay-btn border-none transition-all active:scale-95 mt-4">
        {loading ? (
          <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing Report...</>
        ) : (
          <><Sparkles className="w-5 h-5 text-yellow-400" /> Analyze Soil — Start AI Analysis</>
        )}
      </button>
    </form>
  );
}
