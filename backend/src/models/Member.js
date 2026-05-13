const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    age: { type: Number, min: 10, max: 100, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    address: { type: String, required: true, trim: true },
    membershipPlan: { type: String, enum: ['basic', 'standard', 'premium'], required: true },
    joiningDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    memberStatus: { type: String, enum: ['active', 'inactive'], default: 'active' },
    profileImage: { type: String, default: '' },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Member', memberSchema)
