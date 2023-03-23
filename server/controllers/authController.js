require('dotenv').config()
const UserModel = require('../models/Users')
const bcrypt = require('bcrypt')
const salt = 10
const jwt = require('jsonwebtoken')
const maxAge = 3 * 24 * 60 * 60
const cookieParser = require('cookie-parser');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '' }

    if (err.code === 11000) errors.email = 'Email already registered!'

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

const createToken = (id) => {
    return (jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: maxAge
    }))
}

module.exports.createUser = async (req, res, next) => {

    //user information received in the requestbody
    const user = {
        "username": req.body.username,
        "password": ""
    }
    try {

        //first hash the password on the request body then add to user data
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;

        // create new user using user model and pass the data (user) to the database
        const newUser = new UserModel(user)
        await newUser.save()

        //create web tokens and cookies
        const token = createToken(newUser._id)
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000, httpOnly: true, SameSite: 'strict', Secure: true,
            path: '/'
        })
        res.status(201).json({ message: 'User Created', token: token, userID: newUser._id, valid: true })
        console.log('user created!')

    } catch (err) {
        const errors = handleErrors(err)
        res.json(errors)
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) return res.json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.json({ message: 'Incorrect password' });

        const token = createToken(user._id)
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000, httpOnly: true, SameSite: 'strict', Secure: true,
            path: '/'
        })
        res.json({ message: 'Password is valid! User Logged in!', token: token, userID: user._id, valid: true });
    } catch (err) {
        console.log(err)
        res.json({ message: `Error Message: ${err.message}` });
    }
}

module.exports.verifyToken = (req, res, next) => {
    const token = (req.cookies.jwt)
    console.log('the token is:', token)
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err) => {
            if (err) return res.sendStatus(403)
            next()
        })
    } else {
        res.sendStatus(401)
        console.log('failed')
    }
}

