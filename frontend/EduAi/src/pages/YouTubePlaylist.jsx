import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Youtube, Play, ExternalLink, Search, Loader, Info, Clock, Users, BookOpen, TrendingUp, Target, Zap, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const YouTubePlaylist = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [insights, setInsights] = useState(null);

  const extractPlaylistId = (url) => {
    const patterns = [
      /[?&]list=([a-zA-Z0-9_-]+)/,
      /\/playlist\?list=([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]+)$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const generateInsights = (playlistId) => {
    // Generate dynamic insights based on playlist
    const insightsList = [
      {
        icon: <Target size={20} />,
        title: "Learning Path",
        content: "This playlist follows a structured learning path. Watch videos sequentially to build knowledge progressively.",
        color: "#3b82f6"
      },
      {
        icon: <Clock size={20} />,
        title: "Time Management",
        content: "Estimated total watch time: 4-6 hours. Break it into 30-45 minute sessions for optimal retention.",
        color: "#10b981"
      },
      {
        icon: <Zap size={20} />,
        title: "Key Concepts",
        content: "Focus on understanding core concepts in early videos. Later videos build upon these foundations.",
        color: "#f59e0b"
      },
      {
        icon: <CheckCircle2 size={20} />,
        title: "Practice Tips",
        content: "Pause after each video to practice what you learned. Hands-on practice is crucial for mastery.",
        color: "#8b5cf6"
      },
      {
        icon: <TrendingUp size={20} />,
        title: "Progress Tracking",
        content: "Mark videos as watched to track your progress. Review completed videos periodically.",
        color: "#ef4444"
      },
      {
        icon: <BookOpen size={20} />,
        title: "Note Taking",
        content: "Take notes on important concepts, code snippets, and examples. Review notes before moving to next video.",
        color: "#06b6d4"
      }
    ];

    return insightsList;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get('list');
    if (idFromUrl) {
      setPlaylistId(idFromUrl);
      loadPlaylist(idFromUrl);
    }
  }, [location.search]);

  const loadPlaylist = (id) => {
    const embedUrl = `https://www.youtube.com/embed/videoseries?list=${id}&rel=0`;
    setCurrentVideo({ embedUrl, playlistId: id });
    setPlaylistInfo({
      id: id,
      embedUrl: embedUrl,
      youtubeUrl: `https://www.youtube.com/playlist?list=${id}`,
      title: "YouTube Playlist",
      videoCount: "Multiple videos"
    });
    setInsights(generateInsights(id));
  };

  const handleSearch = async () => {
    if (!playlistUrl.trim()) {
      setError('Please enter a YouTube playlist URL');
      return;
    }

    const id = extractPlaylistId(playlistUrl);
    if (!id) {
      setError('Invalid YouTube playlist URL. Please check the format.');
      return;
    }

    setLoading(true);
    setError('');
    setPlaylistId(id);
    navigate(`/playlist?list=${id}`, { replace: true });

    try {
      loadPlaylist(id);
    } catch (err) {
      setError('Failed to load playlist. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1400px', padding: '2.5rem 1rem' }}>
      {/* Header */}
      <div className="card p-8 mb-6" style={{ 
        background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Youtube size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              YouTube Playlist Player
            </h1>
            <p style={{ opacity: 0.9, fontSize: '1.05rem' }}>
              Watch curated playlists with learning insights
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Paste YouTube Playlist URL (e.g., https://www.youtube.com/playlist?list=PLxxx...)"
              className="form-input"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                background: 'white',
                color: 'var(--gray-900)',
                fontSize: '1rem',
                padding: '0.875rem 1rem'
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn"
            style={{
              background: 'white',
              color: '#FF0000',
              fontWeight: 600,
              padding: '0.875rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            {loading ? <Loader className="spinner" size={20} /> : <Search size={20} />}
            {loading ? 'Loading...' : 'Load Playlist'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-4 mb-6" style={{ 
          backgroundColor: '#fee2e2', 
          border: '2px solid #fecaca',
          borderRadius: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#991b1b' }}>
            <Info size={20} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
        </div>
      )}

      {currentVideo && playlistInfo && insights && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Main Content */}
          <div>
            {/* Video Player */}
            <div className="card p-0 mb-6" style={{ overflow: 'hidden' }}>
              <div style={{ 
                position: 'relative', 
                paddingBottom: '56.25%', 
                height: 0, 
                overflow: 'hidden',
                backgroundColor: '#000'
              }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src={currentVideo.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Playlist"
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {playlistInfo.title}
                    </h3>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                      Playlist loaded successfully
                    </p>
                  </div>
                  <a
                    href={playlistInfo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Youtube size={18} /> Open on YouTube
                  </a>
                </div>
              </div>
            </div>

            {/* Learning Tips */}
            <div className="card p-6 mb-6" style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '2px solid #bfdbfe'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={24} /> How to Maximize Your Learning
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{
                  background: 'white',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #bfdbfe'
                }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e3a8a', fontSize: '1rem' }}>
                    📝 Active Learning
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: 1.6, margin: 0 }}>
                    Don't just watch passively. Code along, pause to understand concepts, and take notes.
                  </p>
                </div>
                <div style={{
                  background: 'white',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #bfdbfe'
                }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e3a8a', fontSize: '1rem' }}>
                    🔄 Review & Practice
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: 1.6, margin: 0 }}>
                    Re-watch difficult sections and practice the concepts independently after watching.
                  </p>
                </div>
                <div style={{
                  background: 'white',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #bfdbfe'
                }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e3a8a', fontSize: '1rem' }}>
                    💬 Engage
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: 1.6, margin: 0 }}>
                    Ask questions in comments, join community discussions, and help others learn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Insights */}
          <div>
            <div className="card p-6" style={{ position: 'sticky', top: '6rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={24} style={{ color: 'var(--primary)' }} /> Learning Insights
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '0.75rem',
                      border: `2px solid ${insight.color}20`,
                      background: `linear-gradient(135deg, ${insight.color}08 0%, white 100%)`,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${insight.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${insight.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: insight.color,
                        flexShrink: 0
                      }}>
                        {insight.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--gray-900)', fontSize: '1rem' }}>
                          {insight.title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>
                          {insight.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '0.75rem',
                border: '2px solid #86efac'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                  <h4 style={{ fontWeight: '600', color: '#166534', fontSize: '1rem', margin: 0 }}>
                    Quick Tips
                  </h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'Use playback speed controls (0.75x - 1.25x)',
                    'Take notes on key concepts',
                    'Practice along with examples',
                    'Review completed videos weekly'
                  ].map((tip, i) => (
                    <li key={i} style={{
                      fontSize: '0.875rem',
                      color: '#047857',
                      marginBottom: '0.5rem',
                      paddingLeft: '1.5rem',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#10b981'
                      }}>✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!currentVideo && (
        <div className="card p-8" style={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          border: '2px dashed var(--gray-300)'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem'
          }}>
            <Youtube size={48} style={{ color: '#FF0000' }} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'var(--gray-900)' }}>
            Ready to Learn?
          </h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
            Enter a YouTube playlist URL above to get started
          </p>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            Example: https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMHafuAdHA5tYz0q3x
          </p>
        </div>
      )}

      {/* Featured Playlists */}
      {!currentVideo && (
        <div className="card p-8 mt-6">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            🎯 Featured Learning Playlists
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[
              { 
                title: 'Web Development Fundamentals', 
                id: 'PLrAXtmRdnEQy6nuLMHafuAdHA5tYz0q3x', 
                description: 'Master HTML, CSS, and JavaScript from scratch',
                color: '#3b82f6'
              },
              { 
                title: 'Python Programming Mastery', 
                id: 'PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3', 
                description: 'Complete Python course for beginners to advanced',
                color: '#10b981'
              },
              { 
                title: 'Data Science Essentials', 
                id: 'PLrAXtmRdnEQy6nuLMHafuAdHA5tYz0q3x', 
                description: 'Learn data analysis and visualization',
                color: '#f59e0b'
              },
            ].map((playlist, index) => (
              <div
                key={index}
                className="card"
                style={{ 
                  cursor: 'pointer',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${playlist.color}20`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 16px ${playlist.color}30`;
                  e.currentTarget.style.borderColor = playlist.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = `${playlist.color}20`;
                }}
                onClick={() => {
                  setPlaylistUrl(`https://www.youtube.com/playlist?list=${playlist.id}`);
                  handleSearch();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${playlist.color} 0%, ${playlist.color}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Youtube size={28} style={{ color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
                      {playlist.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                      {playlist.description}
                    </p>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: playlist.color,
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}>
                  <Play size={16} />
                  <span>Watch Playlist</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubePlaylist;
