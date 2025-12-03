import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, LogOut, Menu, X, Settings, Youtube, Award } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <GraduationCap size={32} />
          <span>EduAI</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/create-course" className="nav-link" onClick={() => setIsMenuOpen(false)}>Create Course</Link>
              <Link to="/quizzes" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Award size={18} /> Quizzes
              </Link>
              <Link to="/playlist" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Youtube size={18} /> Playlists
              </Link>
              <div className="user-menu">
                <span className="user-name">Hi, {user.username}</span>
                <Link to="/settings" className="nav-icon-link" title="Settings">
                  <Settings size={20} />
                </Link>
                <button onClick={handleLogout} className="btn-logout" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
