import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, LogOut, Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance";

export default function Navbar({ isAuthenticated, onLogout }) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchPending = async () => {
      try {
        const { data } = await API.get("/skills/received");
        setPendingCount(data.filter((r) => r.status === "pending").length);
      } catch (err) {
        console.error("Failed to fetch pending count", err);
      }
    };
    fetchPending();
  }, [isAuthenticated]);

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-md border-b border-white/40"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        <Link
          to={isAuthenticated ? "/home" : "/"}
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent"
        >
          SkillSwap
        </Link>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/signin" className="btn-primary flex items-center gap-1">
                <LogIn size={18} /> Sign In
              </Link>
              <Link
                to="/signup"
                className="btn-primary flex items-center gap-1 bg-violet-500 hover:bg-violet-600"
              >
                <UserPlus size={18} /> Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/home"
                className="btn-primary flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600"
              >
                <Home size={18} /> Home
              </Link>
              <Link
                to="/dashboard"
                className="btn-primary flex items-center gap-1 bg-violet-500 hover:bg-violet-600"
              >
                <User size={18} /> Dashboard
              </Link>
              <Link
                to="/requests/received"
                className="relative btn-primary flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600"
              >
                📨 Requests
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
              <button
                onClick={onLogout}
                className="btn-primary flex items-center gap-1 bg-rose-500 hover:bg-rose-600"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
