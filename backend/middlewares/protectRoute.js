import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
	const token=req.cookies.token
    
    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(403,'Forbidden'));
        req.user=user;
        next();
    })
};

export default protectRoute;
