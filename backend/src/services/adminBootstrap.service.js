const Admin = require('../models/Admin')

const bootstrapDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME || 'Gym Admin'

  if (!adminEmail || !adminPassword) {
    return
  }

  const existingAdmin = await Admin.findOne({ email: adminEmail })
  if (existingAdmin) {
    return
  }

  await Admin.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
  })

  console.log(`Default admin created: ${adminEmail}`)
}

module.exports = { bootstrapDefaultAdmin }
