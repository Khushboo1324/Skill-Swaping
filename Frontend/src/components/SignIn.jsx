import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function SignIn({ setIsAuthenticated }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Welcome back!");
      setIsAuthenticated(true);
      navigate("/home");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-indigo-100 via-white to-violet-200"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue your skill journey
        </p>

        <input
          type="email"
          placeholder="Email"
          className="input mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input mb-6"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
        >
          <LogIn size={18} /> Sign In
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-violet-600 cursor-pointer font-medium hover:underline"
          >
            Create one
          </span>
        </p>
      </motion.form>
    </motion.div>
  );
}
