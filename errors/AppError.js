class AppError extends Error {
  constructor(code, message = '', details = null) {
    super(message || code);
    this.name = 'AppError';
    this.code = code;
    // `details` carries validator payloads without leaking stack traces to clients.
    this.details = details;
  }
}

module.exports = { AppError };
