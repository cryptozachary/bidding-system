const express = require('express')
const router = express.Router()
const cookieController = require('../controllers/cookieController')

router.get('/set-cookies', cookieController.setCookies)

router.get('/read-cookies', cookieController.readCookies)

module.exports = router