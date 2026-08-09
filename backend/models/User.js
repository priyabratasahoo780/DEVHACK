import { addDocument, findDocuments, findById } from '../config/db.js';

const COLLECTION = 'users';

export const UserModel = {
  create(data) {
    return addDocument(COLLECTION, {
      name: data.name,
      phone: data.phone || '',
      location: data.location || '',
      language: data.language || 'hi',
      role: 'farmer'
    });
  },

  findAll() {
    return findDocuments(COLLECTION);
  },

  findById(id) {
    return findById(COLLECTION, id);
  }
};
