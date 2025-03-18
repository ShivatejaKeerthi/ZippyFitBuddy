import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">💪 Zippy</Link>
        <ul className="nav-links">
          {user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/goals">Goals</Link></li>
              <li><Link to="/workout-tracker">Workout Tracker</Link></li>
              <li><Link to="/insights">Insights</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          ) : null}
        </ul>
        {!user && <Link to="/login" className="signin-btn">Sign In</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
