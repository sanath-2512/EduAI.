import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, CheckCircle, PlayCircle, FileText, Trash2, 
  Clock, Target, ExternalLink, Youtube, Book 
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState({ completedModules: [], completedLessons: [], learningHours: 0 });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseRes, quizRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/quizzes/course/${id}`).catch(() => ({ data: [] })),
          api.get(`/progress/${id}`).catch(() => ({ data: { completedModules: [], completedLessons: [], learningHours: 0 } }))
        ]);
        const courseData = courseRes.data;
        console.log('Course data received:', {
          title: courseData.title,
          contentLength: courseData.content?.length,
          hasContent: !!courseData.content,
          contentType: Array.isArray(courseData.content) ? 'array' : typeof courseData.content,
          firstModule: courseData.content?.[0]
        });
        
        setCourse(courseData);
        setQuizzes(quizRes.data || []);
        setProgress(progressRes.data || { completedModules: [], completedLessons: [], learningHours: 0 });
        
        // Calculate completion percentage
        if (courseData.content && Array.isArray(courseData.content) && courseData.content.length > 0) {
          const totalLessons = courseData.content.reduce((acc, module) => {
            if (module && module.lessons && Array.isArray(module.lessons)) {
              return acc + module.lessons.length;
            }
            return acc;
          }, 0);
          const completedLessons = progressRes.data?.completedLessons?.length || 0;
          const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          setCompletionPercentage(percentage);
        } else {
          console.warn('Course has no content or invalid content structure:', courseData.content);
          setCompletionPercentage(0);
          if (courseData.generatedByAI && (!courseData.content || courseData.content.length === 0)) {
            setError('Course content is still being generated. Please refresh in a moment.');
          }
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err.response?.data?.message || 'Failed to load course. Please try again.');
        if (err.response?.status === 404) {
          setTimeout(() => {
            alert('Course not found. Redirecting to dashboard...');
            navigate('/dashboard');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) {
    fetchData();
    }
  }, [id, navigate]);

  const markModuleComplete = async (moduleId) => {
    try {
      const res = await api.post('/progress', { courseId: id, completedModuleId: moduleId });
      setProgress(res.data);
      
      // Recalculate completion percentage
      if (course && course.content && course.content.length > 0) {
        const totalLessons = course.content.reduce((acc, module) => {
          return acc + (module.lessons ? module.lessons.length : 0);
        }, 0);
        const completedLessons = res.data.completedLessons?.length || 0;
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        setCompletionPercentage(percentage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const res = await api.post('/progress', { courseId: id, completedLessonId: lessonId });
      setProgress(res.data);
      
      // Recalculate completion percentage
      if (course && course.content && course.content.length > 0) {
        const totalLessons = course.content.reduce((acc, module) => {
          return acc + (module.lessons ? module.lessons.length : 0);
        }, 0);
        const completedLessons = res.data.completedLessons?.length || 0;
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        setCompletionPercentage(percentage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openLesson = (lesson) => {
    console.log('Opening lesson:', lesson);
    if (!lesson) {
      alert('Lesson data is missing. Please try again.');
      return;
    }
    // Ensure lesson is an object, not a string
    if (typeof lesson === 'string') {
      alert('Lesson content is not available yet.');
      return;
    }
    // Check if lesson has any content
    if (!lesson.beginnerExplanation && !lesson.deepTheory && !lesson.deepTheoryConcepts && !lesson.explanation && !lesson.content) {
      alert('This lesson is still being prepared. Content will be available soon.');
      return;
    }
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

  if (loading || !course) {
    return (
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div className="card p-8 text-center">
          <div className="spinner border-4 border-primary border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
          <p style={{ color: 'var(--gray-600)' }}>Loading course...</p>
          {error && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (error && !course.content) {
    return (
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div className="card p-8 text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Course Content Not Available</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const isInstructor = user && course.instructor && (
    user.id === course.instructor._id || 
    user.id === course.instructor || 
    user.userId === course.instructor._id || 
    user.userId === course.instructor ||
    String(user.id) === String(course.instructor._id) ||
    String(user.id) === String(course.instructor) ||
    String(user.userId) === String(course.instructor._id) ||
    String(user.userId) === String(course.instructor)
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div className="card mb-6">
        <div className="course-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem', wordBreak: 'break-word' }}>{course.title}</h1>
                <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '1.5rem', wordBreak: 'break-word' }}>{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {course.estimatedDuration && (
                  <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full">
                    <Clock size={16} />
                    <span>Duration: {course.estimatedDuration}</span>
                  </div>
                )}
                {course.estimatedLearningHours && (
                  <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full">
                    <Clock size={16} />
                    <span>{course.estimatedLearningHours} Hours</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full">
                  <BookOpen size={16} />
                  <span>{course.content.length} Modules</span>
                </div>
                {progress.learningHours > 0 && (
                  <div className="flex items-center gap-2 text-sm bg-green-500/20 px-3 py-1 rounded-full">
                    <Clock size={16} />
                    <span>{progress.learningHours.toFixed(1)}h Learned</span>
                  </div>
                )}
              </div>

              {/* Completion Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)' }}>
                    Course Progress
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {completionPercentage}%
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '12px', 
                  backgroundColor: 'var(--gray-200)', 
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${completionPercentage}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--primary), #10b981)',
                    transition: 'width 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '0.5rem'
                  }}>
                    {completionPercentage >= 100 && (
                      <CheckCircle size={14} style={{ color: 'white' }} />
                    )}
                  </div>
                </div>
                {completionPercentage >= 100 && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.75rem', 
                    backgroundColor: '#d1fae5', 
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={20} style={{ color: '#10b981' }} />
                      <span style={{ color: '#065f46', fontWeight: 600 }}>Course Completed! 🎉</span>
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
                          padding: '0.5rem 1rem',
                          whiteSpace: 'nowrap',
                          fontSize: '0.875rem'
                        }}
                      >
                        <Trash2 size={16} /> Delete Course
                      </button>
                    )}
                  </div>
                )}
              </div>

              {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <h3 className="flex items-center gap-2 font-semibold mb-2">
                    <Target size={18} /> What you'll learn:
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {course.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm opacity-90">
                        <CheckCircle size={14} className="mt-1 shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
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
                      padding: '0.5rem 1rem',
                      whiteSpace: 'nowrap'
                }}
              >
                    <Trash2 size={18} /> Delete Course
              </button>
            )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Course Curriculum</h2>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
              <strong>Debug:</strong> Content type: {Array.isArray(course.content) ? 'Array' : typeof course.content}, 
              Length: {course.content?.length || 0}
            </div>
          )}
          
          <div>
            {course.content && Array.isArray(course.content) && course.content.length > 0 ? course.content.map((module, index) => {
              if (!module) {
                console.warn(`Module at index ${index} is null or undefined`);
                return null;
              }
              if (!module.lessons || !Array.isArray(module.lessons)) {
                console.warn(`Module ${module.moduleTitle || module.title} has no lessons array`);
              }
              return (
              <div key={index} className="module-card">
                <div className="flex justify-between items-center mb-2">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{module.moduleTitle || module.title}</h3>
                  {module.level && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {module.level}
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>{module.moduleOverview || module.description}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {module.lessons && Array.isArray(module.lessons) && module.lessons.length > 0 ? (
                    module.lessons.map((lesson, lIndex) => {
                      if (!lesson) {
                        console.warn(`Lesson at index ${lIndex} in module ${index} is null`);
                        return null;
                      }
                    const lessonId = `${index}-${lIndex}`;
                      const isCompleted = progress.completedLessons?.includes(lessonId) || (progress.completedModules && progress.completedModules.includes(lessonId));
                      const title = typeof lesson === 'object' ? (lesson.lessonTitle || lesson.title || 'Untitled Lesson') : String(lesson);
                    
                    return (
                      <div key={lIndex} className="lesson-row" style={{ 
                        padding: '1rem', 
                        border: isCompleted ? '2px solid #10b981' : '1px solid var(--gray-200)',
                        borderRadius: '0.5rem',
                        backgroundColor: isCompleted ? '#f0fdf4' : 'white',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div className="flex items-center gap-3" style={{ flex: 1 }}>
                          {isCompleted ? (
                            <CheckCircle size={24} style={{ color: '#10b981' }} />
                          ) : (
                          <FileText size={20} style={{ color: 'var(--primary)' }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: isCompleted ? 600 : 500 }}>{title}</span>
                            {lesson.estimatedHours && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginLeft: '0.5rem' }}>
                                • {lesson.estimatedHours}h
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openLesson(lesson)}
                            style={{ 
                              padding: '0.5rem 1rem',
                              backgroundColor: isCompleted ? '#10b981' : 'var(--primary)',
                              color: 'white',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              border: 'none',
                              fontWeight: 500,
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.opacity = '0.9';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.opacity = '1';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            {isCompleted ? 'Review' : 'Start Lesson'}
                          </button>
                          <button 
                            onClick={() => markLessonComplete(lessonId)}
                            style={{ 
                              color: isCompleted ? '#10b981' : 'var(--gray-300)',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: '0.25rem',
                              transition: 'all 0.2s'
                            }}
                            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <CheckCircle size={24} />
                          </button>
                        </div>
                      </div>
                    );
                    })
                  ) : (
                    <p style={{ color: 'var(--gray-500)', fontStyle: 'italic', padding: '1rem' }}>
                      No lessons available in this module yet.
                    </p>
                  )}
                </div>
              </div>
              );
            }) : (
              <div className="card p-8 text-center" style={{ 
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                border: '2px dashed var(--gray-300)',
                marginTop: '1rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <BookOpen size={40} style={{ color: 'var(--primary)' }} />
          </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'var(--gray-900)' }}>
                  Course Content Coming Soon
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '1rem', marginBottom: '1rem' }}>
                  {course.generatedByAI 
                    ? 'The AI is generating comprehensive course content. Please refresh the page in a moment.'
                    : 'No modules available yet. Course content is being prepared.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Lesson Content Modal */}
      {selectedLesson && (() => {
        // Determine lesson type for different styling
        const hasTheory = selectedLesson.deepTheory || selectedLesson.deepTheoryConcepts;
        const hasExamples = selectedLesson.practicalExamples && selectedLesson.practicalExamples.length > 0;
        const hasExercises = selectedLesson.handsOnExercises && selectedLesson.handsOnExercises.length > 0;
        const hasCaseStudy = selectedLesson.caseStudy;
        
        // Choose theme color based on content
        let themeColor = '#4F46E5'; // Default primary
        let themeGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        let accentColor = '#667eea';
        
        if (hasExercises && hasCaseStudy) {
          themeColor = '#10b981';
          themeGradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          accentColor = '#10b981';
        } else if (hasTheory && !hasExamples) {
          themeColor = '#8b5cf6';
          themeGradient = 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)';
          accentColor = '#8b5cf6';
        } else if (hasExamples && hasExercises) {
          themeColor = '#f59e0b';
          themeGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
          accentColor = '#f59e0b';
        }

        return (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem',
          animation: 'fadeIn 0.3s ease'
        }} onClick={() => setSelectedLesson(null)}>
          <div className="card" style={{ 
            maxWidth: '1000px', width: '100%', maxHeight: '95vh', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.4s ease',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Animated Header */}
            <div style={{ 
              background: themeGradient,
              color: 'white',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '300px',
                height: '300px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-5%',
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse'
              }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'white',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}></div>
                    <span style={{ fontSize: '0.875rem', opacity: 0.9, fontWeight: 500 }}>
                      {hasTheory ? '📚 Theory Lesson' : hasExercises ? '✏️ Practice Lesson' : hasCaseStudy ? '🌍 Case Study Lesson' : '📖 Learning Lesson'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                  {selectedLesson.lessonTitle || selectedLesson.title}
                </h2>
                  {selectedLesson.estimatedHours && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', opacity: 0.9 }}>
                      <Clock size={16} />
                      <span>Estimated time: {selectedLesson.estimatedHours} hours</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedLesson(null)} 
                  style={{ 
                    fontSize: '2rem', 
                    lineHeight: 0.5, 
                    background: 'rgba(255,255,255,0.2)', 
                    border: 'none', 
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >×</button>
              </div>
              </div>

            {/* Scrollable Content */}
            <div style={{ 
              padding: '2rem', 
              overflowY: 'auto',
              flex: 1,
              background: 'linear-gradient(to bottom, #f9fafb, #ffffff)'
            }}>
              
              <div className="prose" style={{ maxWidth: 'none' }}>
                {/* Show message if no content */}
                {!selectedLesson.beginnerExplanation && !selectedLesson.deepTheory && !selectedLesson.explanation && !selectedLesson.content && (
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-8">
                    <p className="text-yellow-900">
                      This lesson is being prepared. Content will be available soon.
                    </p>
                    <p className="text-yellow-800 text-sm mt-2">
                      Lesson Title: {selectedLesson.lessonTitle || selectedLesson.title || 'Untitled'}
                    </p>
                  </div>
                )}

                {/* Beginner-Friendly Explanation */}
                {selectedLesson.beginnerExplanation && (
                  <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease 0.1s both' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: `3px solid ${accentColor}`
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: themeGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>🎯</div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', margin: 0 }}>
                        Beginner-Friendly Explanation
                      </h3>
                    </div>
                    <div className="lesson-content" style={{ 
                      background: 'white',
                      padding: '2rem',
                      borderRadius: '1rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      border: `2px solid ${accentColor}20`,
                      lineHeight: 1.9,
                      color: 'var(--gray-700)',
                      fontSize: '1.05rem'
                    }}>
                      {selectedLesson.beginnerExplanation.split('\n').map((line, i) => {
                        if (line.trim() === '') return <br key={i} />;
                        if (line.trim().startsWith('## ')) {
                          return <h4 key={i} style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem', color: accentColor }}>{line.replace('## ', '')}</h4>;
                        }
                        return (
                          <p key={i} style={{ marginBottom: '1.25rem' }}>
                            {line.split('**').map((part, j) => 
                              j % 2 === 1 ? <strong key={j} style={{ color: accentColor }}>{part}</strong> : part
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Deep Theory & Concepts */}
                {(selectedLesson.deepTheory || selectedLesson.deepTheoryConcepts) && (
                  <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '3px solid #8b5cf6'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>📚</div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', margin: 0 }}>
                        Deep Theory & Concepts
                      </h3>
                    </div>
                    <div className="lesson-content" style={{ 
                      background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
                      padding: '2rem',
                      borderRadius: '1rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      border: '2px solid #8b5cf620',
                      lineHeight: 1.9,
                      color: 'var(--gray-700)',
                      fontSize: '1.05rem'
                    }}>
                      {(selectedLesson.deepTheory || selectedLesson.deepTheoryConcepts).split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                          return <h4 key={i} style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem', color: '#8b5cf6' }}>{line.replace('## ', '')}</h4>;
                        }
                        if (line.trim().startsWith('- ')) {
                          return <div key={i} style={{ 
                            marginLeft: '1rem', 
                            marginBottom: '0.75rem',
                            paddingLeft: '1rem',
                            borderLeft: '3px solid #8b5cf6',
                            padding: '0.5rem 0 0.5rem 1rem'
                          }}>
                            {line.replace('- ', '').split('**').map((part, j) => 
                              j % 2 === 1 ? <strong key={j} style={{ color: '#8b5cf6' }}>{part}</strong> : part
                            )}
                          </div>;
                        }
                        if (line.trim() === '') return <br key={i} />;
                        return (
                          <p key={i} style={{ marginBottom: '1.25rem' }}>
                            {line.split('**').map((part, j) => 
                              j % 2 === 1 ? <strong key={j} style={{ color: '#8b5cf6' }}>{part}</strong> : part
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Fallback for old structure */}
                {!selectedLesson.beginnerExplanation && !selectedLesson.deepTheory && (selectedLesson.explanation || selectedLesson.content) && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">📖 Explanation</h3>
                  <div className="lesson-content" style={{ lineHeight: 1.8, color: 'var(--gray-700)' }}>
                    {(selectedLesson.explanation || selectedLesson.content).split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h4 key={i} style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>{line.replace('## ', '')}</h4>;
                      }
                      if (line.trim().startsWith('- ')) {
                        return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                          {line.replace('- ', '').split('**').map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </li>;
                      }
                      if (line.trim() === '') return <br key={i} />;
                      return (
                        <p key={i} style={{ marginBottom: '1rem' }}>
                          {line.split('**').map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* Practical Examples */}
                {selectedLesson.practicalExamples && selectedLesson.practicalExamples.length > 0 && (
                  <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '3px solid #3b82f6'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>💡</div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', margin: 0 }}>
                        Practical Examples ({selectedLesson.practicalExamples.length})
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {selectedLesson.practicalExamples.map((ex, i) => (
                        <div key={i} style={{
                          background: 'white',
                          padding: '1.5rem',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                          border: '2px solid #3b82f620',
                          borderLeft: '4px solid #3b82f6',
                          transition: 'all 0.3s ease',
                          animation: `fadeInUp 0.5s ease ${0.4 + i * 0.1}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                        }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.875rem'
                            }}>{i + 1}</div>
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1e40af', margin: 0 }}>
                              {ex.title || `Example ${i + 1}`}
                            </h4>
                          </div>
                          <p style={{ color: 'var(--gray-700)', marginBottom: '1rem', lineHeight: 1.7 }}>{ex.description}</p>
                          {ex.commonMistakes && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                              <strong style={{ color: '#991b1b', display: 'block', marginBottom: '0.5rem' }}>⚠️ Common Mistakes:</strong>
                              <p style={{ color: '#7f1d1d', fontSize: '0.95rem', margin: 0 }}>{ex.commonMistakes}</p>
                            </div>
                          )}
                          {ex.correction && (
                            <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                              <strong style={{ color: '#166534', display: 'block', marginBottom: '0.5rem' }}>✅ Correction:</strong>
                              <p style={{ color: '#14532d', fontSize: '0.95rem', margin: 0 }}>{ex.correction}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    </div>
                  )}
                  
                {/* Hands-On Exercises */}
                {selectedLesson.handsOnExercises && selectedLesson.handsOnExercises.length > 0 && (
                  <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease 0.4s both' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '3px solid #f59e0b'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>✏️</div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', margin: 0 }}>
                        Hands-On Exercises ({selectedLesson.handsOnExercises.length})
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {selectedLesson.handsOnExercises.map((exercise, i) => {
                        const difficultyColors = {
                          'Easy': { bg: '#f0fdf4', border: '#86efac', text: '#166534', badge: '#dcfce7' },
                          'Medium': { bg: '#fffbeb', border: '#fde047', text: '#854d0e', badge: '#fef3c7' },
                          'Hard': { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', badge: '#fee2e2' }
                        };
                        const diff = exercise.difficulty || 'Medium';
                        const colors = difficultyColors[diff] || difficultyColors['Medium'];
                        
                        return (
                          <div key={i} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            border: `2px solid ${colors.border}`,
                            borderLeft: '4px solid #f59e0b',
                            transition: 'all 0.3s ease',
                            animation: `fadeInUp 0.5s ease ${0.5 + i * 0.1}s both`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                          }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '8px',
                                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem'
                                }}>{i + 1}</div>
                                <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#92400e', margin: 0 }}>
                                  Exercise {i + 1}
                                </h4>
                              </div>
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                background: colors.badge,
                                color: colors.text,
                                fontWeight: 600
                              }}>
                                {diff}
                              </span>
                            </div>
                            <p style={{ color: 'var(--gray-700)', marginBottom: '1rem', lineHeight: 1.7, fontSize: '1rem' }}>
                              {exercise.exercise}
                            </p>
                            <details style={{ marginTop: '1rem' }}>
                              <summary style={{
                                cursor: 'pointer',
                                color: '#f59e0b',
                                fontWeight: 600,
                                padding: '0.75rem',
                                background: '#fffbeb',
                                borderRadius: '0.5rem',
                                border: '1px solid #fde047',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#fef3c7';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#fffbeb';
                              }}
                              >
                                💡 Show Solution
                              </summary>
                              <div style={{
                                marginTop: '0.75rem',
                                padding: '1.25rem',
                                background: '#f9fafb',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb'
                              }}>
                                <p style={{ color: 'var(--gray-700)', margin: 0, lineHeight: 1.7 }}>{exercise.solution}</p>
                              </div>
                            </details>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Case Study */}
                {selectedLesson.caseStudy && (
                  <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease 0.5s both' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '3px solid #10b981'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>🌍</div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', margin: 0 }}>
                        Real-World Case Study
                      </h3>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                      padding: '2rem',
                      borderRadius: '1rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      border: '2px solid #10b98120',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
                        borderRadius: '50%'
                      }}></div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#065f46', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                        {selectedLesson.caseStudy.title}
                      </h4>
                      <p style={{ color: '#047857', marginBottom: '1.5rem', lineHeight: 1.7, fontSize: '1.05rem', position: 'relative', zIndex: 1 }}>
                        {selectedLesson.caseStudy.scenario}
                      </p>
                      {selectedLesson.caseStudy.steps && selectedLesson.caseStudy.steps.length > 0 && (
                        <div style={{ marginTop: '1.5rem', position: 'relative', zIndex: 1 }}>
                          <strong style={{ color: '#065f46', display: 'block', marginBottom: '1rem', fontSize: '1.05rem' }}>
                            📋 Solution Steps:
                          </strong>
                          <ol style={{ listStyle: 'none', counterReset: 'step-counter', padding: 0 }}>
                            {selectedLesson.caseStudy.steps.map((step, i) => (
                              <li key={i} style={{
                                counterIncrement: 'step-counter',
                                marginBottom: '1rem',
                                paddingLeft: '2.5rem',
                                position: 'relative',
                                color: '#047857',
                                lineHeight: 1.7
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  left: 0,
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem'
                                }}>{i + 1}</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                    </div>
                  )}
                      {selectedLesson.caseStudy.outcome && (
                        <div style={{
                          marginTop: '1.5rem',
                          padding: '1.25rem',
                          background: 'white',
                          borderRadius: '0.75rem',
                          border: '2px solid #86efac',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <strong style={{ color: '#065f46', display: 'block', marginBottom: '0.75rem' }}>
                            ✅ Expected Outcome:
                          </strong>
                          <p style={{ color: '#047857', margin: 0, lineHeight: 1.7 }}>{selectedLesson.caseStudy.outcome}</p>
                </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chapter Quiz */}
                {selectedLesson.chapterQuiz && selectedLesson.chapterQuiz.questions && selectedLesson.chapterQuiz.questions.length > 0 && (
                  <div className="mb-8" style={{ animation: 'fadeInUp 0.5s ease 0.6s both' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '3px solid #eab308'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>📝</div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', margin: 0 }}>
                        Chapter Quiz ({selectedLesson.chapterQuiz.questions.length} questions)
                      </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {selectedLesson.chapterQuiz.questions.map((q, i) => (
                        <div key={i} style={{
                          background: 'white',
                          padding: '1.5rem',
                          borderRadius: '1rem',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                          border: '2px solid #fef3c720',
                          borderLeft: '4px solid #eab308',
                          transition: 'all 0.3s ease',
                          animation: `fadeInUp 0.5s ease ${0.7 + i * 0.1}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                        }}
                        >
                          <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.875rem',
                              flexShrink: 0
                            }}>Q{i + 1}</div>
                            <p style={{ fontWeight: 600, color: '#854d0e', fontSize: '1.05rem', margin: 0, lineHeight: 1.6 }}>
                              {q.question}
                            </p>
                          </div>
                          <div style={{ marginLeft: '2.75rem', marginBottom: '1rem' }}>
                            {q.options.map((opt, j) => (
                              <div key={j} style={{
                                padding: '0.75rem',
                                marginBottom: '0.5rem',
                                borderRadius: '0.5rem',
                                background: opt === q.correctAnswer ? '#f0fdf4' : '#fffbeb',
                                border: `2px solid ${opt === q.correctAnswer ? '#86efac' : '#fde047'}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                <span style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: opt === q.correctAnswer ? '#10b981' : '#eab308',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem',
                                  flexShrink: 0
                                }}>{String.fromCharCode(65 + j)}</span>
                                <span style={{
                                  color: opt === q.correctAnswer ? '#166534' : '#854d0e',
                                  fontWeight: opt === q.correctAnswer ? 600 : 400
                                }}>
                                  {opt}
                                  {opt === q.correctAnswer && ' ✓'}
                                </span>
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <details style={{ marginLeft: '2.75rem', marginTop: '0.75rem' }}>
                              <summary style={{
                                cursor: 'pointer',
                                color: '#eab308',
                                fontWeight: 600,
                                padding: '0.5rem 0.75rem',
                                background: '#fffbeb',
                                borderRadius: '0.5rem',
                                border: '1px solid #fde047',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#fef3c7';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#fffbeb';
                              }}
                              >
                                💡 Show Explanation
                              </summary>
                              <div style={{
                                marginTop: '0.5rem',
                                padding: '1rem',
                                background: '#f9fafb',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb'
                              }}>
                                <p style={{ color: '#854d0e', margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>{q.explanation}</p>
                              </div>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                    </div>
                  )}

                {/* Old structure fallback */}
                {selectedLesson.examples && selectedLesson.examples.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-2">💡 Examples</h4>
                      <ul className="list-disc pl-4 space-y-2">
                        {selectedLesson.examples.map((ex, i) => (
                          <li key={i} className="text-blue-900 text-sm">{ex}</li>
                        ))}
                      </ul>
                    </div>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
        );
      })()}

                {/* Resources Section */}
      {course.resources && (
        <div className="card p-8 mb-6" style={{
          background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
          border: '2px solid var(--primary)20'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Book size={32} />
            </div>
                        <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                Best Resources & References
              </h2>
              <p style={{ opacity: 0.9, fontSize: '1rem' }}>
                Curated learning materials to enhance your journey
              </p>
            </div>
          </div>

          {/* YouTube Playlists */}
          {course.resources.youtubePlaylists && course.resources.youtubePlaylists.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Youtube size={24} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  YouTube Playlists ({course.resources.youtubePlaylists.length})
                    </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {course.resources.youtubePlaylists.map((playlist, idx) => (
                  <Link
                    key={idx}
                    to={`/playlist?list=${playlist.playlistId}`}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      cursor: 'pointer',
                      border: '2px solid #FF000020',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      background: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(255,0,0,0.15)';
                      e.currentTarget.style.borderColor = '#FF0000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                      e.currentTarget.style.borderColor = '#FF000020';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Youtube size={28} style={{ color: 'white' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--gray-900)', fontSize: '1.125rem' }}>
                          {playlist.title}
                          </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                          {playlist.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FF0000', fontWeight: 500, fontSize: '0.875rem' }}>
                          <Play size={16} />
                          <span>Watch Playlist</span>
                          <ExternalLink size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Books */}
          {course.resources.recommendedBooks && course.resources.recommendedBooks.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Book size={24} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  Recommended Books ({course.resources.recommendedBooks.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {course.resources.recommendedBooks.map((book, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      border: '2px solid #8b5cf620',
                      transition: 'all 0.3s ease',
                      background: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(139,92,246,0.15)';
                      e.currentTarget.style.borderColor = '#8b5cf6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                      e.currentTarget.style.borderColor = '#8b5cf620';
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <Book size={24} style={{ color: 'white' }} />
                    </div>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--gray-900)', fontSize: '1.125rem' }}>
                      {book.title}
                          </h4>
                    <p style={{ fontSize: '0.875rem', color: '#8b5cf6', marginBottom: '0.75rem', fontWeight: 500 }}>
                      by {book.author}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '1rem', lineHeight: 1.6 }}>
                      {book.description}
                    </p>
                    {book.link && (
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          fontSize: '0.875rem',
                          padding: '0.5rem 1rem',
                          background: '#8b5cf6',
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          textDecoration: 'none'
                        }}
                      >
                        View Book <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
                        </div>
                      )}

          {/* Articles */}
          {course.resources.articles && course.resources.articles.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>📄 Articles & Blog Posts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.resources.articles.map((article, idx) => (
                  <a key={idx} href={article.url} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{article.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{article.description}</p>
                    </div>
                    <ExternalLink size={18} style={{ color: 'var(--primary)', marginLeft: '1rem' }} />
                  </a>
                ))}
              </div>
                        </div>
                      )}

          {/* Documentation */}
          {course.resources.documentation && course.resources.documentation.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>📚 Official Documentation</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.resources.documentation.map((doc, idx) => (
                  <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{doc.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{doc.description}</p>
                </div>
                    <ExternalLink size={18} style={{ color: 'var(--primary)', marginLeft: '1rem' }} />
                  </a>
                ))}
                    </div>
                  </div>
                )}

          {/* Tools */}
          {course.resources.tools && course.resources.tools.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>🛠️ Tools & Software</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {course.resources.tools.map((tool, idx) => (
                  <a key={idx} href={tool.url} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '1rem', textDecoration: 'none' }}>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{tool.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{tool.description}</p>
                  </a>
                ))}
              </div>
            </div>
                      )}

          {/* Complementary Courses */}
          {course.resources.courses && course.resources.courses.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>🎓 Complementary Courses</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {course.resources.courses.map((courseItem, idx) => (
                  <a key={idx} href={courseItem.url} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '1rem', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{courseItem.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>{courseItem.platform}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{courseItem.description}</p>
          </div>
                      <ExternalLink size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
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
