const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')

const authMiddleware = (allowedRoles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized access'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return next(new ApiError(403, 'Forbidden resource'))
    }

    req.user = decoded
    next()
  } catch {
    return next(new ApiError(401, 'Invalid token'))
  }
}

module.exports = authMiddleware
