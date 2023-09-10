const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const tokenBlacklist = require("./tokenBlacklist")

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401)
                throw new Error("Invalid Token")
            }

            // Check if the token ID (jti) is in the blacklist
            if (tokenBlacklist.has(decoded.jti)) {
                return res.status(401).json({ message: 'Token has been revoked' });
            }

            req.user = decoded.user;
            next()
        })
    } else {
        res.status(400)
        throw new Error("Token not found")
    }
})

module.exports = validateToken