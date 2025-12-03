import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  BookOpen, Clock, Award, ChevronDown, ChevronUp, CheckCircle, 
  Circle, Youtube, ExternalLink, Trash2, Edit, ArrowLeft, Target,
  BookMarked, Lightbulb, Code, FileText, Trophy, Zap
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'resources', 'projects'

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
      
      // Expand first module by default
      if (res.data.content?.modules?.length > 0) {
        setExpandedModules({ 0: true });
      }
      
      // Fetch progress
      try {
        const progressRes = await api.get('/progress', { params: { courseId: id } });
        if (progressRes.data[0]?.completedLessons) {
          setCompletedLessons(progressRes.data[0].completedLessons);
        }
      } catch (err) {
        console.log('No progress found');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleLesson = (moduleIndex, lessonIndex) => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setExpandedLessons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleLessonComplete = async (moduleIndex, lessonIndex) => {
    const lessonId = `${moduleIndex}-${lessonIndex}`;
    const isCompleted = completedLessons.includes(lessonId);
    
    const newCompletedLessons = isCompleted
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(newCompletedLessons);
    
    try {
      await api.post('/progress', {
        courseId: id,
        completedLessons: newCompletedLessons
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await api.delete(`/courses/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div className="card p-8 text-center">
          <div className="spinner border-4 border-primary border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
          <p style={{ color: 'var(--gray-600)' }}>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div className="card p-8 text-center">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Course not found</h2>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const modules = course.content?.modules || [];
  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  return (
    <div className="container" style={{ maxWidth: '1400px', padding: '2.5rem 1rem' }}>
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/dashboard')} className="btn mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        
        <div className="card p-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <BookOpen size={32} />
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  {course.generatedByAI ? 'AI Generated' : 'Custom'}
                </span>
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>{course.title}</h1>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '1.5rem' }}>{course.description}</p>
              
              {/* Stats */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookMarked size={20} />
                  <span>{modules.length} Modules</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} />
                  <span>{totalLessons} Lessons</span>
                </div>
                {course.content?.estimatedLearningHours && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} />
                    <span>{course.content.estimatedLearningHours} hours</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={20} />
                  <span>{completionPercentage}% Complete</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleDelete} className="btn" style={{ backgroundColor: 'rgba(239, 68, 68, 0.9)', color: 'white' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span>Your Progress</span>
              <span>{completedLessons.length} / {totalLessons} lessons completed</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${completionPercentage}%`, 
                height: '100%', 
                backgroundColor: 'white',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-6" style={{ padding: '0' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid var(--gray-200)' }}>
          {[
            { id: 'content', label: 'Course Content', icon: <BookOpen size={18} /> },
            { id: 'resources', label: 'Resources', icon: <ExternalLink size={18} /> },
            { id: 'projects', label: 'Projects', icon: <Code size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--gray-600)',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="card" style={{ overflow: 'hidden' }}>
              <div
                onClick={() => toggleModule(moduleIndex)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: expandedModules[moduleIndex] ? 'var(--gray-50)' : 'white',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      Module {moduleIndex + 1}
                    </span>
                    {module.level && (
                      <span className="badge">{module.level}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {module.moduleTitle || module.title}
                  </h3>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                    {module.moduleOverview || module.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    <span>{module.lessons?.length || 0} lessons</span>
                    {module.estimatedHours && <span>{module.estimatedHours} hours</span>}
                  </div>
                </div>
                {expandedModules[moduleIndex] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>

              {expandedModules[moduleIndex] && module.lessons && (
                <div style={{ borderTop: '1px solid var(--gray-200)' }}>
                  {module.lessons.map((lesson, lessonIndex) => {
                    const lessonId = `${moduleIndex}-${lessonIndex}`;
                    const isCompleted = completedLessons.includes(lessonId);
                    const isExpanded = expandedLessons[lessonId];

                    return (
                      <div key={lessonIndex} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <div
                          style={{
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: isExpanded ? 'var(--gray-50)' : 'white'
                          }}
                        >
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                              onClick={() => toggleLessonComplete(moduleIndex, lessonIndex)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                color: isCompleted ? 'var(--success)' : 'var(--gray-400)'
                              }}
                            >
                              {isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                            </button>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                {lesson.lessonTitle || lesson.title}
                              </h4>
                              {lesson.estimatedHours && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                  <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                  {lesson.estimatedHours} hours
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleLesson(moduleIndex, lessonIndex)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.5rem',
                              color: 'var(--gray-600)'
                            }}
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: '1.5rem', backgroundColor: 'var(--gray-50)' }}>
                            {lesson.beginnerExplanation && (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Lightbulb size={18} style={{ color: '#f59e0b' }} /> Beginner-Friendly Explanation
                                </h5>
                                <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{lesson.beginnerExplanation}</p>
                              </div>
                            )}

                            {lesson.deepTheory && (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Target size={18} style={{ color: '#3b82f6' }} /> Deep Theory
                                </h5>
                                <div style={{ color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{lesson.deepTheory}</div>
                              </div>
                            )}

                            {lesson.practicalExamples && lesson.practicalExamples.length > 0 && (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Code size={18} style={{ color: '#10b981' }} /> Practical Examples
                                </h5>
                                {lesson.practicalExamples.map((example, idx) => (
                                  <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid var(--gray-200)' }}>
                                    <h6 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{example.title}</h6>
                                    <p style={{ color: 'var(--gray-700)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{example.description}</p>
                                    {example.commonMistakes && (
                                      <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.25rem' }}>
                                        <strong style={{ fontSize: '0.875rem', color: '#991b1b' }}>Common Mistakes:</strong>
                                        <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: '0.25rem 0 0 0' }}>{example.commonMistakes}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {lesson.chapterQuiz && lesson.chapterQuiz.questions && lesson.chapterQuiz.questions.length > 0 && (
                              <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '2px solid #3b82f6' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <Award size={18} style={{ color: '#3b82f6' }} />
                                  <strong style={{ color: '#1e40af' }}>Chapter Quiz Available</strong>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                                  Test your knowledge with {lesson.chapterQuiz.questions.length} questions
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && course.content?.resources && (
        <div className="card p-8">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem' }}>Learning Resources</h2>
          
          {course.content.resources.youtubePlaylists && course.content.resources.youtubePlaylists.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Youtube size={24} style={{ color: '#FF0000' }} /> YouTube Playlists
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {course.content.resources.youtubePlaylists.map((playlist, idx) => (
                  <div key={idx} className="card p-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{playlist.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{playlist.description}</p>
                    </div>
                    <Link
                      to={`/playlist?list=${playlist.playlistId}`}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Youtube size={18} /> Watch
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.content.resources.recommendedBooks && course.content.resources.recommendedBooks.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookMarked size={24} /> Recommended Books
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {course.content.resources.recommendedBooks.map((book, idx) => (
                  <div key={idx} className="card p-4">
                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{book.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>by {book.author}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{book.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && course.content?.projects && (
        <div className="card p-8">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem' }}>Course Projects</h2>
          
          {course.content.projects.miniProject && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Zap size={24} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{course.content.projects.miniProject.title}</h3>
              </div>
              <p style={{ color: 'var(--gray-700)', marginBottom: '1rem', lineHeight: 1.7 }}>{course.content.projects.miniProject.description}</p>
              
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Requirements:</h4>
              <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                {course.content.projects.miniProject.requirements?.map((req, idx) => (
                  <li key={idx} style={{ color: 'var(--gray-700)', marginBottom: '0.25rem' }}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {course.content.projects.finalProject && (
            <div className="card p-6" style={{ backgroundColor: 'var(--gray-50)', border: '2px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Trophy size={28} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{course.content.projects.finalProject.title}</h3>
              </div>
              <p style={{ color: 'var(--gray-700)', marginBottom: '1rem', lineHeight: 1.7 }}>{course.content.projects.finalProject.description}</p>
              
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Requirements:</h4>
              <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                {course.content.projects.finalProject.requirements?.map((req, idx) => (
                  <li key={idx} style={{ color: 'var(--gray-700)', marginBottom: '0.25rem' }}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
