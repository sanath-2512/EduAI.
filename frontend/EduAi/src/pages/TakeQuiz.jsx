import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Info, Clock, Trophy, Target, TrendingUp, RotateCcw } from 'lucide-react';

const TakeQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        // Ensure questions are unique
        const uniqueQuestions = [];
        const seenQuestions = new Set();
        
        res.data.questions.forEach(q => {
          const questionKey = q.question.toLowerCase().trim();
          if (!seenQuestions.has(questionKey)) {
            seenQuestions.add(questionKey);
            uniqueQuestions.push(q);
          }
        });
        
        setQuiz({ ...res.data, questions: uniqueQuestions });
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (!submitted && quiz) {
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [submitted, quiz]);

  const handleOptionSelect = (questionIndex, option) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);

    try {
      await api.post('/progress', { 
        courseId: quiz.courseId, 
        quizId: quiz._id, 
        quizScore: (calculatedScore / quiz.questions.length) * 100 
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!quiz) return <div className="text-center p-8">Loading...</div>;

  const percentage = submitted ? Math.round((score / quiz.questions.length) * 100) : 0;
  const passed = percentage >= 70;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / quiz.questions.length) * 100;
  const correctCount = submitted ? score : Object.keys(answers).filter((idx) => answers[idx] === quiz.questions[idx].correctAnswer).length;
  const incorrectCount = submitted ? quiz.questions.length - score : answeredCount - correctCount;

  return (
    <div className="container" style={{ maxWidth: '56rem', padding: '2.5rem 1rem' }}>
      <div className="card p-8">
        {/* Header with Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{quiz.title}</h1>
            {!submitted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)' }}>
                <Clock size={18} />
                <span>{formatTime(timeSpent)}</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {!submitted && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Progress: {answeredCount} / {quiz.questions.length} answered
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: 'var(--gray-200)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${progressPercentage}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--primary)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Question Navigation Grid (after submission) */}
          {submitted && !showReview && (
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap',
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--gray-50)',
              borderRadius: '0.5rem'
            }}>
              {quiz.questions.map((q, index) => {
                const isCorrect = answers[index] === q.correctAnswer;
                const isAnswered = answers[index] !== undefined;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setShowReview(true);
                      setCurrentQuestion(index);
                    }}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.25rem',
                      border: '2px solid',
                      backgroundColor: isCorrect ? '#d1fae5' : isAnswered ? '#fee2e2' : 'white',
                      borderColor: isCorrect ? '#10b981' : isAnswered ? '#ef4444' : 'var(--gray-300)',
                      color: isCorrect ? '#065f46' : isAnswered ? '#991b1b' : 'var(--gray-600)',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
              <div style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                <span style={{ display: 'inline-block', marginRight: '1rem' }}>
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px', marginRight: '0.25rem' }}></span>
                  Correct
                </span>
                <span style={{ display: 'inline-block', marginRight: '1rem' }}>
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px', marginRight: '0.25rem' }}></span>
                  Incorrect
                </span>
                <span>
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: 'white', border: '2px solid var(--gray-300)', borderRadius: '2px', marginRight: '0.25rem' }}></span>
                  Unanswered
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results Screen */}
        {submitted && !showReview && (
          <div className="text-center mb-8">
            <div style={{ 
              padding: '2.5rem',
              background: `linear-gradient(135deg, ${percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'}15 0%, ${percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'}05 100%)`,
              borderRadius: '1rem',
              marginBottom: '2rem',
              border: `2px solid ${percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'}40`
            }}>
              <Trophy size={48} style={{ 
                color: percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444',
                marginBottom: '1rem'
              }} />
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: percentage >= 90 ? '#10b981' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444' }}>
                {percentage}%
              </h2>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {percentage >= 90 ? '🌟 Outstanding!' : percentage >= 70 ? '🎉 Great Job!' : percentage >= 50 ? '💪 Good Effort!' : '📚 Keep Practicing!'}
              </p>
              <p style={{ fontSize: '1.125rem', color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                You scored {score} out of {quiz.questions.length} questions
              </p>
              
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{correctCount}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Correct</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{incorrectCount}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Incorrect</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{formatTime(timeSpent)}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Time</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <button
                onClick={() => setShowReview(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Info size={18} /> Review Answers
              </button>
              <button
                onClick={() => navigate(`/course/${quiz.courseId}`)}
                className="btn"
                style={{ backgroundColor: 'var(--gray-800)', color: 'white' }}
              >
                Back to Course
              </button>
            </div>
          </div>
        )}

        {/* Question Display */}
        {(showReview || !submitted) && quiz.questions.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </h3>
              {submitted && (
                <span style={{ 
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  backgroundColor: answers[currentQuestion] === quiz.questions[currentQuestion].correctAnswer ? '#d1fae5' : '#fee2e2',
                  color: answers[currentQuestion] === quiz.questions[currentQuestion].correctAnswer ? '#065f46' : '#991b1b',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {answers[currentQuestion] === quiz.questions[currentQuestion].correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                </span>
              )}
            </div>

            <div style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                {quiz.questions[currentQuestion].question}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {quiz.questions[currentQuestion].options.map((option, oIndex) => {
                  let optionClass = "quiz-option";
                  const isSelected = answers[currentQuestion] === option;
                  const isCorrect = option === quiz.questions[currentQuestion].correctAnswer;
                  
                  if (submitted) {
                    if (isCorrect) optionClass += " correct";
                    else if (isSelected) optionClass += " wrong";
                  } else {
                    if (isSelected) optionClass += " selected";
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleOptionSelect(currentQuestion, option)}
                      className={optionClass}
                      disabled={submitted}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {submitted && isCorrect && <CheckCircle size={20} style={{ color: 'var(--success)' }} />}
                        {submitted && isSelected && !isCorrect && <XCircle size={20} style={{ color: 'var(--danger)' }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Show explanation after submission */}
              {submitted && quiz.questions[currentQuestion].explanation && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--gray-50)',
                  borderLeft: '4px solid var(--primary)',
                  borderRadius: '0.25rem'
                }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                    <Info size={18} style={{ color: 'var(--primary)' }} />
                    <strong style={{ color: 'var(--primary)' }}>Explanation:</strong>
                  </div>
                  <p style={{ color: 'var(--gray-700)', lineHeight: '1.6' }}>{quiz.questions[currentQuestion].explanation}</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="btn"
                style={{ 
                  opacity: currentQuestion === 0 ? 0.5 : 1,
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>
              {!submitted && (
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestion === quiz.questions.length - 1}
                  className="btn btn-primary"
                  style={{ 
                    opacity: currentQuestion === quiz.questions.length - 1 ? 0.5 : 1,
                    cursor: currentQuestion === quiz.questions.length - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next →
                </button>
              )}
              {submitted && (
                <>
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="btn btn-primary"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowReview(false)}
                      className="btn"
                      style={{ backgroundColor: 'var(--gray-800)', color: 'white' }}
                    >
                      Back to Results
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quiz.questions.length}
            className="btn btn-primary w-full mt-6"
            style={{ 
              opacity: Object.keys(answers).length !== quiz.questions.length ? 0.5 : 1,
              cursor: Object.keys(answers).length !== quiz.questions.length ? 'not-allowed' : 'pointer',
              fontSize: '1.125rem',
              padding: '1rem',
              fontWeight: 'bold'
            }}
          >
            Submit Quiz ({Object.keys(answers).length}/{quiz.questions.length} answered)
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
