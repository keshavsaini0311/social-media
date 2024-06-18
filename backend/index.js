import path from "path";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/User.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./sockets-backend/sockets.js";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.mongo).then(()=>{
  console.log("connected");
}).catch((err)=>{
  console.log(err);
})

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/auth", userRoutes);
app.use("/messages", messageRoutes);

// http://localhost:5000 => backend,frontend

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
