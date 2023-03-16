const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')
const authController = require('../controllers/authController')

// testing database
router.get('/getproducts', productController.getProducts)


//add products 
router.post('/addproduct', authController.verifyToken, productController.addProduct)

//update product price
router.put('/products/bid/:id', authController.verifyToken, productController.updateProduct)


//delete product
router.delete('/products/bid/:id', authController.verifyToken, productController.deleteProduct)


module.exports = router