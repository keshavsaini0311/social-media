import express from "express";
import {verifyToken} from "../utils/verifyUSer.js";
import { getMessages, sendMessage, getConversations,getconversationfromusername } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversations", verifyToken, getConversations);
router.get("/:otherUserId", verifyToken, getMessages);
router.get("/s", verifyToken, getconversationfromusername);
router.post("/", verifyToken, sendMessage);

export default router;
