import { errorResponse } from '../utils/responseFormatter.js';

export function validateRequest(validatorFn) {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req.body);
    if (!isValid) {
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    next();
  };
}
