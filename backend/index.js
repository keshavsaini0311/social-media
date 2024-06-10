import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './routes/User.js';
import cors from 'cors';


const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}



dotenv.config();



mongoose.connect(process.env.mongo).then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use("/auth",UserRouter);



app.listen(5000,()=>{
    console.log("Server is running on port 5000 !!");
});