import { useState } from 'react';
import { analyzeSoil } from '../services/soilApi';
import { getCropRecommendation } from '../services/cropApi';
import { getFertilizerPlan } from '../services/fertilizerApi';
import toast from 'react-hot-toast';

/* ── Client-Side Fallback Logic ── */
function getNutrientLevel(value, low, high) {
  if (value <= low) return 'Low';
  if (value <= high) return 'Medium';
  return 'High';
}

function localAnalyzeSoil(data) {
  const n = Number(data.nitrogen) || 0;
  const p = Number(data.phosphorus) || 0;
  const k = Number(data.potassium) || 0;
  const ph = Number(data.ph) || 7;
  const oc = Number(data.organicCarbon) || 0;

  const nLevel = getNutrientLevel(n, 150, 300);
  const pLevel = getNutrientLevel(p, 12, 25);
  const kLevel = getNutrientLevel(k, 120, 250);

  let score = 50;
  if (nLevel === 'High') score += 15; else if (nLevel === 'Medium') score += 8; else score -= 10;
  if (pLevel === 'High') score += 15; else if (pLevel === 'Medium') score += 8; else score -= 10;
  if (kLevel === 'High') score += 10; else if (kLevel === 'Medium') score += 5; else score -= 8;
  if (ph >= 6.0 && ph <= 7.5) score += 10; else if (ph >= 5.5 && ph <= 8.0) score += 3; else score -= 10;
  if (oc > 0.75) score += 10; else if (oc > 0.5) score += 5; else score -= 5;
  score = Math.max(0, Math.min(100, score));

  const soilType = ph < 5.5 ? 'Strongly Acidic' : ph < 6.5 ? 'Slightly Acidic' : ph < 7.5 ? 'Neutral' : ph < 8.5 ? 'Slightly Alkaline' : 'Strongly Alkaline';

  let analysis = `Soil Health Summary:\nYour soil scored ${score}/100 and is classified as ${soilType} (pH ${ph}).\n\n`;
  analysis += `Nutrient Analysis:\n`;
  analysis += `• Nitrogen (N): ${n} kg/ha — ${nLevel}${nLevel === 'Low' ? '. Consider applying Urea or organic compost to boost nitrogen levels.' : nLevel === 'High' ? '. Good levels. Avoid excess to prevent lodging.' : '. Adequate for most crops.'}\n`;
  analysis += `• Phosphorus (P): ${p} kg/ha — ${pLevel}${pLevel === 'Low' ? '. Apply DAP or Single Super Phosphate (SSP) to improve root development.' : pLevel === 'High' ? '. Sufficient. Reduce phosphorus inputs this season.' : '. Acceptable for general cropping.'}\n`;
  analysis += `• Potassium (K): ${k} kg/ha — ${kLevel}${kLevel === 'Low' ? '. Apply Muriate of Potash (MOP) to strengthen stems and improve quality.' : kLevel === 'High' ? '. No additional potash needed.' : '. Adequate for most crops.'}\n\n`;
  analysis += `Recommendations:\n`;
  analysis += `• ${ph < 6.0 ? 'Apply agricultural lime (CaCO₃) to raise pH closer to neutral.' : ph > 7.5 ? 'Consider gypsum application to lower alkaline pH.' : 'Soil pH is in the ideal range — no correction needed.'}\n`;
  analysis += `• ${oc < 0.5 ? 'Organic carbon is very low. Incorporate farmyard manure, vermicompost or green manure crops.' : 'Maintain organic carbon through regular compost and crop residue incorporation.'}\n`;
  analysis += `• Get soil tested every 6 months for continuous monitoring.`;

  return {
    healthScore: score,
    score,
    soilType,
    nutrients: {
      nitrogen: { value: n, level: nLevel, unit: 'kg/ha' },
      phosphorus: { value: p, level: pLevel, unit: 'kg/ha' },
      potassium: { value: k, level: kLevel, unit: 'kg/ha' },
    },
    ph: { value: ph, classification: soilType },
    organicCarbon: oc || null,
    analysis,
  };
}

function localRecommendCrops(data) {
  const n = Number(data.nitrogen) || 0;
  const p = Number(data.phosphorus) || 0;
  const k = Number(data.potassium) || 0;
  const ph = Number(data.ph) || 7;

  const CROP_DB = [
    { name: 'Rice', nMin: 200, pMin: 15, kMin: 100, phMin: 5.5, phMax: 7.0, season: 'Kharif' },
    { name: 'Wheat', nMin: 180, pMin: 18, kMin: 120, phMin: 6.0, phMax: 7.5, season: 'Rabi' },
    { name: 'Maize', nMin: 150, pMin: 12, kMin: 80, phMin: 5.5, phMax: 7.5, season: 'Kharif' },
    { name: 'Cotton', nMin: 120, pMin: 20, kMin: 100, phMin: 6.0, phMax: 8.0, season: 'Kharif' },
    { name: 'Soybean', nMin: 50, pMin: 30, kMin: 100, phMin: 6.0, phMax: 7.0, season: 'Kharif' },
    { name: 'Mustard', nMin: 80, pMin: 15, kMin: 60, phMin: 6.0, phMax: 8.0, season: 'Rabi' },
    { name: 'Gram', nMin: 40, pMin: 20, kMin: 80, phMin: 6.0, phMax: 8.0, season: 'Rabi' },
    { name: 'Sugarcane', nMin: 250, pMin: 25, kMin: 150, phMin: 6.0, phMax: 7.5, season: 'Kharif' },
    { name: 'Potato', nMin: 150, pMin: 20, kMin: 150, phMin: 5.5, phMax: 7.0, season: 'Rabi' },
    { name: 'Bajra', nMin: 60, pMin: 10, kMin: 40, phMin: 6.5, phMax: 8.5, season: 'Kharif' },
  ];

  const scored = CROP_DB.map(crop => {
    let s = 50;
    if (n >= crop.nMin) s += 15; else s -= Math.min(20, ((crop.nMin - n) / crop.nMin) * 30);
    if (p >= crop.pMin) s += 15; else s -= Math.min(20, ((crop.pMin - p) / crop.pMin) * 30);
    if (k >= crop.kMin) s += 10; else s -= Math.min(15, ((crop.kMin - k) / crop.kMin) * 25);
    if (ph >= crop.phMin && ph <= crop.phMax) s += 10; else s -= 15;
    s = Math.max(10, Math.min(98, Math.round(s)));
    return { name: crop.name, score: s, season: crop.season, reason: `${crop.season} crop. Needs N≥${crop.nMin}, P≥${crop.pMin}, K≥${crop.kMin} kg/ha, pH ${crop.phMin}-${crop.phMax}.` };
  });

  scored.sort((a, b) => b.score - a.score);
  return { topCrops: scored.slice(0, 6) };
}

function localFertilizerPlan(data) {
  const n = Number(data.nitrogen) || 0;
  const p = Number(data.phosphorus) || 0;
  const k = Number(data.potassium) || 0;

  const requirements = [];

  if (n < 240) {
    requirements.push({ nutrient: 'Nitrogen (N)', status: 'Low', fertilizer: 'Urea (46% N)', dose: `${Math.round((240 - n) / 0.46)} kg/acre` });
  }
  if (p < 22) {
    requirements.push({ nutrient: 'Phosphorus (P)', status: 'Low', fertilizer: 'DAP (18-46-0)', dose: `${Math.round((22 - p) / 0.46)} kg/acre` });
  }
  if (k < 135) {
    requirements.push({ nutrient: 'Potassium (K)', status: 'Low', fertilizer: 'MOP (60% K₂O)', dose: `${Math.round((135 - k) / 0.60)} kg/acre` });
  }

  return { requirements, crop: data.crop || 'General' };
}

/* ── Main Hook ── */
export function useSoil() {
  const [soilResult, setSoilResult] = useState(null);
  const [cropResult, setCropResult] = useState(null);
  const [fertilizerResult, setFertilizerResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (soilData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSoil(soilData);
      const payload = result.data || result;
      setSoilResult(payload);
      toast.success('Soil analysis complete!');
      return payload;
    } catch (err) {
      console.warn('Backend soil analysis failed, using local analysis:', err.message);
      const fallback = localAnalyzeSoil(soilData);
      setSoilResult(fallback);
      toast.success('Soil analysis complete!');
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const getCrops = async (soilData) => {
    setLoading(true);
    try {
      const result = await getCropRecommendation(soilData);
      const payload = result.data || result;
      setCropResult(payload);
      return payload;
    } catch (err) {
      console.warn('Backend crop recommendation failed, using local:', err.message);
      const fallback = localRecommendCrops(soilData);
      setCropResult(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const getFertilizer = async (soilData) => {
    setLoading(true);
    try {
      const result = await getFertilizerPlan(soilData);
      const payload = result.data || result;
      setFertilizerResult(payload);
      return payload;
    } catch (err) {
      console.warn('Backend fertilizer plan failed, using local:', err.message);
      const fallback = localFertilizerPlan(soilData);
      setFertilizerResult(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  return { soilResult, cropResult, fertilizerResult, loading, error, analyze, getCrops, getFertilizer };
}
