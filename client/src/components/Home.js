import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const Home = () => {

    //input variables
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const confirmPassword = useRef(null)

    //variable to determine if login or register form 
    const [userPath, setUserPath] = useState({
        signIn: true
    })

    //variable to determine the api route url
    const [route, setRoute] = useState({
        createUser: "createuser",
        getUser: "loginuser"
    })

    //variable to determine the text for the button depending on which form (signIn or Register) is showing
    const [buttonText, setButtonText] = useState({
        signIn: "Need to Sign In to your account? - Please Click Here",
        register: "Need to Register a new account? - Please Click Here"
    })

    //varable to display api error messages
    const [apiError, setApiError] = useState({
        message: ""
    })

    const navigate = useNavigate();


    console.log('rendered')

    useEffect(() => {
        setTimeout(() => {
            setApiError('')
        }, 90000);

    })
    const handleUserPath = async (e) => {
        e.preventDefault()
        let theRoute = userPath.signIn ? route.getUser : route.createUser
        // send data to sign in via api with axios, send json object
        await axios.post(`http://localhost:4000/${theRoute}`, {
            username: userName,
            password: password

        }).then(result => {
            console.log(result.data)
            setApiError(prev => {
                return ({ ...prev, message: result.data.message })
            })
        }).catch(err => {
            console.log(err)
        })
        console.log(userPath, theRoute)

        //reset input fields
        setUserName('')
        setPassword('')

        if (confirmPassword.current) {
            confirmPassword.current.value = ""
        }

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

        //reset input fields
        setApiError(prev => {
            return { message: '' }
        })
        setUserName('')
        setPassword('')
        confirmPassword.current.value = ""
    }



    return (
        <div>
            <div className='user-path-button-container'>
                <button className="user-path-button" type='submit' onClick={(e) => userPathAction(e)}>{userPath.signIn ? buttonText.register : buttonText.signIn}</button>
            </div>

            {userPath.signIn ?
                <form className="home__form" onSubmit={(e) => handleUserPath(e)}>
                    <h2 className='home-form-title'>Please Sign In</h2>
                    <h6 className='home-message'>{apiError ? apiError.message : ""}</h6>
                    <label htmlFor="username">EMAIL</label>
                    <input
                        type="email"
                        name="username"
                        className="home__input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        minLength={6}
                    />
                    <label htmlFor="password">PASSWORD</label>
                    <input
                        type="password"
                        name="password"
                        className="home__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <button type="submit" className="home__cta">SIGN IN</button>
                </form> : <form className="home__form" onSubmit={(e) => handleUserPath(e)}>
                    <h2 className='home-form-title'>Please Register</h2>
                    <h6 className='home-message'>{apiError ? apiError.message : ""}</h6>
                    <label htmlFor="username">EMAIL</label>
                    <input
                        type="email"
                        name="username"
                        className="home__input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        minLength={6}
                    />
                    <label htmlFor="password">PASSWORD</label>
                    <input
                        type="password"
                        name="password"
                        className="home__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
                    <input
                        ref={confirmPassword}
                        type="password"
                        name="confirm-password"
                        className="home__input"
                        required
                        minLength={6}
                        onChange={(e) => {
                            if (e.target.value === password) {
                                setApiError({ message: '' });
                            } else {
                                setApiError({ message: 'Passwords do not match' });
                            }
                        }}
                    />
                    <button type="submit" className="home__cta" disabled={apiError.message === 'Passwords do not match'}>REGISTER</button>
                </form>}


        </div>
    )
}

export default Home;