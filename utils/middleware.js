module.exports.isLoggedIn = (req, res, next) => {
    // console.log('')
    // console.log('Middleware')
    // console.log(req.session.isAuthenticated)
    if (!req.session.isAuthenticated) {
        req.session.returnTo = req.originalUrl
        return res.redirect('/');
    } else {
        next();
    }
}
