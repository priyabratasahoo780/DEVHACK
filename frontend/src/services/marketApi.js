import api from './api';

export const getMarketPrediction = (data) => api.post('/market/predict', data);
export const getMandiComparison = (data) => api.post('/mandi/compare', data);
export const getMarketPredictions = getMarketPrediction;
export const getMandiPrices = (data) => api.post('/mandi/compare', data);
