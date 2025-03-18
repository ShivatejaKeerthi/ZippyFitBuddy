import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Goals.css";
import { motion } from "framer-motion";

const Goals = () => {
  const navigate = useNavigate();
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
  const [parsedPlan, setParsedPlan] = useState({
    title: "",
    intro: "",
    workouts: [],
    diet: [],
    hydration: [],
    motivation: []
  });

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

  // Parse AI response into structured sections
  useEffect(() => {
    if (generatedPlan) {
      const parsed = {
        title: "",
        intro: "",
        workouts: [],
        diet: [],
        hydration: [],
        motivation: []
      };

      // Extract title - look for heading format
      const titleMatch = generatedPlan.match(/#{1,3}\s*([^\n]+)/);
      if (titleMatch) {
        parsed.title = titleMatch[1].trim();
      } else {
        // Fallback title based on user selections
        parsed.title = `${userGoal.duration} ${userGoal.goalType} Plan (${userGoal.workoutDays}, ${userGoal.diet})`;
      }

      // Extract intro - typically first paragraph after title
      const lines = generatedPlan.split('\n');
      let currentSection = "intro";
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === "") continue;
        
        // Check for section headers
        if (line.match(/workout|exercise|training/i) && line.match(/[:#*]/)) {
          currentSection = "workouts";
          continue;
        } else if (line.match(/diet|nutrition|eating|food|meal/i) && line.match(/[:#*]/)) {
          currentSection = "diet";
          continue;
        } else if (line.match(/hydration|water|drink/i) && line.match(/[:#*]/)) {
          currentSection = "hydration";
          continue;
        } else if (line.match(/motivation|tips|advice|encourage/i) && line.match(/[:#*]/)) {
          currentSection = "motivation";
          continue;
        }
        
        // Skip markdown headings
        if (line.startsWith("#")) continue;
        
        // Add content to appropriate section
        if (currentSection === "intro") {
          parsed.intro += line + " ";
        } else {
          // Clean up bullet points and formatting
          const cleanedLine = line.replace(/^[-*•]|\*\*|__/g, "").trim();
          if (cleanedLine) {
            parsed[currentSection].push(cleanedLine);
          }
        }
      }
      
      // Clean up intro
      parsed.intro = parsed.intro.trim();
      
      // Ensure we have content in each section
      if (parsed.workouts.length === 0) {
        const workoutContent = extractSection(generatedPlan, "workout");
        if (workoutContent) {
          parsed.workouts = workoutContent.split('\n')
            .filter(line => line.trim() !== "")
            .map(line => line.replace(/^[-*•]|\*\*|__/g, "").trim());
        }
      }
      
      if (parsed.diet.length === 0) {
        const dietContent = extractSection(generatedPlan, "diet");
        if (dietContent) {
          parsed.diet = dietContent.split('\n')
            .filter(line => line.trim() !== "")
            .map(line => line.replace(/^[-*•]|\*\*|__/g, "").trim());
        }
      }
      
      if (parsed.hydration.length === 0) {
        const hydrationContent = extractSection(generatedPlan, "hydration");
        if (hydrationContent) {
          parsed.hydration = hydrationContent.split('\n')
            .filter(line => line.trim() !== "")
            .map(line => line.replace(/^[-*•]|\*\*|__/g, "").trim());
        }
      }
      
      if (parsed.motivation.length === 0) {
        const motivationContent = extractSection(generatedPlan, "motivation");
        if (motivationContent) {
          parsed.motivation = motivationContent.split('\n')
            .filter(line => line.trim() !== "")
            .map(line => line.replace(/^[-*•]|\*\*|__/g, "").trim());
        }
      }
      
      setParsedPlan(parsed);
    }
  }, [generatedPlan, userGoal]);

  // Helper function to extract sections from raw text
  const extractSection = (text, keyword) => {
    const regex = new RegExp(`(?:${keyword}s?|${keyword.charAt(0).toUpperCase() + keyword.slice(1)}s?)(?:[:\\-]|\\s+\\*\\*|\\s+__)?([\\s\\S]*?)(?=\\n\\s*(?:${keyword}|workout|diet|hydration|motivation|$))`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : "";
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
      if (!GEMINI_API_KEY) {
        throw new Error("API key is missing. Please add VITE_GEMINI_KEY to your .env file and restart the app.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      // Updated response parsing for Gemini 1.5 Flash
      if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setGeneratedPlan(data.candidates[0].content.parts[0].text);
      } else if (data.contents && data.contents[0]?.parts?.[0]?.text) {
        setGeneratedPlan(data.contents[0].parts[0].text);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Section component for the plan
  const PlanSection = ({ title, items, icon }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <motion.div 
        className="plan-section"
        variants={itemVariants}
      >
        <h3>
          <span className="section-icon">{icon}</span>
          {title}
        </h3>
        <ul>
          {items.map((item, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  };

  return (
    <div className="goal-container">
      {currentStep < steps.length ? (
        <motion.div 
          className="question-box"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>{steps[currentStep].question}</h2>
          <div className="options">
            {steps[currentStep].options.map((option, index) => (
              <motion.button
                key={option}
                onClick={() => handleSelect(steps[currentStep].key, option)}
                className={userGoal[steps[currentStep].key] === option ? "selected" : ""}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
          <div className="nav-buttons">
            {currentStep > 0 && (
              <motion.button 
                onClick={handlePrev}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
            )}
            <motion.button 
              onClick={handleNext}
              disabled={!userGoal[steps[currentStep].key]}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === steps.length - 1 ? "Generate Plan" : "Next"}
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="goal-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="loading-container">
              <h2>⏳ Generating your plan...</h2>
              <div className="loading-spinner"></div>
              <p>Creating your personalized fitness journey...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <motion.button 
                onClick={() => setCurrentStep(steps.length - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </div>
          ) : generatedPlan ? (
            <motion.div 
              className="plan-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 variants={itemVariants} className="plan-title">
                🏆 {parsedPlan.title || "Your Personalized Fitness Plan"}
              </motion.h2>
              
              {parsedPlan.intro && (
                <motion.div variants={itemVariants} className="plan-intro">
                  <p>{parsedPlan.intro}</p>
                </motion.div>
              )}
              
              <div className="plan-sections">
                <PlanSection title="Workout Recommendations" items={parsedPlan.workouts} icon="🏋️" />
                <PlanSection title="Dietary Guidelines" items={parsedPlan.diet} icon="🍎" />
                <PlanSection title="Hydration Tips" items={parsedPlan.hydration} icon="💧" />
                <PlanSection title="Motivation & Tips" items={parsedPlan.motivation} icon="🚀" />
              </div>
              
              <motion.button 
                onClick={handleRedirectToWorkout}
                className="action-button"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ➡️ Go to Workout Tracker
              </motion.button>
            </motion.div>
          ) : (
            <p>No plan available. Please try again.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Goals;