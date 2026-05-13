const express = require('express')
const { register, login, adminLogin, getAdminProfile } = require('../../controllers/auth.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const generateToken = require('../../middlewares/generateToken.middleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/admin/login', adminLogin, generateToken)
router.get('/admin/me', authMiddleware(['admin']), getAdminProfile)

module.exports = router
