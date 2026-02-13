const mongoose = require('mongoose');
const userRepo = require('../repositories/user.repo');
const { AppError } = require('../errors/AppError');

function assertValidObjectId(id, errorMessage = 'Invalid ObjectId') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('INVALID_INPUT', errorMessage);
  }
}

async function assertUserExists(userId) {
  assertValidObjectId(userId, 'Invalid user ID');
  // Use an existence query to avoid fetching full user documents on guard checks.
  const exists = await userRepo.existsById(userId);
  if (!exists) {
    throw new AppError('NOT_FOUND', 'User not found');
  }
}

module.exports = { assertValidObjectId, assertUserExists };
