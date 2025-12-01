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
      const res = await api.post('/courses', { title, description, topic, useAI });
      navigate(`/course/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create course');
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
