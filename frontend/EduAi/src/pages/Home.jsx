import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Sparkles, BookOpen, Brain, Rocket, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const [trendingCourses, setTrendingCourses] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Fetch all courses (public endpoint)
        const res = await api.get('/courses/all');
        // Take the first 3 as "trending" for now
        setTrendingCourses(res.data.courses.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch trending courses', err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Master Any Subject with <span className="gradient-text">AI-Powered</span> Learning
            </h1>
            <p className="hero-subtitle">
              Create custom courses, generate quizzes, and track your progress instantly. 
              The future of education is here, tailored just for you.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free <Rocket size={20} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Login
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <Brain size={32} color="#4f46e5" />
              <div>
                <h4>AI Generated</h4>
                <p>Instant curriculum</p>
              </div>
            </div>
            <div className="floating-card card-2">
              <BookOpen size={32} color="#ec4899" />
              <div>
                <h4>Smart Quizzes</h4>
                <p>Test your knowledge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Courses Section */}
      {trendingCourses.length > 0 && (
        <section className="section bg-gray-50">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title flex items-center justify-center gap-2">
                <TrendingUp className="text-red-500" /> Trending Courses
              </h2>
              <p className="section-subtitle">Explore what others are learning right now.</p>
            </div>
            <div className="course-grid">
              {trendingCourses.map(course => (
                <div key={course._id} className="course-card">
                  <div className="flex justify-between items-center mb-4">
                    <BookOpen style={{ color: 'var(--primary)' }} size={24} />
                    <span className="badge">
                      {course.generatedByAI ? 'AI Generated' : 'Custom'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{course.title}</h3>
                  <p style={{ color: 'var(--gray-600)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500">By {course.instructor?.username || 'Unknown'}</span>
                    <Link to={`/course/${course._id}`} className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
                      View Course <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose EduAI?</h2>
            <p className="section-subtitle">Experience a new way of learning designed for the modern age.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={32} />
              </div>
              <h3>AI Course Builder</h3>
              <p>Just enter a topic, and our AI will generate a comprehensive course outline with modules and lessons in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BookOpen size={32} />
              </div>
              <h3>Smart Quizzes</h3>
              <p>Automatically generate quizzes based on your course content to test your understanding and retention.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Brain size={32} />
              </div>
              <h3>Progress Tracking</h3>
              <p>Keep track of your completed modules and quiz scores. Visualize your learning journey.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
