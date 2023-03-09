const express = require('express');
require('dotenv').config()
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const http = require('http').Server(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
        console.log("The addproduct info is:" + JSON.stringify(data))
        socket.broadcast.emit('addProductResponse', data);
    })


    //Listens for new bids from the client
    socket.on('bidProduct', (data) => {
        console.log(data)
        console.log("The bidproduct info is:" + JSON.stringify(data));
        socket.broadcast.emit('bidProductResponse', data);
    });

    //Sends back the data after placing a bid


});

//general middleware for routes

app.use(cors());
app.use(cookieParser())
app.use(express.json())

//routes
app.use('/', require('./routes/users'))
app.use('/', require('./routes/products'))


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
