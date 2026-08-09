import api from './api';

export const getCalendar = (data) => {
  return api.post('/ai/calendar', data || {});
};
