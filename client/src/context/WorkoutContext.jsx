import { createContext, useState, useEffect } from "react";
import { fetchWorkouts, addWorkout, deleteWorkout } from "../services/api";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const getWorkouts = async () => {
      const data = await fetchWorkouts();
      setWorkouts(data);
    };
    getWorkouts();
  }, []);

  const addWorkoutToState = async (workoutData) => {
    const newWorkout = await addWorkout(workoutData);
    if (newWorkout) setWorkouts([...workouts, newWorkout]);
  };

  const deleteWorkoutFromState = async (id) => {
    await deleteWorkout(id);
    setWorkouts(workouts.filter((workout) => workout._id !== id));
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkoutToState, deleteWorkoutFromState }}>
      {children}
    </WorkoutContext.Provider>
  );
};
