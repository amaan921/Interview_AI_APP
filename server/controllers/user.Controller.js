import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Get Current User Error:", error);
        return res.status(500).json({ message: "Failed to retrieve user" });
    }
};