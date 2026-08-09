import api from './api';

export const detectDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await api.post('/ai/detect-disease', formData, {
      timeout: 60000, // 60s timeout for image analysis
    });
    // api interceptor already strips response.data, so 'response' IS the data
    // Backend wraps in successResponse: { success: true, data: {...}, message: '...' }
    return response.data || response;
  } catch (error) {
    console.error('Disease detection error:', error);
    throw error;
  }
};
