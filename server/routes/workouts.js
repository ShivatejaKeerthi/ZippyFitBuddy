import express from "express";
import Workout from "../models/Workout.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify user token
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Add a workout
router.post("/", authenticateUser, async (req, res) => {
    try {
        const { exercise, duration, caloriesBurned } = req.body;
        const workout = new Workout({ userId: req.userId, exercise, duration, caloriesBurned });
        await workout.save();
        res.status(201).json(workout);
    } catch (err) {
        res.status(500).json({ message: "Error adding workout" });
    }
});

// Get all workouts for the logged-in user
router.get("/", authenticateUser, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.userId }).sort({ date: -1 });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching workouts" });
    }
});

// Update a workout
router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { exercise, duration, caloriesBurned } = req.body;
        const workout = await Workout.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { exercise, duration, caloriesBurned },
            { new: true }
        );
        if (!workout) return res.status(404).json({ message: "Workout not found" });
        res.json(workout);
    } catch (err) {
        res.status(500).json({ message: "Error updating workout" });
    }
});

// Delete a workout
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!workout) return res.status(404).json({ message: "Workout not found" });
        res.json({ message: "Workout deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting workout" });
    }
});

export default router;
