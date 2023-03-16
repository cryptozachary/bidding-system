import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useCookies } from 'react-cookie'


const Home = () => {
    //input variables
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const confirmPassword = useRef(null)
    const [authValid, setAuthValid] = useState(false)

    //variable to determine if login or register form 
    const [userPath, setUserPath] = useState({
        signIn: true
    })

    //variable to determine the api route url
    const [route] = useState({
        createUser: "createuser",
        getUser: "loginuser"
    })

    //variable to determine the text for the button depending on which form (signIn or Register) is showing
    const [buttonText] = useState({
        signIn: "Need to Sign In to your account? - Please Click Here",
        register: "Need to Register a new account? - Please Click Here"
    })

    //varable to display api error messages
    const [apiError, setApiError] = useState({
        message: ""
    })

    const navigate = useNavigate();

    const [_, setCookies] = useCookies(['access_token'])

    console.log('rendered')

    useEffect(() => {
        setTimeout(() => {
            setApiError('')
        }, 10000);

    }, [])


    //handle signup or login 
    const handleUserPath = async (e) => {
        e.preventDefault()
        let theRoute = userPath.signIn ? route.getUser : route.createUser
        // send data to sign in via api with axios, send json object
        await axios.post(`http://localhost:4000/${theRoute}`, {
            username: userName,
            password: password

        }).then(result => {
            console.log(result.data, result.data.valid, result)

            setCookies('access_token', result.data.token,)
            window.localStorage.setItem('userID', result.data.userID)
            if (result.data.valid) setAuthValid(true)
            setApiError(prev => {
                return ({ ...prev, message: result.data.email || result.data.password })
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

        if (authValid === true) {
            navigate('/products');
        }

    };


    //handle userPath choice (signup or login?)
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
        //confirmPassword.current.value = ""
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