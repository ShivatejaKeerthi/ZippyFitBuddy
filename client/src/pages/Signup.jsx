import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError("");
    setSuccess("");
    
    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      setLoading(false);
      
      if (!res.ok) {
        setError(data.message || "Signup failed!");
        return;
      }
      
      login(data); // Save user to context
      setSuccess("Signup successful! Redirecting to goals...");
      setTimeout(() => navigate("/goals"), 2000); // Redirect to goals after 2s
    } catch (err) {
      setLoading(false);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="page-container">
      {/* Left side: Signup form */}
      <div className="signup-container">
        
        <h2>Join Zippy Today</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="error" style={{backgroundColor: "#e6f7ef", color: "#2c9e73", borderLeft: "4px solid #2c9e73"}}>{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <p className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
      
      {/* Right side: Hero content */}
      <div className="hero-container">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Zippy!</h1>
          <p className="hero-subtitle">Track your fitness goals, stay motivated, and achieve more with our smart fitness tracking platform.</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#32b8cb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                  <line x1="17.5" y1="15" x2="9" y2="15"></line>
                </svg>
              </div>
              <div className="feature-text">Set personalized fitness goals</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#32b8cb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div className="feature-text">Track progress with detailed analytics</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#32b8cb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="feature-text">Join a supportive community</div>
            </div>
          </div>
          
          <div className="testimonial">
            <p>"Zippy transformed my fitness journey! The goal tracking and analytics helped me stay focused and motivated."</p>
            <span>- Sarah K., Zippy User</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;