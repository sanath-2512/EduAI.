import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const TakeQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionIndex, option) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionIndex]: option });
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

  return (
    <div className="container" style={{ maxWidth: '48rem', padding: '2.5rem 1rem' }}>
      <div className="card p-8">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{quiz.title}</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {quiz.questions.map((q, index) => (
            <div key={index} style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>{index + 1}. {q.question}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((option, oIndex) => {
                  let optionClass = "quiz-option";
                  if (submitted) {
                    if (option === q.correctAnswer) optionClass += " correct";
                    else if (answers[index] === option) optionClass += " wrong";
                  } else {
                    if (answers[index] === option) optionClass += " selected";
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleOptionSelect(index, option)}
                      className={optionClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {submitted && option === q.correctAnswer && <CheckCircle size={20} style={{ color: 'var(--success)' }} />}
                        {submitted && answers[index] === option && option !== q.correctAnswer && <XCircle size={20} style={{ color: 'var(--danger)' }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full mt-4"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="text-center mt-8">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Your Score: {score} / {quiz.questions.length}</h2>
            <button
              onClick={() => navigate(`/course/${quiz.courseId}`)}
              className="btn"
              style={{ backgroundColor: 'var(--gray-800)', color: 'white' }}
            >
              Back to Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
