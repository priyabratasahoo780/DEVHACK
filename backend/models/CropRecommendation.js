import { addDocument, findDocuments } from '../config/db.js';

const COLLECTION = 'cropRecommendations';

export const CropRecommendationModel = {
  create(data) {
    return addDocument(COLLECTION, {
      soilReportId: data.soilReportId || null,
      location: data.location || '',
      season: data.season || '',
      recommendations: data.recommendations || [],
      avoidCrops: data.avoidCrops || [],
      aiResponse: data.aiResponse || ''
    });
  },

  findAll(filter) {
    return findDocuments(COLLECTION, filter);
  }
};
