require('express-async-errors')
const express = require('express');
const app = express();
const userRouter = require('./routers/userRouter')
const error = require('./middlewares/error')
const cors = require('cors')
const morgan = require('morgan')
const categoryRouter = require('./routers/categoryRouter')

app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)

app.use(error)

module.exports = app