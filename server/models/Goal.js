import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goals: { type: Object, required: true },
}, { timestamps: true });

export default mongoose.model("Goal", GoalSchema);
