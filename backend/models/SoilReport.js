import { addDocument, findDocuments, findById } from '../config/db.js';

const COLLECTION = 'soilReports';

export const SoilReportModel = {
  create(data) {
    return addDocument(COLLECTION, {
      nitrogen: data.nitrogen,
      phosphorus: data.phosphorus,
      potassium: data.potassium,
      ph: data.ph,
      organicCarbon: data.organicCarbon || null,
      location: data.location || '',
      healthScore: data.healthScore || 0,
      analysis: data.analysis || '',
      soilType: data.soilType || '',
      userId: data.userId || null
    });
  },

  findAll(filter) {
    return findDocuments(COLLECTION, filter);
  },

  findById(id) {
    return findById(COLLECTION, id);
  }
};
