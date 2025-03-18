import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Goals from "./pages/Goals";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import WorkoutTracker from "./pages/WorkoutTracker";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />  {/* Always visible */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workout-tracker" 
              element={
                <ProtectedRoute>
                  <WorkoutTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/goals" 
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />  {/* Always visible */}
      </div>
    </Router>
  );
}

// NotFound component for 404 pages
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">The page you are looking for doesn't exist.</p>
      <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go Home
      </a>
    </div>
  );
}

export default App;
