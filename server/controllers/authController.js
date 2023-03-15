const UserModel = require('../models/Users')
const bcrypt = require('bcrypt')
const salt = 10

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


module.exports.loginUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) return res.json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.json({ message: 'Incorrect password' });

        res.json({ message: 'Password is valid!', valid: true });
    } catch (err) {
        console.log(err)
        res.json({ message: `Error Message: ${err.message}` });
    }
}

module.exports.createUser = async (req, res) => {
    //user information received in the requestbody
    const user = {
        "username": req.body.username,
        "name": req.body.name,
        "password": ""
    }
    try {
        //first hash the password on the request body then add to user data
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        // create new user using user model and pass the data (user) to the database
        const newUser = new UserModel(user)
        await newUser.save()
        res.status(201).json({ message: 'User Created' })
        console.log('user created!')
    } catch (err) {
        const errors = handleErrors(err)
        res.json(errors)
    }
}

