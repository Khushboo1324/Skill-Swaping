import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const searchUsers = async (req, res) => {
  const q = req.query.q || "";
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ],
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to search users" });
  }
};
