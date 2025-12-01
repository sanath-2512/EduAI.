import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '48rem', padding: '2.5rem 1rem' }}>
      <div className="card p-8">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Profile</h1>
        
        <div className="profile-header">
          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{user.username}</h2>
            <p style={{ color: 'var(--gray-500)' }}>{user.email}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Account Settings</h3>
          <p style={{ color: 'var(--gray-500)' }}>Feature coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
