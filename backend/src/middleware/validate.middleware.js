const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    return next(ApiError.badRequest('Validation failed', 'VALIDATION_ERROR', result.error.flatten()));
  }

  req.body = result.data.body || req.body;
  req.params = result.data.params || req.params;
  req.query = result.data.query || req.query;
  return next();
};

module.exports = validate;
