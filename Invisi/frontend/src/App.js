// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import CreateNote from "./CreateNote";
import ViewNote from "./ViewNote";
import YourNotes from "./YourNotes";

import Landing from "./Landing";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="logo-container">
            <div className="logo">🕵️‍♂️</div>
            <h1>InvisiNote</h1>
          </div>

          <nav className="main-nav">
            <ul>
              <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
              <li><NavLink to="/create" className={({ isActive }) => isActive ? "active" : ""}>Create</NavLink></li>
              <li><NavLink to="/notes" className={({ isActive }) => isActive ? "active" : ""}>My Notes</NavLink></li>
           
            </ul>
          </nav>

          <div className="user-actions">
            <button className="btn-login">Sign In</button>
            <button className="btn-register">Get Started</button>
          </div>
        </header>

        {/* Main Content */}
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateNote />} />
            <Route path="/notes" element={<YourNotes />} />
            <Route path="/notes/:id" element={<ViewNote />} />
    
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>InvisiNote</h3>
              <p>Secure Timed Messages — Shared Only at the Right Moment</p>
              <div className="social-icons">
                <a href="#"><span className="social-icon">𝕏</span></a>
                <a href="#"><span className="social-icon">f</span></a>
                <a href="#"><span className="social-icon">in</span></a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><NavLink to="/features">Features</NavLink></li>
                {/* <li><NavLink to="/pricing">Pricing</NavLink></li> */}
                <li><NavLink to="/create">Create Note</NavLink></li>
                <li><NavLink to="/notes">My Notes</NavLink></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><NavLink to="/about">About Us</NavLink></li>
             
                <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                <li><NavLink to="/terms">Terms of Service</NavLink></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter for updates</p>
              <div className="newsletter">
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} InvisiNote. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;