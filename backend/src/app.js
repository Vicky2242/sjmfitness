const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const routesV1 = require('./routes/v1')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1', routesV1)

app.use(errorMiddleware)

module.exports = app
