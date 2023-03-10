const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
})

//first param is name of collect, second param is name of pertaining schema
const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel

