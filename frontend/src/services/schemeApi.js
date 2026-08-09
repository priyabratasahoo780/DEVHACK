import api from './api';

export const findSchemes = (data) => api.post('/schemes/find', data);
export const getMasterAdvice = (data) => api.post('/ai/master', data);
export const getRecoveryAdvice = (data) => api.post('/ai/recovery', data);
export const getFarmingCalendar = (data) => api.post('/ai/calendar', data);
export const getNearbyInfo = (data) => api.post('/ai/nearby-info', data);
