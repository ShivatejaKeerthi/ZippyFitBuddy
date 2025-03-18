import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workouts.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"));

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
