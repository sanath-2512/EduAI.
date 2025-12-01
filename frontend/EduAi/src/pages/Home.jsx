import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Rocket, Award } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <div className="container hero-section">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-title"
          >
            Master Any Subject with <span style={{ color: 'var(--primary)' }}>AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-subtitle"
          >
            EduAI creates personalized courses and quizzes instantly. Learn smarter, not harder.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-4 mt-4"
          >
            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              Login
            </Link>
          </motion.div>
        </div>

        <div className="features-grid">
          <FeatureCard 
            icon={<Brain size={40} style={{ color: 'var(--primary)' }} />}
            title="AI Course Generation"
            description="Enter any topic and get a structured course outline with modules and lessons instantly."
          />
          <FeatureCard 
            icon={<Rocket size={40} style={{ color: 'var(--secondary)' }} />}
            title="Interactive Quizzes"
            description="Test your knowledge with AI-generated quizzes tailored to your course content."
          />
          <FeatureCard 
            icon={<Award size={40} style={{ color: '#f59e0b' }} />}
            title="Track Progress"
            description="Monitor your learning journey with detailed progress tracking and analytics."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="feature-card"
  >
    <div className="mb-4">{icon}</div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--gray-600)' }}>{description}</p>
  </motion.div>
);

export default Home;
