
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

module.exports.isLoggedIn = (req, res, next) => {
    console.log('at checking login')
    const token = req.headers["x-access'token"];
    console.log(token)
    console.log(typeof token)
    //check if token exists or is null in an if statement
    if (!token || token === "" || token === undefined || token === null || token === "null") {
        console.log('top')
        return res.send(JSON.stringify("not-logged-in"));
    } else {
        console.log('bottom')
        try {
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            res.ActivelyUserId = decoded._id;
        } catch (er) {
            console.log('error at log')
            return res.send(JSON.stringify("ERROR"));
        }
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