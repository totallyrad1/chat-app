const userModel = require("../Models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createJwtToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET;

    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
};

const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        let user = await userModel.findOne({email});
        
        if (user)
            return res.status(400).json("User with the given email already exist");
    
        if (!name || !password || !email)
            return res.status(400).json("All fields are required to register");
    
        if (!validator.isEmail(email))
            return res.status(400).json("Email must be a valid email...");
    
        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password must be a strong password...");
    
        if (name.length < 3)
            return res.status(400).json("username must be a valid...");
    
        user = new userModel({name, email, password});
    
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    
        await user.save();

        const token = createJwtToken(user._id);
        res.status(200).json({_id: user._id, name, email, token});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const loginUser = async (req, res) =>{
    
    try{
        const {email, password} = req.body;
        let user = await userModel.findOne({email});

        if(!user)
            return res.status(400).json("Invalid email or password");

        const isValidPass = await bcrypt.compare(password, user.password);

        if(!isValidPass)
            return res.status(400).json("Invalid email or password");

        const token = createJwtToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, email, token});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const findUser = async (req, res) =>{
    
    try{
        const userId = req.params.userId;
        const user =  await userModel.findById(userId);

        res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const getUsers = async (req, res) =>{
    try{
        const users =  await userModel.find();

        res.status(200).json(users);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const changeUserSettings = async(req, res) =>{
    try{
        const {email, password, newpassword, newname, avatarLink} = req.body;
        let user = await userModel.findOne({email});

        if(!user)
            return res.status(400).json("An Error has occured...");

        const isValidPass = await bcrypt.compare(password, user.password);

        if(!isValidPass)
            return res.status(400).json("invalid password...");

        if (newpassword && !validator.isStrongPassword(newpassword))
            return res.status(400).json("Password must be a strong password...");
        
        if(newname && newname.length > 3)
            user.name = newname;
        if(newpassword){
            user.password = newpassword;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        if(avatarLink)
            user.avatarLink = avatarLink;


        await user.save();

        const token = createJwtToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, email, token});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {registerUser, loginUser, findUser, getUsers, changeUserSettings};