import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "https://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/chat", chatRoutes);

// Create HTTP + WebSocket server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "https://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", (messageData) => {
    const { toUserId, message } = messageData;
    console.log(`💬 Message from ${messageData.fromUser} → ${toUserId}:`, message);
    io.to(toUserId).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`🚀 Server running with Socket.io on port ${PORT}`)
);
