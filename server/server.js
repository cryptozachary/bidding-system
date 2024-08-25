const express = require('express');
require('dotenv').config()
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const http = require('http').Server(app);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path')

// look for app in the build folder ( if working within React)
const filepath = path.join(__dirname, '../client/build')

console.log(process.env.MONGO_DB_ATLAS)

mongoose.connect(process.env.MONGO_DB_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:4000",
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

// Serve the static files from the React app
app.use(express.static(filepath))
//parses the body and attaches to req.body object 
app.use(express.urlencoded({ extended: false }))
//parses json data
app.use(express.json())
//parses cookie information
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true
}));

//routes
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: filepath })
})

app.use('/', require('./routes/app'))
app.use('/', require('./routes/users'))
app.use('/', require('./routes/products'))
app.use('/', require('./routes/cookies'))

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: filepath })
})

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
