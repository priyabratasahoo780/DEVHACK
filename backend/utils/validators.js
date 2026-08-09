export function validateSoilData(data) {
  const errors = [];
  const { nitrogen, phosphorus, potassium, ph } = data;

  if (nitrogen === undefined || nitrogen === null || isNaN(nitrogen) || nitrogen < 0) {
    errors.push('Nitrogen (N) value is required and must be a positive number');
  }
  if (phosphorus === undefined || phosphorus === null || isNaN(phosphorus) || phosphorus < 0) {
    errors.push('Phosphorus (P) value is required and must be a positive number');
  }
  if (potassium === undefined || potassium === null || isNaN(potassium) || potassium < 0) {
    errors.push('Potassium (K) value is required and must be a positive number');
  }
  if (ph === undefined || ph === null || isNaN(ph) || ph < 0 || ph > 14) {
    errors.push('pH value is required and must be between 0 and 14');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateLocation(data) {
  const errors = [];
  if (!data.location || typeof data.location !== 'string' || data.location.trim().length < 2) {
    errors.push('Location is required (min 2 characters)');
  }
  return { isValid: errors.length === 0, errors };
}

export function validateCropData(data) {
  const errors = [];
  if (!data.crop || typeof data.crop !== 'string') {
    errors.push('Crop name is required');
  }
  return { isValid: errors.length === 0, errors };
}

export function validateMarketData(data) {
  const errors = [];
  if (!data.crop) errors.push('Crop name is required');
  if (!data.location) errors.push('Location is required');
  return { isValid: errors.length === 0, errors };
}
