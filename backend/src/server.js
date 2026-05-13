const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const app = require('./app')
const connectDB = require('./config/db')
const { bootstrapDefaultAdmin } = require('./services/adminBootstrap.service')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()
  await bootstrapDefaultAdmin()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
