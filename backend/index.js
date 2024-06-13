import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './routes/User.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';


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

const server=http.createServer(app);


const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
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