import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    exercise: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    caloriesBurned: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Workout = mongoose.model("Workout", WorkoutSchema);
export default Workout;
