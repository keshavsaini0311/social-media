import mongoose from "mongoose";
const userSchema=new mongoose.Schema(
 {
    firstName:{
        type: String,
			required: true,
			trim: true,
    },
    lastName:{
        type: String,
			required: true,
			trim: true,
    },
    email: {
			type: String,
			required: true,
			trim: true,
    },
    password: {
			type: String,
			required: true,
	},
    contactNumber: {
		type: Number,
		trim: true,
    
	},
    gender: {
		type: String,

	},
	dateOfBirth: {
		type: Date,
	},
    avatar:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }


 },
 { timestamps: true }
);
const User=mongoose.model('User',userSchema);
export default User;
