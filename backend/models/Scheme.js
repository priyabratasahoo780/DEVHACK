import { addDocument, findDocuments } from '../config/db.js';

const COLLECTION = 'schemes';

export const SchemeModel = {
  create(data) {
    return addDocument(COLLECTION, {
      name: data.name,
      benefit: data.benefit || '',
      eligibility: data.eligibility || '',
      applySteps: data.applySteps || [],
      url: data.url || '',
      location: data.location || '',
      crop: data.crop || ''
    });
  },

  findAll(filter) {
    return findDocuments(COLLECTION, filter);
  }
};
