import JWT from "jsonwebtoken";
import messageModel from "../model/messageModel.js";
import userModal from "../model/userModal.js";
import { set } from "mongoose";

export const sendMessageController = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    const _id = decodedToken._id;
    const sender = _id;
    const id = req.body.user._id;
    const receiver = id;
    const content = req.body.message;
    const message = await messageModel.create({
      sender,
      receiver,
      content,
    });
    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const receiveMessageController = async (req, res) => {
  const token = req.headers.authorization;
  const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
  const rid = decodedToken._id;

  const aid = req.query.aid;

  try {
    // Find all messages for the specified user (as sender or receiver)
    let messages = await messageModel
      .find({
        $or: [{ sender: rid }, { receiver: rid }],
        $or: [{ sender: aid }, { receiver: aid }],
      })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (errpor) {
    console.error("Error retrieving messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllChatsController = async (req, res) => {
  const token = req.headers.authorization;
  const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
  const rid = decodedToken._id;

  try {
    // Find all messages for the specified user (as sender or receiver)
    let chats = [];
    let messages = await messageModel
      .find({
        $or: [{ sender: rid }, { receiver: rid }],
      })
      .sort({ createdAt: 1 });

      const uniqueEmails = new Set();
    for(let i=0;i<messages.length;i++){
      if (messages[i].sender.localeCompare(rid) == 0) {
        const user = await userModal.findOne({ _id: messages[i].receiver });
        if(!uniqueEmails.has(user.email)){
          uniqueEmails.add(user.email);
          chats.push(user);
        }
      } else {
        const user = await userModal.findOne({ _id: messages[i].sender });
        if(!uniqueEmails.has(user.email)){
          uniqueEmails.add(user.email);
          chats.push(user);
        }
      }
    }
    res.send(chats);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
