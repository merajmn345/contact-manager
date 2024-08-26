const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

// @desc POST register the user
// route post /api/users/register
// access public

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    //   Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed passsword: ", hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    res.status(201).send("User registered successfully");
    console.log(`User created ${user}`);

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data us not valid");
    }

    res.json({ message: "register the user" });
});

// @desc POST login the user
// route post /api/users/login
// access public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ((!email, !password)) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });

    // compare password with hahsedpassword

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Invalid email and password");
    }
    res.json({ message: "login user" });
});

// @desc get current user
// route GET /api/users/current
// access private

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
    console.log(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
