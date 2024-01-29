const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//@desc Register a user
//@route Get /api/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const { username, email,password } = req.body;
    if(!username || !email || !password ) {
        res.status(400);
        throw new Error("All fieldsare mandatory");
    }
    const userAvailable  = await User.findOne({ email });
    if(userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    //Has Password
    const hashPassword = await bcrypt.hash(password, 10)
    console.log("hashed password: ", hashPassword);

    const user = await User.create({
        username,
        email,
        password,hashPassword
    });
    console.log(`User created ${user}`);

    if(user) {
        res.status(201).json({_id:user.id, email: user.email,});
    }else{
        res.status(400);
        throw new Error("User data us not valid");
    }
    res.status(200).json({message:"Register the User"});
    //res.status(200).json(contacts);
});

//@desc login a user
//@route Get /api/login
//@access public
const loginUser = asyncHandler(async (req,res) => {
    const { email,password } = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});

//compare password with hashpassword
    if(user && (await bcrypt.compare(password,user.password))) {
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email: user.email,
                id: user.id,              
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m"}
        );
        res.status(200).json({ accessToken });
    }else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
    res.status(200).json({message:"login the User"});
    //res.status(200).json(contacts);
});

//@desc current user info
//@route Get /api/currentuser
//@access private
const currentUser = asyncHandler(async (req,res) => {
    //const contacts = await Contact.find();
    res.status(200).json({message:"Current the User"});
    //res.status(200).json(contacts);
});



module.exports = {
    registerUser,
    loginUser,
    currentUser,
}