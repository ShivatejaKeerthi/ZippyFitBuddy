import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import "../components/Footer.css";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Branding Section */}
        <div className="footer-brand">
          
          <h2>Zippy</h2>
          <p>Your ultimate fitness tracker for a healthier life.</p>
          <div className="footer-icons">
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebook /></a>
            <a href="mailto:support@zippy.com"><FaEnvelope /></a>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <h3>Features</h3>
          <ul>
            <li><a href="#">Workout Plans</a></li>
            <li><a href="#">Nutrition Guide</a></li>
            <li><a href="#">Progress Tracker</a></li>
            <li><a href="#">Community Challenges</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Resources</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">API Docs</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Company</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Zippy. All rights reserved.</p>
        <p>Made with ❤️ to keep you fit!</p>
      </div>
    </footer>
  );
};

export default Footer;
