const Member = require('../models/Member')
const ApiError = require('../utils/ApiError')

const createMember = async (req, res, next) => {
  try {
    const member = await Member.create(req.body)

    res.status(201).json({
      message: 'Member created successfully',
      member,
    })
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, 'Member email already exists'))
    }
    next(error)
  }
}

const getMembers = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit
    const queryText = req.query.search?.trim() || ''
    const statusFilter = req.query.status || 'all'

    const query = {}

    if (queryText) {
      query.$or = [
        { name: { $regex: queryText, $options: 'i' } },
        { email: { $regex: queryText, $options: 'i' } },
        { phone: { $regex: queryText, $options: 'i' } },
      ]
    }

    if (statusFilter !== 'all') {
      query.memberStatus = statusFilter
    }

    const [members, total] = await Promise.all([
      Member.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Member.countDocuments(query),
    ])

    res.status(200).json({
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id)

    if (!member) {
      throw new ApiError(404, 'Member not found')
    }

    res.status(200).json({ member })
  } catch (error) {
    next(error)
  }
}

const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!member) {
      throw new ApiError(404, 'Member not found')
    }

    res.status(200).json({
      message: 'Member updated successfully',
      member,
    })
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, 'Member email already exists'))
    }
    next(error)
  }
}

const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id)

    if (!member) {
      throw new ApiError(404, 'Member not found')
    }

    res.status(200).json({ message: 'Member deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
}
