import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
	const token=req.cookies.token
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(401).json({ message: "Unauthorized" });
        req.user=user;
        next();
    })
};

export default protectRoute;
