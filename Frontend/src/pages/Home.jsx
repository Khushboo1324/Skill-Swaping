import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Search, User } from "lucide-react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  // Fetch all users
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/users/all");
        setUsers(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      }
    })();
  }, []);

  // Search handler
  const handleSearch = async () => {
    try {
      const { data } = await API.get(
        `/users/search?q=${encodeURIComponent(query)}`
      );
      setUsers(data);
    } catch {
      toast.error("Search failed");
    }
  };

  // Send request handler
  const handleRequestSkill = async (userId, skills) => {
    try {
      await API.post("/skills/request", { toUserId: userId, skills });
      toast.success(`Request for ${skills.join(", ")} sent!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* 🌈 Animated background orbs */}
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-10 space-y-10"
      >
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            Discover & Swap Skills 🌟
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Connect, Learn, and Grow with people from every field.
          </p>
        </motion.section>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="flex bg-white/60 backdrop-blur-lg shadow-md rounded-2xl p-2 w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by skill or name..."
              className="input flex-1 border-0 bg-transparent placeholder-gray-500 focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 transition-transform"
            >
              <Search size={18} /> Search
            </button>
          </div>
        </motion.div>

        {/* User Cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.length === 0 && (
            <p className="text-gray-600 text-center col-span-full italic">
              No users found — try searching for a skill!
            </p>
          )}

          {users.map((u, idx) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 30px rgba(99, 102, 241, 0.3)",
              }}
              className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-lg transition-transform"
            >
              {/* Glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400 to-pink-400 opacity-0"
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              ></motion.div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <User className="text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-700">{u.name}</h3>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <h4 className="font-medium text-sm text-gray-700">Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {u.skills?.length ? (
                    u.skills.map((skill, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-full px-2 py-1 text-xs text-indigo-700 font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => handleRequestSkill(u._id, [skill])}
                          className="text-xs px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full hover:shadow-md transition"
                        >
                          Request
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No skills listed
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </motion.div>
    </div>
  );
}
