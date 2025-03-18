import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleSignupRedirect = () => {
    navigate("/signup"); // Redirect to Signup page
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="badge">🔥 AI-Powered Fitness Tracking</span>
          <h1>
            Achieve Your <span className="highlight-orange">Fitness Goals</span> With <span className="highlight-blue">Zippy</span>
          </h1>
          <p>Your all-in-one fitness tracker to monitor workouts, calories, and progress.</p>
          <button className="cta-button" onClick={handleSignupRedirect}>Start Tracking</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h2>📊 Smart Progress Tracking</h2>
          <p>Get real-time insights on your workouts, steps, and calorie burn.</p>
        </div>

        <div className="feature">
          <h2>🏋️ Personalized Workouts</h2>
          <p>AI-powered suggestions for exercises based on your fitness level.</p>
        </div>

        <div className="feature">
          <h2>🍎 Nutrition Insights</h2>
          <p>Track your daily calorie intake and get healthy meal recommendations.</p>
        </div>

        <div className="feature">
          <h2>⌚ Sync With Wearables</h2>
          <p>Connect with your smartwatch and fitness devices effortlessly.</p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <h2>🚀 Ready to Take Control of Your Fitness?</h2>
        <p>Join thousands of users achieving their health goals with Zippy!</p>
        <button className="cta-button" onClick={handleSignupRedirect}>Get Started Now</button>
      </section>
    </div>
  );
}

export default Home;
