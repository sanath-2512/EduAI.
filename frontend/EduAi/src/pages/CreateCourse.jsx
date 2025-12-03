import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader } from 'lucide-react';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Creating course with:', { title, description, topic, useAI });
      const res = await api.post('/courses', { title, description, topic, useAI });
      console.log('Course created:', res.data);
      console.log('Course content:', {
        hasContent: !!res.data.content,
        modulesCount: res.data.content?.modules?.length,
        modules: res.data.content?.modules?.map(m => ({ title: m.moduleTitle || m.title, lessons: m.lessons?.length }))
      });
      
      const courseId = res.data.id || res.data._id;
      if (courseId) {
        navigate(`/course/${courseId}`);
      } else {
        alert('Course created but no ID returned. Please check your courses.');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error creating course:', err);
      let errorMsg = 'Failed to create course';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMsg = `Server Error (${err.response.status}): ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMsg = 'No response from server. Please check if backend is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMsg = err.message;
      }
      
      alert(`Failed to create course: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '48rem', padding: '2.5rem 1rem' }}>
      <div className="card p-8">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Create New Course</h1>
        
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={useAI} 
              onChange={(e) => setUseAI(e.target.checked)}
              style={{ width: '1.25rem', height: '1.25rem' }}
            />
            <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles style={{ color: '#f59e0b' }} size={20} /> Use AI to Generate Content
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {useAI ? (
            <div>
              <label className="input-label">Topic</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g., Introduction to Quantum Physics"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>AI will generate the title, description, and modules based on this topic.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="input-label">Course Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea
                  required
                  rows="4"
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? <Loader className="spinner" size={20} /> : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
