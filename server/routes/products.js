const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')

// testing database
router.get('/getproducts', productController.getProducts)


//add products 
router.post('/addproduct', productController.addProduct)

//update product price
router.put('/products/bid/:id', productController.updateProduct)


//delete product
router.delete('/products/bid/:id', productController.deleteProduct)


module.exports = router