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

function Content({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const [authStatusLoaded, setAuthStatusLoaded] = useState(false);

  useEffect(() => {
    const checkRoute = async () => {
      try {
        let response = await axios.get('http://localhost:4000/checkRoute', {
          withCredentials: true,
        });
        setIsLoggedIn(true)
        console.log(isLoggedIn)
        console.log(response.data);
        console.log(`Path: ${location.pathname}`)

      } catch (err) {
        setIsLoggedIn(false)
        console.log(err)
        console.log(`Path: ${location.pathname}`)
      } finally {
        setAuthStatusLoaded(true);
      }
    };
    checkRoute();
  }, [location.pathname]);

  if (!authStatusLoaded) {
    return null;
  }

  if (!isLoggedIn && location.pathname !== '/') {
    return <Navigate to='/'></Navigate>
  }

  // if (location.pathname !== '/') {
  //   return <Navigate to='/'></Navigate>
  // }

  return (
    <Routes>
      <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn} />} />
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <CookiesProvider>
      <Router>
        <div className="app-container">
          <Nav
            socket={socket}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
          <Content
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
          <Footer socket={socket} />
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;
