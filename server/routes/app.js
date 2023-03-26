const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

//create users (always use async functions)
router.get('/checkRoute', authController.verifyToken, authController.verifyRoute)

//validate and check if user exist
// router.get('/products/add', authController.verifyToken);

// router.get('/products/bid/:id/:name/:price', authController.verifyToken);

module.exports = router;