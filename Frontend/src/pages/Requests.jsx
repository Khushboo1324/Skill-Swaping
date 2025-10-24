import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosInstance";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, X, Send, Mail } from "lucide-react";

export default function Requests() {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        API.get("/skills/received"),
        API.get("/skills/sent"),
      ]);
      setReceived(receivedRes.data);
      setSent(sentRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await API.put(`/skills/${id}/status`, { status });
      toast.success(`Request ${status}!`);
      fetchRequests();
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-indigo-600 font-medium">
        Loading your requests...
      </div>
    );

  return (
    <div className="relative overflow-hidden min-h-screen p-6">
      {/* 🌈 Animated background */}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 space-y-12"
      >
        {/* 📨 Received Requests */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Mail /> Requests For My Skills
          </h2>

          {received.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              No requests received yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {received.map((req, i) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 10px 25px rgba(99,102,241,0.2)",
                  }}
                  className="relative card bg-white/70 backdrop-blur-xl p-5 border border-white/40 rounded-2xl shadow-md"
                >
                  <div>
                    <h3 className="font-semibold text-indigo-700">
                      {req.fromUser?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {req.fromUser?.email}
                    </p>

                    <div className="mt-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Requested Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {req.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    {req.status === "pending" ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleAction(req._id, "accepted")}
                          className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600 flex items-center gap-1 text-xs px-3 py-1"
                        >
                          <Check size={14} /> Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleAction(req._id, "rejected")}
                          className="btn-primary bg-gradient-to-r from-rose-500 to-pink-600 flex items-center gap-1 text-xs px-3 py-1"
                        >
                          <X size={14} /> Reject
                        </motion.button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            req.status === "accepted"
                              ? "text-green-600"
                              : "text-rose-600"
                          }`}
                        >
                          {req.status.toUpperCase()}
                        </span>
                        {req.status === "accepted" && (
                          <Link
                            to={`/chat/${req.fromUser?._id}`}
                            className="btn-primary bg-gradient-to-r from-indigo-500 to-violet-600 text-xs px-3 py-1"
                          >
                            💬 Chat
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* 📤 Sent Requests */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Send /> My Skill Requests
          </h2>

          {sent.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              You haven’t requested any skills yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sent.map((req, i) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 10px 25px rgba(99,102,241,0.2)",
                  }}
                  className="card bg-white/70 backdrop-blur-xl p-5 border border-white/40 rounded-2xl shadow-md"
                >
                  <div>
                    <h3 className="font-semibold text-indigo-700">
                      To: {req.toUser?.name}
                    </h3>
                    <p className="text-sm text-gray-600">{req.toUser?.email}</p>

                    <div className="mt-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Requested Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {req.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          req.status === "pending"
                            ? "text-yellow-600"
                            : req.status === "accepted"
                            ? "text-green-600"
                            : "text-rose-600"
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>

                      {req.status === "accepted" && (
                        <Link
                          to={`/chat/${req.toUser?._id}`}
                          className="btn-primary bg-gradient-to-r from-indigo-500 to-violet-600 text-xs px-3 py-1"
                        >
                          💬 Chat
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
}
