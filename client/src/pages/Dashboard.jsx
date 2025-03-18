import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({ totalWorkouts: 0, caloriesBurned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user goals from API
    const fetchGoals = async () => {
      try {
        // Check if user exists and has an ID
        if (!user?.id) {
          return;
        }
        
        const response = await fetch(`/api/goals/${user.id}`);
        
        // Check if response is OK before parsing JSON
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
        setError("Failed to load goals. Please try again later.");
      }
    };

    // Fetch recent workouts
    const fetchWorkouts = async () => {
      try {
        // Check if user exists and has an ID
        if (!user?.id) {
          return;
        }
        
        const response = await fetch(`/api/workouts/${user.id}`);
        
        // Check if response is OK before parsing JSON
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        setWorkouts(data);
        
        // Calculate total stats
        let totalCalories = data.reduce((acc, workout) => acc + workout.calories, 0);
        setStats({ totalWorkouts: data.length, caloriesBurned: totalCalories });
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to load workouts. Please try again later.");
      }
    };

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      if (user) {
        try {
          await Promise.all([fetchGoals(), fetchWorkouts()]);
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRetry = () => {
    // Reload data on retry
    if (user) {
      setLoading(true);
      setError(null);
      Promise.all([
        fetch(`/api/goals/${user.id}`).then(res => res.json()).then(data => setGoals(data)),
        fetch(`/api/workouts/${user.id}`).then(res => res.json()).then(data => {
          setWorkouts(data);
          let totalCalories = data.reduce((acc, workout) => acc + workout.calories, 0);
          setStats({ totalWorkouts: data.length, caloriesBurned: totalCalories });
        })
      ]).catch(err => {
        console.error("Error retrying data fetch:", err);
        setError("Still having trouble connecting to the server. Please check your connection.");
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  // If not logged in, redirect to login
  if (!user && !loading) {
    navigate("/login");
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <h1>Welcome, {user?.username || "User"}!</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading your fitness data...</div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      ) : (
        <div className="dashboard-content">
          {/* Goals Section */}
          <div className="dashboard-section goals-section">
            <h2>Your Goals</h2>
            {goals.length > 0 ? (
              <ul>
                {goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No goals set yet.</p>
                <button onClick={() => navigate("/goals")}>Set New Goals</button>
              </div>
            )}
          </div>

          {/* Workout Progress */}
          <div className="dashboard-section workout-section">
            <h2>Workout Progress</h2>
            {workouts.length > 0 ? (
              <ul>
                {workouts.slice(0, 5).map((workout, index) => (
                  <li key={index}>
                    <strong>{workout.type}</strong> - {workout.duration} mins - {workout.calories} kcal
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No workouts logged yet.</p>
                <button onClick={() => navigate("/workout-tracker")}>Log a Workout</button>
              </div>
            )}
          </div>

          {/* Insights & Stats */}
          <div className="dashboard-section stats-section">
            <h2>Insights & Stats</h2>
            <p><strong>Total Workouts:</strong> {stats.totalWorkouts}</p>
            <p><strong>Total Calories Burned:</strong> {stats.caloriesBurned} kcal</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;