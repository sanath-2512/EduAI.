import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
// import CourseDetails from './pages/CourseDetails';
import TakeQuiz from './pages/TakeQuiz';
import Quizzes from './pages/Quizzes';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import YouTubePlaylist from './pages/YouTubePlaylist';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import './App.css';

// Component to redirect logged-in users from home page
const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner border-4 border-primary border-t-transparent rounded-full w-12 h-12"></div></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Home />;
};

const AppContent = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-course" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
            {/* <Route path="/course/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} /> */}
            <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/playlist" element={<ProtectedRoute><YouTubePlaylist /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
