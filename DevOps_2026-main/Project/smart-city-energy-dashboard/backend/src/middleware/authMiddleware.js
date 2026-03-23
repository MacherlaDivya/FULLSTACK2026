import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const protect = async (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      const error = new Error('Not authorized, token missing');
      error.statusCode = 401;
      throw error;
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      const error = new Error('Not authorized, user not found');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error('Forbidden: insufficient permissions');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};

export { protect, authorize };
