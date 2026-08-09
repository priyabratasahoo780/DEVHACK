import api from './api';

export const getCropRecommendation = (data) => api.post('/crop/recommend', data);
export const getCrops = getCropRecommendation;
