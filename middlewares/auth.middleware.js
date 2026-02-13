const jwt = require('jsonwebtoken');
const { AppError } = require('../errors/AppError');

const authJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('MISCONFIGURED', 'JWT secret is missing');
  }

  if (!authHeader) {
    return next(new AppError('UNAUTHORIZED', 'Token missing'));
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('UNAUTHORIZED', 'Invalid authorization header'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    // Only agent tokens include establishment scope.
    if (decoded.establishmentId) {
      req.establishmentId = decoded.establishmentId;
    }
    next();
  } catch (err) {
    return next(new AppError('UNAUTHORIZED', 'Invalid or expired token'));
  }
};

module.exports = authJwt;
