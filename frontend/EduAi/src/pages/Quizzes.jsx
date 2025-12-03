import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, Award, Zap } from 'lucide-react';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div className="card p-8 text-center">
          <div className="spinner border-4 border-primary border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
          <p style={{ color: 'var(--gray-600)' }}>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div className="dashboard-header mb-8">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Quizzes</h1>
          <p className="text-gray-500 mt-1">Test your knowledge and track your progress</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center p-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Quizzes Yet
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Quizzes are automatically created when you generate AI courses. Create a course to get started!
          </p>
          <Link to="/create-course" className="btn btn-primary btn-lg">
            <Zap size={20} /> Create AI Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map(quiz => (
            <Link
              key={quiz.id || quiz._id}
              to={`/quiz/${quiz.id || quiz._id}`}
              className="card p-6"
              style={{ 
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold',
                      marginBottom: '0.25rem',
                      color: 'var(--gray-900)'
                    }}>
                      {quiz.topic}
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--gray-500)'
                    }}>
                      {Array.isArray(quiz.questions) ? quiz.questions.length : 0} Questions
                    </p>
                  </div>
                </div>
                <ChevronRight size={24} style={{ color: 'var(--primary)' }} />
              </div>

              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--gray-600)' }}>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>
                    ~{Math.max(5, Math.ceil((Array.isArray(quiz.questions) ? quiz.questions.length : 0) / 2))} min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} />
                  <span>Earn Certificate</span>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--gray-200)' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Created {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Start Quiz →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
