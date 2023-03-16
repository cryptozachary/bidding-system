const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

//create users (always use async functions)
router.post('/createuser', authController.createUser)

//validate and check if user exist
router.post('/loginuser', authController.loginUser);

module.exports = router;