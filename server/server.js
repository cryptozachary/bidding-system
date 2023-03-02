const express = require('express');
require('dotenv').config()
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const UserModel = require('./models/Users')
const ProductModel = require('./models/Products');
const http = require('http').Server(app);
const cors = require('cors');

console.log(process.env.MONGO_DB_ATLAS)

mongoose.connect(process.env.MONGO_DB_ATLAS, {
    useNewUrlParser: true,
})

// test variable to save product data via socket 
let globalProduct = {}


const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
    //Listens for added products from the client
    socket.on('addProduct', (data) => {
        console.log(data)
        globalProduct = data
        console.log(globalProduct)
    })
    //Listens for new bids from the client
    socket.on('bidProduct', (data) => {
        console.log(data);
    });
});

//general middleware for routes
app.use(cors());
app.use(express.json())


// testing database
app.get('/getproducts', (req, res) => {
    ProductModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        }
        res.json(result)
    })
})

//create users (always use async functions)
app.post('/createuser', async (req, res) => {
    const user = {
        "username": req.body.username,
        "name": req.body.name,
        "password": req.body.password
    }
    // create new user using user model and past the data (user) to the database
    const newUser = new UserModel(user)
    try {
        await newUser.save()
        res.json(user)
        console.log('user created!')
    } catch (err) {
        res.json({ message: err });
    }
})

//add products 
app.post('/addproduct', async (req, res) => {
    const product = {
        "name": req.body.name,
        "price": req.body.price,
        "owner": req.body.owner
    }
    // create new user using user model and past the data (user) to the database
    const newProduct = new ProductModel(product)
    try {
        await newProduct.save()
        res.json(product)
        console.log('Product Added!')
    } catch (err) {
        res.json({ message: err });
    }

})

//update product price
app.put('/products/bid/:id', async (req, res) => {
    console.log('this is the bid price' + " " + req.body.price + " " + req.params.id)
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, {
            "price": req.body.price,
        }, { new: true });
        res.json(updatedProduct);
        console.log('Product Updated!')
    } catch (err) {
        res.json({ message: err });
    }
})

//test api
app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
