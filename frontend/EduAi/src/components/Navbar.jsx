import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex">
          <Link to="/" className="flex items-center">
            <span className="navbar-logo">EduAI</span>
          </Link>
        </div>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <BookOpen size={18} /> Dashboard
              </Link>
              <Link to="/create-course" className="nav-link">
                <PlusCircle size={18} /> Create Course
              </Link>
              <Link to="/profile" className="nav-link">
                <User size={18} /> Profile
              </Link>
              <button onClick={handleLogout} className="nav-link" style={{ color: 'var(--gray-700)' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
