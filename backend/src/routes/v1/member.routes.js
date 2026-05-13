const express = require('express')
const authMiddleware = require('../../middlewares/auth.middleware')
const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require('../../controllers/member.controller')

const router = express.Router()

router.use(authMiddleware(['admin']))

router.route('/').post(createMember).get(getMembers)
router.route('/:id').get(getMemberById).put(updateMember).delete(deleteMember)

module.exports = router
