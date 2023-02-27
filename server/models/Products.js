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
    owner: {
        type: String,
        required: true,
    },
    last_bidder: {
        type: String,
        required: true
    }
})

const ProductModel = mongoose.model("products", ProductSchema)

module.exports = ProductModel