const express = require('express')
const authMiddleware = require('../../middlewares/auth.middleware')
const {
  createPayment,
  getPayments,
  getPaymentAnalytics,
  getInvoice,
  renewMembership,
} = require('../../controllers/payment.controller')

const router = express.Router()

router.use(authMiddleware(['admin']))

router.get('/analytics', getPaymentAnalytics)
router.post('/', createPayment)
router.get('/', getPayments)
router.get('/:id/invoice', getInvoice)
router.post('/renew/:memberId', renewMembership)

module.exports = router
