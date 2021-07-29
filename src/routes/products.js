const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('../models/product')

router.get('/', (req, res, next) => {
   Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            if(docs.length > 0) {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:9201/products/'+doc._id
                            }
                        }
                    })
                } 
                res.status(200).json(response)
            }else {
                 res.status(404).json({message: 'No entries found'})
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: err})
        })
})

router.post('/', (req, res, next) => {
   
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:9201/products/'+result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    product: { id: doc._id, name: doc.name, price: doc.price },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:9201/products'
                    }
                })
            }else {
                res.status(404).json({message: 'No entry found for the provided ID'})
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })

})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
   
    Product.findByIdAndUpdate(id, updateOps, (err, doc)=>{
        if(err){
            console.log(err)
            res.status(500).json({error: err})
        }else {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:9201/products/' + id
                }
            })
        }
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id: id})
        .then(result => {
             res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:9201/products',
                    body: { name: 'String', price: 'Number' }
                }
             })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

module.exports = router