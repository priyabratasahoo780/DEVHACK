import api from './api';

export const getFertilizerPlan = (data) => api.post('/fertilizer/plan', data);
export const getFertilizerSafety = (data) => api.post('/fertilizer/safety', data);
