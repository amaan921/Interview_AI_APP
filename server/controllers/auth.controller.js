import User from "../models/User.js";
import { generateToken } from "../config/token.js";

export const googleAuth = async (req,res) =>{
    try{
        const {name, email}= req.body;
        let user = await User.findOne({email});
        if(!user){
            // create a new user document
            user = new User({name, email});      
            await user.save();
        }
        let token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*3600000, // 7   days
        });
        return res.status(200).json({ message: "Authentication successful", token, credits: user.credits });
    }
        catch(error){
            console.error("Google Authentication Error:", error);
            return res.status(500).json({message: "Authentication failed"});    

        }

    }