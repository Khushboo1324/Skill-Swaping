import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { User, Save, Search } from "lucide-react";

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch current user profile
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/auth/me");
        setMe(data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Handle search
  const handleSearch = async () => {
    try {
      const { data } = await API.get(`/users/search?q=${q}`);
      setResults(data);
    } catch {
      toast.error("Search failed");
    }
  };

  // ✅ Handle profile save (with skill string fix)
  const handleSaveProfile = async () => {
    try {
      const updatedData = {
        ...me,
        skills:
          typeof me.skills === "string"
            ? me.skills.split(",").map((s) => s.trim())
            : me.skills,
      };

      const { data } = await API.put("/users/profile", updatedData);
      setMe(data);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-indigo-600 font-medium">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="relative overflow-hidden min-h-screen p-6">
      {/* 🌈 Animated gradient orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full blur-3xl opacity-40"
        animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-gradient-to-tr from-violet-500 to-indigo-400 rounded-full blur-3xl opacity-40"
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🌟 Main layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col md:flex-row gap-8"
      >
        {/* 🧍 Profile Card */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card flex-1 max-w-md mx-auto md:mx-0 bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6"
        >
          <motion.div
            className="flex items-center gap-4 mb-5"
            whileHover={{ scale: 1.03 }}
          >
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-white">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-indigo-700">
                {me?.name}
              </h2>
              <p className="text-sm text-gray-500">{me?.email}</p>
            </div>
          </motion.div>

          <div>
            <label className="text-sm text-gray-600 font-medium">
              Skills (comma separated)
            </label>
            <input
              className="input mt-1"
              value={
                Array.isArray(me.skills) ? me.skills.join(", ") : me.skills
              }
              onChange={(e) =>
                setMe((m) => ({
                  ...m,
                  skills: e.target.value, // keep as string while typing
                }))
              }
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveProfile}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-2 rounded-xl shadow-md"
            >
              <Save size={18} /> Save Profile
            </motion.button>
          </div>
        </motion.aside>

        {/* 🔍 Search Section */}
        <motion.main
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="card flex-1 bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <Search /> Find People by Skill
          </h2>

          <div className="flex gap-2 mb-5">
            <input
              className="input flex-1 border-gray-300"
              placeholder="e.g. React, Guitar, Cooking"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center gap-1"
              onClick={handleSearch}
            >
              <Search size={16} /> Search
            </motion.button>
          </div>

          {/* Search Results */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            {results.length === 0 ? (
              <p className="text-gray-500 italic">
                No results yet — try searching a skill.
              </p>
            ) : (
              results.map((u, i) => (
                <motion.li
                  key={u._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl border border-white/40 shadow-sm bg-white/60 hover:shadow-lg transition-all"
                >
                  <p className="font-semibold text-indigo-700">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-sm mt-1">
                    Skills:{" "}
                    <span className="text-gray-800 font-medium">
                      {u.skills?.join(", ")}
                    </span>
                  </p>
                </motion.li>
              ))
            )}
          </motion.ul>
        </motion.main>
      </motion.div>
    </div>
  );
}
