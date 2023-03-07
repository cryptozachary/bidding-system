const express = require('express');
const router = express.Router();
const ProductModel = require('../models/Products');

// testing database
router.get('/getproducts', (req, res) => {
    ProductModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        }
        res.json(result)
    })
})


//add products 
router.post('/addproduct', async (req, res) => {
    const product = {
        "name": req.body.name,
        "price": req.body.price,
        "owner": req.body.owner
    }
    // create new user using user model and past the data (user) to the database
    const newProduct = new ProductModel(product)
    try {
        await newProduct.save()
        res.json(product)
        console.log('Product Added!')
    } catch (err) {
        res.json({ message: err });
    }

})

//update product price
router.put('/products/bid/:id', async (req, res) => {
    console.log('this is the bid price' + " " + req.body.price + " " + req.params.id)
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, {
            "price": req.body.price,
        }, { new: true });
        res.json(updatedProduct);
        console.log('Product Updated!')
    } catch (err) {
        res.json({ message: err });
    }
})

router.put('/products/bid/:id', async (req, res) => {
    console.log('this is the bid price' + " " + req.body.price + " " + req.params.id)
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, {
            "price": req.body.price,
        }, { new: true });
        res.json(updatedProduct);
        console.log('Product Updated!')
    } catch (err) {
        res.json({ message: err });
    }
})


module.exports = router