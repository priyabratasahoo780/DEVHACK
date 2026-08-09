const DB_STORE = {
  users: [],
  soilReports: [],
  cropRecommendations: [],
  fertilizerPlans: [],
  marketData: [],
  schemes: []
};

export function getCollection(name) {
  if (!DB_STORE[name]) {
    DB_STORE[name] = [];
  }
  return DB_STORE[name];
}

export function addDocument(collection, doc) {
  const document = {
    _id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...doc,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  getCollection(collection).push(document);
  return document;
}

export function findDocuments(collection, filter = {}) {
  const docs = getCollection(collection);
  if (Object.keys(filter).length === 0) return docs;
  return docs.filter(doc => {
    return Object.entries(filter).every(([key, value]) => doc[key] === value);
  });
}

export function findById(collection, id) {
  return getCollection(collection).find(doc => doc._id === id) || null;
}

export default DB_STORE;
