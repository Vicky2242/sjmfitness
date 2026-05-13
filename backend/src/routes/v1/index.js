const express = require('express')
const authRoutes = require('./auth.routes')
const memberRoutes = require('./member.routes')
const paymentRoutes = require('./payment.routes')

const router = express.Router()

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'gym-backend' })
})

router.use('/auth', authRoutes)
router.use('/members', memberRoutes)
router.use('/payments', paymentRoutes)

module.exports = router
