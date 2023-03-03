import socketIO from 'socket.io-client';
import Home from './components/Home'
import Products from './components/Products'
import AddProduct from './components/Addproduct'
import BidProduct from './components/BidProduct'
import Nav from './components/Nav'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

//socket library to be passed and utilized 
const socket = socketIO.connect('http://localhost:4000');


function App() {
  return (
    <Router>
      <div>
        <Nav socket={socket} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/feet' render={() => <h1>Feet!</h1>} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct socket={socket} />} />
          <Route
            path="/products/bid/:id/:name/:price"
            element={<BidProduct socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
