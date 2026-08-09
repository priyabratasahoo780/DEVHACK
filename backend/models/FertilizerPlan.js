import { addDocument, findDocuments } from '../config/db.js';

const COLLECTION = 'fertilizerPlans';

export const FertilizerPlanModel = {
  create(data) {
    return addDocument(COLLECTION, {
      soilReportId: data.soilReportId || null,
      crop: data.crop || '',
      fertilizers: data.fertilizers || [],
      schedule: data.schedule || [],
      warnings: data.warnings || [],
      aiResponse: data.aiResponse || ''
    });
  },

  findAll(filter) {
    return findDocuments(COLLECTION, filter);
  }
};
