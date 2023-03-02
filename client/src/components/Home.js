import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const Home = () => {

    //state variables
    const [userName, setUserName] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();
    console.log('rendered')

    const handleSubmit = (e) => {
        e.preventDefault()

        // send data to createuser api with axios, send json object
        axios.post('http://localhost:4000/createuser', {
            username: userName,
            name: name,
            password: password
        })
        localStorage.setItem('userName', userName);
        navigate('/products');

    };

    return (
        <div>
            <form className="home__form" onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="username">Enter your username</label>
                <input
                    type="text"
                    name="username"
                    className="home__input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={6}
                />
                <label htmlFor="name">Enter your name</label>
                <input
                    type="text"
                    name="name"
                    className="home__input"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    minLength={6}
                />
                <label htmlFor="password">Enter your password</label>
                <input
                    type="text"
                    name="password"
                    className="home__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <button type="submit" className="home__cta">SIGN IN</button>
            </form>
        </div>
    )
}

export default Home;