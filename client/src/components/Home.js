import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const Home = () => {

    //state variables
    const [userName, setUserName] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [userPath, setUserPath] = useState({
        signIn: false,
        register: true
    })
    const [buttonText, setButtonText] = useState({
        signIn: "Need to Sign In to your account? - Please Click Here",
        register: "Need to Register a new account? - Please Click Here"
    })
    const [apiError, setApiError] = useState({
        message: ""
    })

    const navigate = useNavigate();

    const theErrorFunction = () => {
        switch (true) {
            case 11000:
        }
    }

    console.log('rendered')

    const handleSignIn = (e) => {
        e.preventDefault()
        console.log('client' + userName)
        // send data to sign in via api with axios, send json object
        axios.post('http://localhost:4000/getuser', {
            username: userName,
            password: password
        }).then(result => {
            console.log(result.data)
            setApiError(prev => {
                return ({ ...prev, message: result.data.message })
            })
        })

        localStorage.setItem('userName', userName);
        // navigate('/products');

    };

    const handleRegister = (e) => {
        e.preventDefault()

        // send data to createuser api with axios, send json object
        axios.post('http://localhost:4000/createuser', {
            username: userName,
            name: name,
            password: password
        }).then(result => {
            console.log(result.data.error)
            setApiError(prev => {
                return ({ ...prev, message: result.data.error })
            })
        }).catch(error => {
            console.log('Error:' + error)
        })
        localStorage.setItem('userName', userName);
        //navigate('/products');


    };

    const userPathAction = (e) => {
        e.preventDefault()
        console.log('userPathAction clicked')
        setUserPath(prev => {
            return ({
                signIn: !prev.signIn, register: !prev.register,
            }
            )
        });

    }



    return (
        <div>
            <div className='user-path-button-container'>
                <button className="user-path-button" type='submit' onClick={(e) => userPathAction(e)}>{userPath.signIn ? buttonText.signIn : buttonText.register}</button>
            </div>

            {userPath.register ?
                <form className="home__form" onSubmit={(e) => handleSignIn(e)}>
                    <h2 className='home-form-title'>Please Sign In</h2>
                    <h6 className='home-message'>{apiError ? apiError.message : ""}</h6>
                    <label htmlFor="username">Enter your username</label>
                    <input
                        type="text"
                        name="username"
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
                </form> : <form className="home__form" onSubmit={(e) => handleRegister(e)}>
                    <h2 className='home-form-title'>Please Register</h2>
                    <h6 className='home-message'>{apiError ? apiError.message : ""}</h6>
                    <label htmlFor="username">Enter your username</label>
                    <input
                        type="text"
                        name="username"
                        className="home__input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        minLength={6}
                    />
                    <label htmlFor="name">Enter your name</label>
                    <input
                        type="text"
                        name="name"
                        className="home__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                </form>}


        </div>
    )
}

export default Home;