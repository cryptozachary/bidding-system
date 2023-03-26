import socketIO from 'socket.io-client';
import Home from './components/Home';
import Products from './components/Products';
import AddProduct from './components/Addproduct';
import BidProduct from './components/BidProduct';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';

//socket library to be passed and utilized
const socket = socketIO.connect('http://localhost:4000');

function Content() {
  const location = useLocation();

  useEffect(() => {
    const checkRoute = async () => {
      try {
        let response = await axios.get('http://localhost:4000/checkRoute', {
          withCredentials: true,
        });
        console.log(response.data);
        console.log(`Path: ${location.pathname}`)
      } catch (err) {
        console.log(err)
        console.log(`Path: ${location.pathname}`)
      }
    };
    checkRoute();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<AddProduct socket={socket} />} />
      <Route
        path="/products/bid/:id/:name/:price"
        element={<BidProduct socket={socket} />}
      />
    </Routes>
  );
}

function App() {

  return (
    <CookiesProvider>
      <Router>
        <div className="app-container">
          <Nav socket={socket} />
          <Content />
          <Footer socket={socket} />
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;
