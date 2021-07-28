const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    })
})

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Order was created',
        createdOrder: order
    })
})

router.get('/:odrerId', (req, res, next) => {
    res.status(200).json({
        message: 'Odrer details',
        orderId: req.params.odrerId
    })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted order',
        orderId: req.params.orderId
    })
})

module.exports = router