import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { WorkoutProvider } from "./context/WorkoutContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <WorkoutProvider>
      <App />
    </WorkoutProvider>
  </AuthProvider>
);
