const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repo');
const establishmentRepo = require('../repositories/establishment.repo');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { AppError } = require('../errors/AppError');

async function login(email, password) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('MISCONFIGURED', 'JWT secret is missing');
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await userRepo.findUserByMailWithPassword(normalizedEmail);
  if (!user) {
    throw new AppError('UNAUTHORIZED', 'Invalid credentials');
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError('UNAUTHORIZED', 'Invalid credentials');
  }

  const payload = {
    userId: String(user._id),
    role: user.role,
  };
  // Establishment scope is only relevant for agents.
  if (user.establishment) {
    payload.establishmentId = String(user.establishment);
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: '12h',
  });

  return {
    token, //JWT token
    user: {
      id: String(user._id),
      firstName: user.firstName,
      role: user.role,
    },
  };
}

async function signup(lastName, firstName, email, password, role, establishmentId) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const emailAlreadyUsed = await userRepo.existsByMail(normalizedEmail);
  if (emailAlreadyUsed) {
    throw new AppError('CONFLICT', 'User already exists');
  }

  if (role !== 'civil' && role !== 'agent') {
    throw new AppError('INVALID_INPUT', 'Invalid role');
  }

  if (role === 'agent') {
    if (!establishmentId || !mongoose.Types.ObjectId.isValid(establishmentId)) {
      throw new AppError('INVALID_INPUT', 'Establishment ID required for agents');
    }

    const establishmentExists = await establishmentRepo.existsById(establishmentId);
    if (!establishmentExists) {
      throw new AppError('NOT_FOUND', 'Establishment does not exist');
    }
  }

  if (role === 'civil') {
    if (establishmentId != null) {
      throw new AppError('FORBIDDEN', 'Civilians cannot have an establishment');
    }
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = {
    lastName,
    firstName,
    email: normalizedEmail,
    password: hash,
    role,
    establishment: role === 'agent' ? establishmentId : null,
  };

  try {
    await userRepo.createNewUser(newUser);
  } catch (err) {
    // Guards against race conditions despite the pre-check above.
    if (err && (err.code === 11000 || err.code === 11001)) {
      throw new AppError('CONFLICT', 'User already exists');
    }
    throw err;
  }

  return { created: true };
}

module.exports = { login, signup };
