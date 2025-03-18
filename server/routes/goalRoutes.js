import express from "express";
import Goal from "../models/Goal.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch user goal
router.get("/", protect, async (req, res) => {
  try {
    const goal = await Goal.findOne({ userId: req.user._id });
    if (goal) {
      return res.json({ hasGoals: true, goal });
    }
    res.json({ hasGoals: false });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Set or update fitness goals
router.post("/", protect, async (req, res) => {
  try {
    const { goalType, target, stepsToAchieve } = req.body;

    let goal = await Goal.findOne({ userId: req.user._id });

    if (goal) {
      // Update existing goal
      goal.goalType = goalType;
      goal.target = target;
      goal.stepsToAchieve = stepsToAchieve;
      await goal.save();
      return res.json({ message: "Goal updated successfully", goal });
    }

    // Create new goal
    goal = new Goal({ userId: req.user._id, goalType, target, stepsToAchieve });
    await goal.save();
    res.json({ message: "Goal set successfully", goal });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
