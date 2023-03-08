const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users')
const bcrypt = require('bcrypt')
const salt = 10

//validate and check if user exist
router.post('/loginuser', async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) return res.json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.json({ message: 'Incorrect password' });

        res.json({ message: 'Password is valid', valid: true });
    } catch (err) {
        res.json({ message: err.message });
    }

})


//create users (always use async functions)
router.post('/createuser', async (req, res) => {
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
        res.json({ message: 'User Created' })
        console.log('user created!')
    } catch (err) {

        switch (true) {
            case err.code == 11000:
                res.json({
                    message: "Duplicate user name found!"
                });
                break;
            default: res.json({
                message: `MongoDB error code # ${err}`
            })
        }
        console.log(err)
    }
})

module.exports = router;