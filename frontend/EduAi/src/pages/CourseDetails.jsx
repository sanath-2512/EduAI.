import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, PlayCircle, FileText, Trash2 } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState({ completedModules: [] });
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, quizRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/quizzes/course/${id}`),
          api.get(`/progress/${id}`)
        ]);
        setCourse(courseRes.data);
        setQuizzes(quizRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const markModuleComplete = async (moduleId) => {
    try {
      const res = await api.post('/progress', { courseId: id, completedModuleId: moduleId });
      setProgress(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const deleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await api.delete(`/courses/${id}`);
        alert('Course deleted successfully!');
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        alert('Failed to delete course. You may not have permission.');
      }
    }
  };

  if (!course) return <div className="text-center p-8">Loading...</div>;

  const isInstructor = user && course.instructor && (user.id === course.instructor._id || user.id === course.instructor);

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div className="card mb-6">
        <div className="course-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{course.title}</h1>
              <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>{course.description}</p>
            </div>
            {isInstructor && (
              <button 
                onClick={deleteCourse}
                className="btn"
                style={{ 
                  backgroundColor: 'var(--danger)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginLeft: '1rem'
                }}
              >
                <Trash2 size={18} /> Delete Course
              </button>
            )}
          </div>
        </div>
        
        <div className="p-8">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Course Content</h2>
          <div>
            {course.content.map((module, index) => (
              <div key={index} className="module-card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{module.title}</h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>{module.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {module.lessons.map((lesson, lIndex) => {
                    const lessonId = `${index}-${lIndex}`;
                    const isCompleted = progress.completedModules.includes(lessonId);
                    const hasContent = typeof lesson === 'object' && lesson.content;
                    
                    return (
                      <div key={lIndex} className="lesson-row">
                        <div className="flex items-center gap-2" style={{ flex: 1 }}>
                          {hasContent ? <FileText size={20} style={{ color: 'var(--primary)' }} /> : <PlayCircle size={20} style={{ color: 'var(--primary)' }} />}
                          <span>{typeof lesson === 'object' ? lesson.title : lesson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasContent && (
                            <button 
                              onClick={() => openLesson(lesson)}
                              style={{ 
                                padding: '0.25rem 0.75rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem'
                              }}
                            >
                              View Notes
                            </button>
                          )}
                          <button 
                            onClick={() => markModuleComplete(lessonId)}
                            style={{ 
                              color: isCompleted ? 'var(--success)' : 'var(--gray-300)',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none'
                            }}
                          >
                            <CheckCircle size={24} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Content Modal */}
      {selectedLesson && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setSelectedLesson(null)}>
          <div className="card" style={{ 
            maxWidth: '800px', 
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedLesson.title}</h2>
                <button 
                  onClick={() => setSelectedLesson(null)}
                  style={{ 
                    fontSize: '1.5rem',
                    color: 'var(--gray-500)',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ 
                lineHeight: '1.8',
                color: 'var(--gray-700)',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedLesson.content}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Quizzes</h2>
        {quizzes.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>No quizzes available for this course yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {quizzes.map(quiz => (
              <Link key={quiz._id} to={`/quiz/${quiz._id}`} style={{ border: '1px solid var(--gray-200)', padding: '1rem', borderRadius: '0.5rem', display: 'block' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>{quiz.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{quiz.questions.length} Questions</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
