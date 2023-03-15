const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Please enter an email'],
        required: true,
        lowercase: true,
        validate: [(valUserName) => {
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
            return emailRegex.test(valUserName)
        }, 'Please enter a valid email']

    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
})

//first param is name of collect, second param is name of pertaining schema
const UserModel = mongoose.model("user", UserSchema)

module.exports = UserModel

