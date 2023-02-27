const express = require('express');
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const UserModel = require('./models/Users')
const ProductModel = require('./models/Products');
mongoose.connect('mongodb+srv://zachlipscomb:college86@elitascloset.jrvithe.mongodb.net/elitascloset?retryWrites=true&w=majority')

//New imports
const http = require('http').Server(app);
const cors = require('cors');


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
});

app.use(cors());
app.use(express.json())

// testing database
app.get('/getUsers', (req, res) => {
    UserModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        }
        res.json(result)
    })
})

// use async function
app.post('/createUser', async (req, res) => {
    const user = req.body
    // create new user using user model and past the data (user) to the database
    const newUser = new UserModel(user)
    await newUser.save()

    res.json(user)

})

app.post('/addproduct', async (req, res) => {
    const product = req.body
    // create new user using user model and past the data (user) to the database
    const newProduct = new ProductModel(product)
    await newProduct.save()

    res.json(product)

})


app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});