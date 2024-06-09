import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const signup=async(req,res)=>{
try {
    const {email,password,firstName,lastName,gender,contactNumber,dateOfBirth,confirmPassword}=req.body;
if(!email||!password||!firstName||!lastName||!confirmPassword){
    return res.status(403).json({
        success: false,
        message: "All Fields are required",
    });
}
if(password!==confirmPassword){
    return res.status(400).json({
        success: false,
        message:
            "Password and Confirm Password do not match. Please try again.",
    });
}
const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
			firstName,
			lastName,
			email,
            password: hashedPassword,
            contactNumber,
            gender,
			dateOfBirth,
			avatar: `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`,
		});
        return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
} catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "User cannot be registered. Please try again.",
    });
    
}
}
export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if (!email || !password) {
			
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}
        const user = await User.findOne({ email });
        if (!user) {
			
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}
        if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

       
        user.token = token;
        user.password = undefined;
        // Set cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        console.log(token);
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: `User Login Success`,
        });
    } else {
        return res.status(401).json({
            success: false,
            message: `Password is incorrect`,
        });
    }

    } catch (error) {
        console.error(error);
		return res.status(500).json({
			success: false,
			message: "Login Failure Please Try Again",
		});
    }
}
export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        console.log(error);
    }
}