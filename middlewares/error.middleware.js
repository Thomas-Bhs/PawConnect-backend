const { AppError } = require('../errors/AppError');
const { getHttpStatusCode } = require('../errors/errorCodes');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res
      .status(getHttpStatusCode(err.code))
      .json({ error: err.code, message: err.message, details: err.details || [] });
  }
  console.error(err);
  // Normalize unexpected errors to avoid exposing internals.
  return res
    .status(500)
    .json({ error: err.error || 'SERVER_ERROR', message: err.message, details: [] });
}

module.exports = errorHandler;
