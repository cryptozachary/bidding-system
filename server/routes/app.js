const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

//create users (always use async functions)
router.get('/checkRoute', authController.verifyToken, authController.verifyRoute)

module.exports = router;