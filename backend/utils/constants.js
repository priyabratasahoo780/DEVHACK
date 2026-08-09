export const SOIL_THRESHOLDS = {
  nitrogen: { low: 140, medium: 280, high: 400, unit: 'kg/ha' },
  phosphorus: { low: 10, medium: 25, high: 50, unit: 'kg/ha' },
  potassium: { low: 110, medium: 280, high: 400, unit: 'kg/ha' },
  organicCarbon: { low: 0.4, medium: 0.75, high: 1.0, unit: '%' }
};

export const PH_RANGES = {
  veryAcidic: { min: 0, max: 4.5, label: 'Very Acidic' },
  acidic: { min: 4.5, max: 6.0, label: 'Acidic' },
  slightlyAcidic: { min: 6.0, max: 6.5, label: 'Slightly Acidic' },
  neutral: { min: 6.5, max: 7.5, label: 'Neutral' },
  slightlyAlkaline: { min: 7.5, max: 8.0, label: 'Slightly Alkaline' },
  alkaline: { min: 8.0, max: 9.0, label: 'Alkaline' },
  veryAlkaline: { min: 9.0, max: 14, label: 'Very Alkaline' }
};

export const SEASONS = {
  kharif: { months: [6, 7, 8, 9, 10], label: 'Kharif (Monsoon)', crops: ['Rice', 'Maize', 'Soybean', 'Cotton', 'Groundnut', 'Bajra', 'Jowar'] },
  rabi: { months: [10, 11, 12, 1, 2, 3], label: 'Rabi (Winter)', crops: ['Wheat', 'Gram', 'Mustard', 'Barley', 'Peas', 'Lentil'] },
  zaid: { months: [3, 4, 5, 6], label: 'Zaid (Summer)', crops: ['Moong', 'Watermelon', 'Cucumber', 'Sunflower', 'Muskmelon'] }
};

export const FERTILIZER_MAP = {
  nitrogen: { name: 'Urea', content: '46% N', defaultDose: '25-30 kg/acre' },
  phosphorus: { name: 'DAP', content: '46% P₂O₅, 18% N', defaultDose: '25 kg/acre' },
  potassium: { name: 'MOP (Muriate of Potash)', content: '60% K₂O', defaultDose: '15-20 kg/acre' },
  zinc: { name: 'Zinc Sulphate', content: '33% Zn', defaultDose: '5 kg/acre' },
  sulphur: { name: 'Gypsum', content: '18% S', defaultDose: '20 kg/acre' }
};

export const GOVERNMENT_SCHEMES = [
  {
    name: 'PM-Kisan Samman Nidhi',
    benefit: 'Direct cash transfer to farmers',
    amount: '₹6,000/year (3 installments of ₹2,000)',
    eligibility: 'All land-holding farmer families',
    category: 'Direct Benefit',
    description: 'Har 4 mahine mein ₹2,000 seedha bank account mein. Sabse popular scheme.',
    url: 'https://pmkisan.gov.in',
    documents: ['Aadhaar Card', 'Bank Account', 'Land Papers (Khasra/Khatauni)']
  },
  {
    name: 'Soil Health Card Scheme',
    benefit: 'Free soil testing with nutrient report',
    amount: 'Free (₹0 cost to farmer)',
    eligibility: 'All farmers across India',
    category: 'Support',
    description: 'Mitti ki poori health report free mein. NPK, pH, organic carbon sab pata chalega.',
    url: 'https://soilhealth.dac.gov.in',
    documents: ['Aadhaar Card', 'Land Details']
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    benefit: 'Crop insurance against natural calamities',
    amount: 'Premium: 2% Kharif, 1.5% Rabi (Govt pays rest, up to ₹2,00,000 claim)',
    eligibility: 'All farmers growing notified crops',
    category: 'Insurance',
    description: 'Fasal kharab hone par insurance milega. Baarish, sukhad, keede — sab cover hai.',
    url: 'https://pmfby.gov.in',
    documents: ['Aadhaar Card', 'Bank Account', 'Land Papers', 'Sowing Certificate']
  },
  {
    name: 'Kisan Credit Card (KCC)',
    benefit: 'Low-interest agricultural loan',
    amount: 'Loan up to ₹3,00,000 @ 4% interest (with subsidy)',
    eligibility: 'All farmers, sharecroppers, tenant farmers',
    category: 'Loan',
    description: '4% interest pe loan milega farming ke liye. Fertilizer, seeds, equipment — sab ke liye.',
    url: 'https://www.nabard.org',
    documents: ['Aadhaar Card', 'PAN Card', 'Land Papers', 'Passport Photo']
  },
  {
    name: 'PM Krishi Sinchai Yojana (PMKSY)',
    benefit: 'Irrigation support and micro-irrigation subsidy',
    amount: '55%-75% subsidy on drip/sprinkler irrigation',
    eligibility: 'Farmers with irrigation needs',
    category: 'Subsidy',
    description: 'Drip irrigation ya sprinkler lagwane par 55-75% subsidy. Paani bachao, fasal badhao.',
    url: 'https://pmksy.gov.in',
    documents: ['Aadhaar Card', 'Land Papers', 'Bank Account', 'Quotation from Dealer']
  },
  {
    name: 'e-NAM (National Agriculture Market)',
    benefit: 'Online mandi trading for better prices',
    amount: 'Free registration (earn 10-15% more through online trading)',
    eligibility: 'All farmers with produce to sell',
    category: 'Market',
    description: 'Online mandi pe fasal becho. Local mandi se zyada price milega. Transparent pricing.',
    url: 'https://enam.gov.in',
    documents: ['Aadhaar Card', 'Bank Account', 'Mobile Number']
  },
  {
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    benefit: 'Organic farming support',
    amount: '₹50,000/hectare (over 3 years)',
    eligibility: 'Farmers willing to adopt organic farming',
    category: 'Subsidy',
    description: 'Organic farming ke liye ₹50,000 per hectare. Certification bhi free milega.',
    url: 'https://pgsindia-ncof.gov.in',
    documents: ['Aadhaar Card', 'Land Papers', 'Group Formation (minimum 20 farmers)']
  },
  {
    name: 'PM Kisan Maandhan Yojana',
    benefit: 'Pension scheme for farmers',
    amount: '₹3,000/month pension after age 60',
    eligibility: 'Small & marginal farmers (age 18-40)',
    category: 'Pension',
    description: 'Monthly ₹55-200 jama karo, 60 saal ke baad ₹3,000/month pension milegi.',
    url: 'https://maandhan.in',
    documents: ['Aadhaar Card', 'Bank Account', 'Age Proof']
  },
  {
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    benefit: 'Farm machinery and equipment subsidy',
    amount: '40%-80% subsidy on farm machinery',
    eligibility: 'All farmers (higher subsidy for SC/ST/Small farmers)',
    category: 'Subsidy',
    description: 'Tractor, harvester, sprayer etc. pe 40-80% subsidy. Modern farming ke liye zaroori.',
    url: 'https://agrimachinery.nic.in',
    documents: ['Aadhaar Card', 'Land Papers', 'Caste Certificate (if SC/ST)', 'Quotation']
  },
  {
    name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    benefit: 'Agricultural development and innovation support',
    amount: 'Project-based funding (₹25,000 - ₹5,00,000)',
    eligibility: 'Innovative farmers, FPOs, agri-entrepreneurs',
    category: 'Innovation',
    description: 'Naye tarike ki kheti ke liye funding. Agri startup banana hai toh yeh scheme.',
    url: 'https://rkvy.nic.in',
    documents: ['Aadhaar Card', 'Project Proposal', 'Bank Account']
  }
];

export const SCHEME_CATEGORIES = [
  { key: 'Direct Benefit', label: 'Direct Benefit Transfer', color: '#22c55e', icon: '💰' },
  { key: 'Insurance', label: 'Fasal Bima (Insurance)', color: '#3b82f6', icon: '🛡️' },
  { key: 'Loan', label: 'Kisan Loan', color: '#f59e0b', icon: '🏦' },
  { key: 'Subsidy', label: 'Subsidy Schemes', color: '#8b5cf6', icon: '🎯' },
  { key: 'Market', label: 'Market Support', color: '#ec4899', icon: '📊' },
  { key: 'Support', label: 'Free Support', color: '#06b6d4', icon: '🤝' },
  { key: 'Pension', label: 'Pension', color: '#f97316', icon: '👴' },
  { key: 'Innovation', label: 'Innovation Fund', color: '#14b8a6', icon: '🚀' }
];

export const API_ENDPOINTS = {
  weather: 'https://api.openweathermap.org/data/2.5',
  weatherForecast: 'https://api.openweathermap.org/data/2.5/forecast'
};

export const FARMING_IMAGES = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
  rice: 'https://images.unsplash.com/photo-1536054953990-725eb1a3189f?w=400&h=300&fit=crop',
  cotton: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=300&fit=crop',
  farming: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
  tractor: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=300&fit=crop',
  irrigation: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=400&h=300&fit=crop',
  harvest: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
  soil: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop',
  market: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
  greenField: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'
};
