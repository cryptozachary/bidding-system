const express = require('express');
require('dotenv').config()
const app = express();
const PORT = 4000;
const mongoose = require('mongoose')
const http = require('http').Server(app);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path')
const jwt = require('jsonwebtoken');
const UserModel = require('./models/Users');

// look for app in the build folder (if working within React)
const filepath = path.join(__dirname, '../client/build')

console.log(process.env.MONGO_DB_ATLAS)

mongoose.connect(process.env.MONGO_DB_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:4000",
        credentials: true
    }
});

// Socket.IO authentication middleware
socketIO.use(async (socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
        try {
            const token = socket.handshake.auth.token;
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await UserModel.findById(decoded.id);
            if (user) {
                socket.user = user;
                next();
            } else {
                next(new Error('Authentication error'));
            }
        } catch (err) {
            next(new Error('Authentication error'));
        }
    } else {
        next(new Error('Authentication error'));
    }
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });

    socket.on('addProduct', (data) => {
        const productWithUser = { ...data, userId: socket.user._id };
        console.log("The addproduct info is:" + JSON.stringify(productWithUser));
        socket.broadcast.emit('addProductResponse', productWithUser);
    });

    socket.on('bidProduct', (data) => {
        const bidWithUser = { ...data, userId: socket.user._id };
        console.log("The bidproduct info is:" + JSON.stringify(bidWithUser));
        socket.broadcast.emit('bidProductResponse', bidWithUser);
    });
});

// General middleware for routes

// Serve the static files from the React app
app.use(express.static(filepath))
// parses the body and attaches to req.body object 
app.use(express.urlencoded({ limit: '50mb', extended: true }))
// parses json data
app.use(express.json({ limit: '50mb' }))
// parses cookie information
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true
}));

// Routes
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