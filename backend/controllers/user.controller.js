import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
export const test=(req,res)=>{
    res.json({
        message:"Hello",
    });
}

export const updateUser=async(req,res,next)=>{
    if(req.user.id!=req.params.id){ return next(errorHandler(401,"You can only update your own account!"));
}
    try {
        
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10);
        }
        
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{
            $set:{
                userName:req.body.username||req.user.userName,
                email:req.body.email||req.user.email,
                password:req.body.password||req.user.password,
                firstName:req.body.firstName||req.user.firstName,
                lastName:req.body.lastName||req.user.lastName,
                dateOfBirth:req.body.dateOfBirth||req.user.dateOfBirth,
                gender:req.body.gender||req.user.gender,
                contactNumber:req.body.contactNumber||req.user.contactNumber,
                avatar:req.body.avatar||req.user.avatar,
            }
        },{new:true});
        
        const {password,...rest}=updatedUser._doc;
        
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


export const deleteUser=async(req,res,next)=>{
    if(req.user.id!=req.params.id){ return next(errorHandler(401,"You can only delete your own account!"));
}
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted")

    } catch (error) {
        console.log("catch error");
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.params.id);
        
        if (!user) return next(errorHandler(404, 'User not found!'));
        
        const { password: pass, ...rest } = user._doc;
        
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}