const express = require('express');
require('dotenv').config()
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const UserModel = require('./models/Users')
const ProductModel = require('./models/Products');
const http = require('http').Server(app);
const cors = require('cors');
const bcrypt = require('bcrypt')
const salt = 10

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

//validate and check if user exist
app.post('/getuser', async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) return res.json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.json({ message: 'Incorrect password' });

        res.json({ message: 'Password is valid' });
    } catch (err) {
        res.json({ message: err.message });
    }

})


//create users (always use async functions)
app.post('/createuser', async (req, res) => {
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
        res.json(user)
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


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
