import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Send, User } from "lucide-react";
import { motion } from "framer-motion";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
  transports: ["websocket"],
});

export default function Chat() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [toUser, setToUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  // Join socket room
  useEffect(() => {
    if (user?._id) socket.emit("joinRoom", user._id);
  }, [user]);

  // Fetch chat and partner info
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const { data } = await API.get(`/chat/${userId}`);
        setMessages(data);

        const { data: users } = await API.get("/users/all");
        const partner = users.find((u) => u._id === userId);
        setToUser(partner);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load chat");
      }
    };
    fetchChat();
  }, [userId]);

  // Listen for messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        msg.fromUser === userId ||
        (msg.toUserId === userId && msg.fromUser === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [userId, user]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const msgData = { toUserId: userId, message: input, fromUser: user._id };
    socket.emit("sendMessage", msgData);
    await API.post("/chat", { toUser: userId, message: input });
    setMessages((prev) => [...prev, msgData]);
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[80vh] max-w-3xl mx-auto p-4 relative"
    >
      {/* 🌈 Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-white to-violet-100 blur-3xl opacity-90"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md"
      >
        <div className="p-2 bg-white/30 rounded-full">
          <User size={28} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {toUser ? toUser.name : "Loading..."}
          </h2>
          <p className="text-sm opacity-90">
            {isTyping ? "typing..." : "online"}
          </p>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <motion.div
        layout
        className="flex-1 overflow-y-auto p-4 space-y-3 mt-3"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
              msg.fromUser === user._id
                ? "ml-auto bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                : "mr-auto bg-white/80 text-gray-800 border border-gray-200"
            }`}
          >
            {msg.message}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mt-2 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-200"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            socket.emit("typing", { toUserId: userId });
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
          }}
          className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={sendMessage}
          className="p-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full shadow-md"
        >
          <Send size={20} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
