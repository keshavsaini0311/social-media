import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { signup,login } from './controllers/Auth.js'; // Adjust the path as needed
// import { sign } from 'jsonwebtoken';
dotenv.config();
mongoose.connect(process.env.mongo).then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
const app = express();
// const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//signup
app.post("/signup",signup);
app.post("/login",login);
app.listen(5000,()=>{
    console.log("Server is running on port 5000 !!");
});