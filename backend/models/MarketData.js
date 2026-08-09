import { addDocument, findDocuments } from '../config/db.js';

const COLLECTION = 'marketData';

export const MarketDataModel = {
  create(data) {
    return addDocument(COLLECTION, {
      crop: data.crop,
      location: data.location || '',
      currentPrice: data.currentPrice || 0,
      predictedTrend: data.predictedTrend || 'stable',
      recommendation: data.recommendation || '',
      mandiPrices: data.mandiPrices || [],
      aiResponse: data.aiResponse || ''
    });
  },

  findAll(filter) {
    return findDocuments(COLLECTION, filter);
  }
};
