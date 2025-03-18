import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Goals.css";

const Goals = () => {
  const navigate = useNavigate();
  // Fix for Vite apps - only use import.meta.env
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

  const steps = [
    { question: "🎯 What is your fitness goal?", key: "goalType", options: ["Lose Weight", "Build Muscle", "Stay Fit"] },
    { question: "⏳ How many weeks do you want to achieve this?", key: "duration", options: ["4 Weeks", "8 Weeks", "12 Weeks"] },
    { question: "💪 How many days per week can you work out?", key: "workoutDays", options: ["3 Days", "5 Days", "6 Days"] },
    { question: "🥗 What is your preferred diet?", key: "diet", options: ["High Protein", "Balanced Diet", "Vegetarian", "Keto"] }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [userGoal, setUserGoal] = useState({});
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan();
      setCurrentStep(steps.length);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelect = (key, value) => {
    setUserGoal({ ...userGoal, [key]: value });
  };

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    
    const prompt = `
      Create a personalized fitness plan for someone who wants to ${userGoal.goalType} in ${userGoal.duration}.
      They will work out ${userGoal.workoutDays} days per week and follow a ${userGoal.diet} diet.
      Include:
      - 🏋️ Recommended workouts
      - 🍎 Dietary suggestions
      - 💧 Hydration tips
      - 🚀 Motivation & encouragement
    `;

    try {
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        throw new Error("API key is missing. Please add VITE_GEMINI_KEY to your .env file and restart the app.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setGeneratedPlan(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("No valid response from AI service");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      setError(error.message || "Error generating your fitness plan. Please try again.");
      setGeneratedPlan("");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToWorkout = () => {
    navigate("/workout-tracker");
  };

  return (
    <div className="goal-container">
      {currentStep < steps.length ? (
        <div className="question-box">
          <h2>{steps[currentStep].question}</h2>
          <div className="options">
            {steps[currentStep].options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(steps[currentStep].key, option)}
                className={userGoal[steps[currentStep].key] === option ? "selected" : ""}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="nav-buttons">
            {currentStep > 0 && <button onClick={handlePrev}>Previous</button>}
            <button 
              onClick={handleNext}
              disabled={!userGoal[steps[currentStep].key]}
            >
              {currentStep === steps.length - 1 ? "Generate Plan" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="goal-summary">
          <h2>🏆 Your Personalized Fitness Plan</h2>
          {loading ? (
            <p>⏳ Generating your plan...</p>
          ) : error ? (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <button onClick={() => setCurrentStep(steps.length - 1)}>Try Again</button>
            </div>
          ) : generatedPlan ? (
            <div className="plan-content">
              <div className="generated-plan">
                {generatedPlan.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <button onClick={handleRedirectToWorkout}>➡️ Go to Workout Tracker</button>
            </div>
          ) : (
            <p>No plan available. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Goals;