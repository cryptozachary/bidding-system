import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';



const Nav = ({ socket, routeState, setRouteState, isLoggedIn, setIsLoggedIn }) => {

    console.log('Nav: rendered')

    const [notification, setNotification] = useState('');
    const [cookies, setCookies, removeCookies] = useCookies(['access_token'])
    const navigate = useNavigate()


    //Listens after a product is added
    useEffect(() => {
        socket.on('addProductResponse', (data) => {
            setNotification(
                `@${data.owner} just added ${data.name} worth $${Number(
                    data.price
                ).toLocaleString()}`
            );
        });
    }, [socket]);

    //Listens after a user places a bid
    useEffect(() => {
        socket.on('bidProductResponse', (data) => {
            setNotification(
                `@${data.last_bidder} just bid ${data.name} for $${Number(
                    data.userInput
                ).toLocaleString()}`
            );
        });
    }, [socket]);

    const logout = async () => {

        let response = await axios.get('http://localhost:4000/clear-cookies', { withCredentials: true })
        if (response) {
            //removeCookies('access_token')
            setIsLoggedIn(false)
            console.log(isLoggedIn)
            window.localStorage.removeItem("userID")
            navigate('/')
        }
    }

    const RenderLogoutButton = () => {
        let userLogged = localStorage.getItem('userID') ? true : false

        if (userLogged) {
            return <button onClick={logout} >Logout</button>;
        }
        return null;
    };

    const RenderProductLink = () => {
        let userLogged = localStorage.getItem('userID') ? true : false

        if (userLogged) {
            return <Link to='/products' >Products</Link>;
        }
        return null;
    };

    const RenderAddProductLink = () => {
        let userLogged = localStorage.getItem('userID') ? true : false

        if (userLogged) {
            return <Link to='/products/add' >Add Products</Link>;
        }
        return null;
    };

    return (
        <nav className="navbar">
            <div className='links'>
                <Link to='/' >Home</Link>
                <RenderProductLink />
                <RenderLogoutButton />
            </div>
            <div className="header">
                <h2>Bid Items</h2>
            </div>
            <div>
                <p style={{ color: 'red' }}>{notification}</p>
            </div>
        </nav>
    );
};

export default Nav;