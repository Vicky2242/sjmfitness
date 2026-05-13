const ApiError = require('../utils/ApiError')
const { signToken } = require('../services/token.service')

const generateToken = (req, res, next) => {
  try {
    if (!req.authPayload || !req.authResponse) {
      throw new ApiError(500, 'Token generation payload missing')
    }

    const token = signToken(req.authPayload)

    res.status(200).json({
      message: req.authResponse.message || 'Authentication successful',
      token,
      admin: req.authResponse.admin,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = generateToken
