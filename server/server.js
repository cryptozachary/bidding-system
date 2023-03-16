const express = require('express');
require('dotenv').config()
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const http = require('http').Server(app);
const cookieParser = require('cookie-parser');
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
        console.log("The addproduct info is:" + JSON.stringify(data))
        //Sends back the data to client after adding product 
        socket.broadcast.emit('addProductResponse', data);
    })


    //Listens for new bids from the client
    socket.on('bidProduct', (data) => {
        console.log(data)
        console.log("The bidproduct info is:" + JSON.stringify(data));
        //Sends back the data to client after placing a bid
        socket.broadcast.emit('bidProductResponse', data);
    });



});

//general middleware for routes
app.use(cookieParser())
app.use(cors({
    credentials: true
}));
app.use(express.json())

//routes
app.use('/', require('./routes/users'))
app.use('/', require('./routes/products'))
app.use('/', require('./routes/cookies'))




http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
