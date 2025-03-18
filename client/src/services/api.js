import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://zippyfitbuddy.onrender.com";

// Function to fetch workouts
export const fetchWorkouts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workouts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return { success: false, message: "Failed to fetch workouts" };
  }
};

// Function to add a workout
export const addWorkout = async (workoutData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workouts`, workoutData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding workout:", error);
    return { success: false, message: "Failed to add workout" };
  }
};

// Function to delete a workout
export const deleteWorkout = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/workouts/${id}`);
    return { success: true, message: "Workout deleted successfully" };
  } catch (error) {
    console.error("Error deleting workout:", error);
    return { success: false, message: "Failed to delete workout" };
  }
};
