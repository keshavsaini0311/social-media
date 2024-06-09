import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './routes/User.js';


dotenv.config();



mongoose.connect(process.env.mongo).then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user",UserRouter);



app.listen(5000,()=>{
    console.log("Server is running on port 5000 !!");
});