const Member = require('../models/Member')
const Payment = require('../models/Payment')
const ApiError = require('../utils/ApiError')

const createPayment = async (req, res, next) => {
  try {
    const { memberId, amount, status, dueDate, paymentMethod, notes } = req.body

    if (!memberId || !amount || !dueDate) {
      throw new ApiError(400, 'memberId, amount and dueDate are required')
    }

    const member = await Member.findById(memberId)
    if (!member) {
      throw new ApiError(404, 'Member not found')
    }

    const payment = await Payment.create({
      member: member._id,
      amount,
      status: status || 'pending',
      dueDate,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      paymentDate: status === 'paid' ? new Date() : undefined,
    })

    member.paymentStatus = payment.status
    if (payment.status === 'paid') {
      member.memberStatus = 'active'
    }
    await member.save()

    const populatedPayment = await Payment.findById(payment._id).populate('member', 'name email membershipPlan expiryDate')

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: populatedPayment,
    })
  } catch (error) {
    next(error)
  }
}

const getPayments = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit
    const status = req.query.status || 'all'
    const memberId = req.query.memberId

    const query = {}
    if (status !== 'all') query.status = status
    if (memberId) query.member = memberId

    const [payments, total] = await Promise.all([
      Payment.find(query).populate('member', 'name email membershipPlan expiryDate').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(query),
    ])

    res.status(200).json({
      payments,
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

const getPaymentAnalytics = async (req, res, next) => {
  try {
    const statusCounts = await Payment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ])

    const totals = statusCounts.reduce(
      (acc, item) => {
        acc[item._id] = item.count
        return acc
      },
      { paid: 0, pending: 0, overdue: 0 },
    )

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const revenueSeries = monthlyRevenue.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
    }))

    const paidRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])

    res.status(200).json({
      statusCounts: totals,
      revenueSeries,
      totalRevenue: paidRevenue[0]?.total || 0,
    })
  } catch (error) {
    next(error)
  }
}

const getInvoice = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('member', 'name email phone membershipPlan')
    if (!payment) {
      throw new ApiError(404, 'Payment not found')
    }

    res.status(200).json({
      invoice: {
        invoiceNumber: payment.invoiceNumber,
        generatedAt: new Date(),
        member: payment.member,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        dueDate: payment.dueDate,
        notes: payment.notes,
      },
    })
  } catch (error) {
    next(error)
  }
}

const renewMembership = async (req, res, next) => {
  try {
    const { memberId } = req.params
    const { months = 1, amount, paymentMethod = 'cash' } = req.body

    const member = await Member.findById(memberId)
    if (!member) {
      throw new ApiError(404, 'Member not found')
    }

    const currentExpiry = new Date(member.expiryDate)
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date()
    const renewedExpiry = new Date(baseDate)
    renewedExpiry.setMonth(renewedExpiry.getMonth() + Number(months))

    member.expiryDate = renewedExpiry
    member.memberStatus = 'active'
    member.paymentStatus = 'paid'
    await member.save()

    const payment = await Payment.create({
      member: member._id,
      amount: amount || 0,
      status: 'paid',
      dueDate: renewedExpiry,
      paymentMethod,
      paymentDate: new Date(),
      notes: `Membership renewed for ${months} month(s)`,
    })

    res.status(200).json({
      message: 'Membership renewed successfully',
      member,
      payment,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentAnalytics,
  getInvoice,
  renewMembership,
}
