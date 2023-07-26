import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  sendMessageController,
  receiveMessageController,
  getAllChatsController,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", requireSignIn, sendMessageController);

router.get("/get", requireSignIn, receiveMessageController);

router.get("/getchats", requireSignIn, getAllChatsController);

export default router;
