const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  // This should match the name you used in mongoose.model for users
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imgFile: {
        type: String,
        required: false
    }
})

const ProductModel = mongoose.model("products", ProductSchema)

module.exports = ProductModel