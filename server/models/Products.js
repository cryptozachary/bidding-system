const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
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