import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// Get all chat messages between two users
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Chat.find({
      $or: [
        { fromUser: req.user._id, toUser: userId },
        { fromUser: userId, toUser: req.user._id },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

// Save a new chat message
router.post("/", protect, async (req, res) => {
  try {
    const { toUser, message } = req.body;
    const chat = new Chat({
      fromUser: req.user._id,
      toUser,
      message,
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
