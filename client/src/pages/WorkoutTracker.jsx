import React, { useState, useEffect } from "react";
import "../styles/WorkoutTracker.css"; 

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ 
    name: "", 
    duration: "", 
    date: "",
    calories: "",
    type: "cardio"
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    totalCalories: 0,
    mostFrequentWorkout: ""
  });
  const [filter, setFilter] = useState("all");

  // Load workouts from localStorage on component mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workouts");
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
    calculateStats();
  }, [workouts]);

  const calculateStats = () => {
    if (workouts.length === 0) {
      setStats({
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        mostFrequentWorkout: "N/A"
      });
      return;
    }

    // Calculate total minutes and calories burned
    const totalMinutes = workouts.reduce((sum, workout) => sum + Number(workout.duration), 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + (Number(workout.calories) || 0), 0);
    
    // Find most frequent workout
    const workoutCounts = {};
    workouts.forEach(workout => {
      workoutCounts[workout.name] = (workoutCounts[workout.name] || 0) + 1;
    });
    
    let mostFrequentWorkout = "";
    let maxCount = 0;
    for (const name in workoutCounts) {
      if (workoutCounts[name] > maxCount) {
        maxCount = workoutCounts[name];
        mostFrequentWorkout = name;
      }
    }

    setStats({
      totalWorkouts: workouts.length,
      totalMinutes,
      totalCalories,
      mostFrequentWorkout
    });
  };

  const handleChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const addWorkout = () => {
    if (!newWorkout.name || !newWorkout.duration || !newWorkout.date) {
      alert("Please fill in required fields: name, duration, and date");
      return;
    }

    if (editingIndex !== null) {
      const updatedWorkouts = [...workouts];
      updatedWorkouts[editingIndex] = newWorkout;
      setWorkouts(updatedWorkouts);
      setEditingIndex(null);
    } else {
      setWorkouts([...workouts, newWorkout]);
    }

    setNewWorkout({ 
      name: "", 
      duration: "", 
      date: "",
      calories: "",
      type: "cardio"
    });
  };

  const editWorkout = (index) => {
    setNewWorkout(workouts[index]);
    setEditingIndex(index);
  };

  const deleteWorkout = (index) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const filteredWorkouts = filter === "all" 
    ? workouts 
    : workouts.filter(workout => workout.type === filter);

  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const workoutTypes = [
    { value: "cardio", label: "Cardio" },
    { value: "strength", label: "Strength Training" },
    { value: "flexibility", label: "Flexibility" },
    { value: "sports", label: "Sports" },
    { value: "other", label: "Other" }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const clearAllWorkouts = () => {
    if (window.confirm("Are you sure you want to delete all workouts?")) {
      setWorkouts([]);
    }
  };

  return (
    <div className="workout-tracker">
      <h2>Workout Tracker</h2>
      
      {/* Stats Dashboard */}
      <div className="workout-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.totalWorkouts}</span>
          <span className="stat-label">Total Workouts</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalMinutes}</span>
          <span className="stat-label">Total Minutes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalCalories}</span>
          <span className="stat-label">Calories Burned</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.mostFrequentWorkout}</span>
          <span className="stat-label">Favorite Workout</span>
        </div>
      </div>

      <div className="workout-form">
        <input
          type="text"
          name="name"
          placeholder="Workout Name"
          value={newWorkout.name}
          onChange={handleChange}
          className="full-width"
        />
        
        <div className="form-row">
          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={newWorkout.duration}
            onChange={handleChange}
          />
          
          <input
            type="number"
            name="calories"
            placeholder="Calories Burned"
            value={newWorkout.calories}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-row">
          <input
            type="date"
            name="date"
            value={newWorkout.date}
            onChange={handleChange}
          />
          
          <select 
            name="type" 
            value={newWorkout.type}
            onChange={handleChange}
          >
            {workoutTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={addWorkout} className="add-button">
          {editingIndex !== null ? "Update" : "Add"} Workout
        </button>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-buttons">
          <button 
            className={filter === "all" ? "active" : ""} 
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {workoutTypes.map(type => (
            <button
              key={type.value}
              className={filter === type.value ? "active" : ""}
              onClick={() => setFilter(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        {workouts.length > 0 && (
          <button className="clear-button" onClick={clearAllWorkouts}>
            Clear All
          </button>
        )}
      </div>

      {/* Workouts List */}
      {sortedWorkouts.length > 0 ? (
        <ul className="workout-list">
          {sortedWorkouts.map((workout, index) => {
            const originalIndex = workouts.indexOf(workout);
            
            return (
              <li key={index} className={`workout-type-${workout.type}`}>
                <div className="workout-info">
                  <h3>{workout.name}</h3>
                  <div className="workout-details">
                    <span>{workout.duration} min</span>
                    <span>{formatDate(workout.date)}</span>
                    {workout.calories && <span>{workout.calories} calories</span>}
                    <span className="workout-type">{workoutTypes.find(t => t.value === workout.type)?.label}</span>
                  </div>
                </div>
                <div className="workout-actions">
                  <button onClick={() => editWorkout(originalIndex)} className="edit-button">Edit</button>
                  <button onClick={() => deleteWorkout(originalIndex)} className="delete-button">Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="no-workouts">
          <p>No workouts found. Add your first workout above!</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;