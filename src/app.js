const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.once(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

mongoose.connection.once("open", () => {
  console.log("Mongo database connected successfully");
});

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app