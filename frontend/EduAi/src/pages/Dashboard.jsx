import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Book, Plus } from 'lucide-react';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div className="dashboard-header">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Learning Dashboard</h1>
        <Link to="/create-course" className="btn btn-primary">
          <Plus size={20} /> Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--gray-600)' }}>No courses found. Start learning today!</h2>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <Link key={course._id} to={`/course/${course._id}`} className="course-card">
              <div className="flex justify-between items-center mb-4">
                <Book style={{ color: 'var(--primary)' }} size={24} />
                <span className="badge">
                  {course.generatedByAI ? 'AI Generated' : 'Custom'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{course.title}</h3>
              <p style={{ color: 'var(--gray-600)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
              <div className="mt-4" style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                Instructor: {course.instructor?.username || 'Unknown'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
