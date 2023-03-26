import socketIO from 'socket.io-client';
import Home from './components/Home'
import Products from './components/Products'
import AddProduct from './components/Addproduct'
import BidProduct from './components/BidProduct'
import Nav from './components/Nav'
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { useNavigate, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';

//socket library to be passed and utilized 
const socket = socketIO.connect('http://localhost:4000');

function App() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // set state for when routes are accessed to activate useffect to verify link
  const [routeState, setRouteState] = useState({
    clicked: false
  })
  const routeFunction = () => {
    setRouteState(true)
    console.log('clicked - route function')
  }

  useEffect(() => {

    const checkRoute = async () => {
      try {
        let response = await axios.get('http://localhost:4000/checkRoute', { withCredentials: true })
        setIsLoggedIn(true)
        console.log(response.data)
      } catch (err) {
        navigate('/')
        console.error(err)
      }
    }
    checkRoute()
  }, [routeState])

  return (
    <CookiesProvider>
      <Router>
        <div className='app-container'>
          <Nav socket={socket} routeState={routeState} setRouteState={setRouteState} routeFunction={routeFunction} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct socket={socket} />} />
            <Route
              path="/products/bid/:id/:name/:price"
              element={<BidProduct socket={socket} />}
            />
          </Routes>
          <Footer socket={socket} />
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;
