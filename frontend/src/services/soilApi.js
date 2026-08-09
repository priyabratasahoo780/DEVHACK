import api from './api';

export const analyzeSoil = (soilData) => api.post('/soil/analyze', soilData);
export const getSoilHistory = () => api.get('/soil/history');
export const scanSoilReport = (formData) => api.post('/ocr/scan', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
