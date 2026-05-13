const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    paymentDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'bank_transfer'], default: 'cash' },
    invoiceNumber: { type: String, unique: true, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
)

paymentSchema.pre('validate', function setInvoiceNumber(next) {
  if (!this.invoiceNumber) {
    const shortId = Math.random().toString(36).slice(2, 8).toUpperCase()
    this.invoiceNumber = `INV-${Date.now()}-${shortId}`
  }

  next()
})

module.exports = mongoose.model('Payment', paymentSchema)
