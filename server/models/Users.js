const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,

    },
    face: {
        type: String,
        required: true,
    }
})

//first param is name of collect, second param is name of pertaining schema
const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel

