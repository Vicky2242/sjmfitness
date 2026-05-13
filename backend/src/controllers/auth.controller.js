const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Admin = require('../models/Admin')
const ApiError = require('../utils/ApiError')
const { signToken } = require('../services/token.service')

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email and password are required')
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new ApiError(409, 'User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    const token = signToken({ id: user._id, role: user.role })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required')
    }

    const user = await User.findOne({ email })
    if (!user) {
      throw new ApiError(401, 'Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials')
    }

    const token = signToken({ id: user._id, role: user.role })

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required')
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() })
    if (!admin) {
      throw new ApiError(401, 'Invalid admin credentials')
    }

    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid admin credentials')
    }

    req.authPayload = { id: admin._id, role: 'admin' }
    req.authResponse = {
      message: 'Admin login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    }

    next()
  } catch (error) {
    next(error)
  }
}

const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password')

    if (!admin) {
      throw new ApiError(404, 'Admin not found')
    }

    res.status(200).json({
      message: 'Admin profile fetched successfully',
      admin,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, adminLogin, getAdminProfile }
