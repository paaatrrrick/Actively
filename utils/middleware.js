
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

module.exports.isLoggedIn = (req, res, next) => {
    const token = req.headers["x-access'token"];
    if (!token)
        return res.send(JSON.stringify("not-logged-in"));
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        res.ActivelyUserId = decoded._id;
    } catch (er) {
        return res.send(JSON.stringify("ERROR"));
    }
    next();
};


module.exports.errorCatch = (req, res, next) => {
    try {
        console.log('trying error')
        next();
    } catch (er) {
        console.log('error founder')
        return res.send(JSON.stringify("ERROR"));
    }
};