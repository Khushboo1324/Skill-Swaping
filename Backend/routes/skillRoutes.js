import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import SkillRequest from "../models/SkillRequest.js";

const router = express.Router();

// ✅ Send a new skill request
router.post("/request", protect, async (req, res) => {
  try {
    const { toUserId, skills } = req.body;
    if (!toUserId || !skills || !skills.length) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const request = new SkillRequest({
      fromUser: req.user._id,
      toUser: toUserId,
      skills,
    });

    await request.save();
    res.status(201).json({ message: "Skill request sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request" });
  }
});

// ✅ Get all received requests for current user
router.get("/received", protect, async (req, res) => {
  try {
    const requests = await SkillRequest.find({ toUser: req.user._id })
      .populate("fromUser", "name email skills")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch received requests" });
  }
});
// ✅ Get all requests the current user SENT
router.get("/sent", protect, async (req, res) => {
  try {
    const requests = await SkillRequest.find({ fromUser: req.user._id })
      .populate("toUser", "name email skills")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sent requests" });
  }
});

// ✅ Accept or reject request
router.put("/:id/status", protect, async (req, res) => {
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const request = await SkillRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (request.toUser.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  request.status = status;
  await request.save();
  res.json({ message: `Request ${status}` });
});

export default router;
