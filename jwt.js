const jwt = require('jsonwebtoken')

const jwtAutMiddleware = (req, res, next) => {
    //  first check request headers has authorization or not
    const authorization = req.headers.authorization
    if (!authorization) return res.status(401).json({ error: " Token  not found" })
    //  Extract th jwt token from the request header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // verify the jwt tokens

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();

    } catch (err) {
        console.log("Error :", err);
        res.status(401).json({ error: "Invalid token" });

    }
}

//  function to generate jwt token

const generateToken = (userData) => {
    //  Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 450000 });

}
module.exports = {
    jwtAutMiddleware,
    generateToken,
};