import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function SignUp({ setIsAuthenticated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      const { data } = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setIsAuthenticated(true);
      toast.success("Welcome to SkillSwap!");
      navigate("/home");
    } catch {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-pink-100 via-white to-indigo-200"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-600 via-violet-500 to-indigo-500 bg-clip-text text-transparent mb-2">
          Create Account 🌟
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Join the SkillSwap community and grow together!
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="input mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Your Skills (comma separated)"
          className="input mb-6"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-500 to-pink-600 hover:from-indigo-600 hover:to-rose-600 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
        >
          <UserPlus size={18} /> Sign Up
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-indigo-600 cursor-pointer font-medium hover:underline"
          >
            Sign in
          </span>
        </p>
      </motion.form>
    </motion.div>
  );
}
