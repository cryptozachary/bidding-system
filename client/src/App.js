import socketIO from 'socket.io-client';
import Home from './components/Home';
import Products from './components/Products';
import AddProduct from './components/Addproduct';
import BidProduct from './components/BidProduct';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Image from './components/Image';

// Importing hooks and libraries from React and other packages
import { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';

// Creating a socket.io instance to connect to the server
const socket = socketIO.connect('http://localhost:4000');

// Defining a Content component that renders routes and manages user authentication
function Content({ isLoggedIn, setIsLoggedIn }) {
  // Using the useLocation hook to get the current location
  const location = useLocation();

  // Defining a state variable to check if the user's authentication status is loaded
  const [authStatusLoaded, setAuthStatusLoaded] = useState(false);

  // Using the useEffect hook to load the user's authentication status on route change
  useEffect(() => {
    const checkRoute = async () => {
      try {
        let response = await axios.get('http://localhost:4000/checkRoute', {
          withCredentials: true,
        });

        // Updating the isLoggedIn state if the user is authenticated
        setIsLoggedIn(true)
        console.log(isLoggedIn)
        console.log(response.data);
        console.log(`Correct Path: ${location.pathname}`)

      } catch (err) {
        // Updating the isLoggedIn state if the user is not authenticated
        setIsLoggedIn(false)
        console.log(err)
        console.log(`Error Path: ${location.pathname}`)
      } finally {
        // Updating the authStatusLoaded state after the authentication status is checked
        setAuthStatusLoaded(true);
      }
    };
    checkRoute();
  }, [location.pathname]);

  // Returning null if the user's authentication status is not loaded yet
  if (!authStatusLoaded) {
    return null;
  }

  // Redirecting the user to the Home component if they are not authenticated and not on the Home route
  if (!isLoggedIn && location.pathname !== '/') {
    return <Navigate to='/'></Navigate>
  }

  // Rendering the routes if the user is authenticated
  return (
    <Routes>
      <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<AddProduct socket={socket} />} />
      <Route
        path="/products/bid/:id/:name/:price"
        element={<BidProduct socket={socket} />}
      />
      <Route path='/image' element={<Image />} />
    </Routes>
  );
}

// Defining the main App component that renders the Nav, Content, and Footer components
function App() {
  // Defining a state variable to manage user authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Rendering the Nav, Content, and Footer components
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
