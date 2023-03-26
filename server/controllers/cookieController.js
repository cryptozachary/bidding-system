module.exports.setCookies = (req, res) => {
    res.cookie('newUser', false)
    res.cookie('isSignedIn', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })

    res.send('You got the cookies!')
}

module.exports.readCookies = (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    res.json(cookies)
}

module.exports.clearCookies = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true, SameSite: 'strict', Secure: true,
        path: '/'
    });
    res.redirect('/');
}