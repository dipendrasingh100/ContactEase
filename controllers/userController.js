const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

const tokenBlacklist = new Set();
//@desc Register a user
//@route POST /api/users/register  
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please provide all details")
    }
    //if email already exists
    const userAvailable = await User.findOne({ email })
    if (userAvailable) {
        res.status(400)
        throw new Error("Email already registered")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })
    if (user) {
        res.status(201)
        res.json({ _id: user.id, email: user.email });
    } else {
        res.status(400)
        throw new Error("User data is not valid")
    }
})

//@desc Login a user
//@route POST /api/users/login  
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("Please provide valid details")
    }

    const userAvailable = await User.findOne({ email })

    if (!userAvailable) {
        res.status(400)
        throw new Error("User doesn't exist")
    }
    const hash = userAvailable.password
    const check = await bcrypt.compare(password, hash)

    if (check) {
        const accesstoken = jwt.sign({
            user: {
                username: userAvailable.username,
                email: userAvailable.email,
                id: userAvailable.id
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        )
        res.status(202)
        res.json({ accesstoken, message: "user logged in successfully" })
    } else {
        res.status(401)
        throw new Error("Got wrong credentials")
    }
})

//@desc get a user
//@route GET /api/users/current  
//@access public
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user)
})

//@desc logout a user
//@route GET /api/users/logout  
//@access public
const logoutUser = asyncHandler(async (req, res) => {
    tokenBlacklist.add(decoded.jti);

    res.status(200).json({ message: 'Logged out successfully' });
})

module.exports = { registerUser, loginUser, currentUser, logoutUser, tokenBlacklist }