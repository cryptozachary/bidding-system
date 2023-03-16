import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';



const Nav = ({ socket }) => {

    const [notification, setNotification] = useState('');
    const [cookies, setCookies] = useCookies('access_token')
    const navigate = useNavigate()

    useEffect(() => {
        // Check if the cookie value has changed and update the state

    }, [RenderLogoutButton()]);


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

    const logout = () => {
        setCookies('access_token', "")
        window.localStorage.removeItem("userID")
        navigate('/')
    }

    const RenderLogoutButton = () => {
        if (cookies.access_token) {
            return <button onClick={logout}>Logout</button>;
        }
        return null;
    };

    return (
        <nav className="navbar">
            <div className='links'>
                <Link to='/'>Home</Link>
                <Link to='/products'>Products</Link>
                <Link to='/products/add'>Add Products</Link>
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