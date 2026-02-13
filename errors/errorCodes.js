const ERROR_CODE = Object.freeze({
  INVALID_INPUT: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  MISCONFIGURED: 500,
  SERVER_ERROR: 500,
});

function getHttpStatusCode(code, fallback = 500) {
  // Unknown app codes intentionally fall back to 500.
  return ERROR_CODE[code] || fallback;
}

module.exports = { ERROR_CODE, getHttpStatusCode };
