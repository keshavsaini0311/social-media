import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import AuthRouter from './routes/auth.route.js';
import MessageRouter from './routes/message.route.js';
import UserRouter from './routes/user.route.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';


const corsOptions = {
    origin: '*',
    credentials: true,            
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
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/auth",AuthRouter);
app.use("/api/messages",MessageRouter);
app.use("/api/user", UserRouter);

const server=http.createServer(app);


const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  });
  
  server.listen(5000, () => {
    console.log("SERVER IS RUNNING");
  });

  app.use((err,req,res,next)=>{
    const statuscode=err.statuscode || 500;
    const message=err.message || "Internal server error";
    return res.status(statuscode).json({
        success: false,
        statuscode,
        message,
    });
});