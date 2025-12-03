import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Book, Plus, Search, Filter, ChevronLeft, ChevronRight, Clock, Award, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCourses: 0, completedCourses: 0, totalHours: 0 });
  const [courseProgress, setCourseProgress] = useState({});
  
  // Filtering & Search States
  const [search, setSearch] = useState('');
  const [filterAI, setFilterAI] = useState(''); // '' = all, 'true' = AI, 'false' = Custom
  const [sort, setSort] = useState('newest'); // 'newest', 'oldest', 'title'
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        sort,
        page,
        limit: 6, // 6 items per page
      };
      if (filterAI) params.generatedByAI = filterAI;

      const res = await api.get('/courses', { params });
      setCourses(res.data.courses);
      setTotalPages(res.data.totalPages);
      setTotalCourses(res.data.totalCourses);
      
      // Fetch progress for all courses to calculate stats
      let completedCount = 0;
      let totalHours = 0;
      const progressMap = {};
      
      for (const course of res.data.courses) {
        try {
          const progressRes = await api.get('/progress', { params: { courseId: course._id } });
          const progress = progressRes.data[0] || {};
          progressMap[course._id] = progress;
          
          // Calculate completion percentage
          let completionPercentage = 0;
          
          // Normalize content for calculation
          let contentArray = course.content;
          if (course.content && !Array.isArray(course.content) && course.content.modules) {
            contentArray = course.content.modules;
          }
          
          if (contentArray && Array.isArray(contentArray) && contentArray.length > 0) {
            const totalLessons = contentArray.reduce((acc, module) => {
              return acc + (module.lessons ? module.lessons.length : 0);
            }, 0);
            const completedLessons = progress.completedLessons?.length || 0;
            completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            
            if (totalLessons > 0 && completedLessons === totalLessons) {
              completedCount++;
            }
          }
          
          progressMap[course._id].completionPercentage = completionPercentage;
          
          if (progress.learningHours) {
            totalHours += progress.learningHours;
          }
        } catch (err) {
          // Ignore errors for individual progress fetches
          progressMap[course._id] = { completionPercentage: 0 };
        }
      }
      
      setCourseProgress(progressMap);
      setStats({ 
        totalCourses: res.data.totalCourses, 
        completedCourses: completedCount,
        totalHours: totalHours
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 on search change
      fetchCourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filterAI, sort]);

  // Fetch on page change
  useEffect(() => {
    fetchCourses();
  }, [page]);

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div className="dashboard-header mb-8">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Welcome back, {user?.username}!</h1>
          <p className="text-gray-500 mt-1">Here's an overview of your learning journey.</p>
        </div>
        <Link to="/create-course" className="btn btn-primary">
          <Plus size={20} /> Create New Course
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Book size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <h3 className="text-2xl font-bold">{totalCourses}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <h3 className="text-2xl font-bold">{stats.completedCourses}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Learning Hours</p>
            <h3 className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="form-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <select 
            className="form-input w-auto"
            value={filterAI}
            onChange={(e) => setFilterAI(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="true">AI Generated</option>
            <option value="false">Custom Created</option>
          </select>

          <select 
            className="form-input w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center p-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {search ? 'No courses match your search' : 'Start Your Learning Journey'}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {search ? 'Try adjusting your filters or search terms.' : 'You haven\'t created any courses yet. Use our AI to generate a personalized course in seconds!'}
          </p>
          {!search && (
            <Link to="/create-course" className="btn btn-primary btn-lg">
              <Plus size={20} /> Create First Course
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="course-grid mb-8">
            {courses.map(course => (
              <Link key={course._id} to={`/course/${course._id}`} className="course-card">
                <div className="flex justify-between items-center mb-4">
                  <Book style={{ color: 'var(--primary)' }} size={24} />
                  <span className="badge">
                    {course.generatedByAI ? 'AI Generated' : 'Custom'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{course.title}</h3>
                <p style={{ color: 'var(--gray-600)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>{course.description}</p>
                
                {/* Progress indicator */}
                {(() => {
                  const progress = courseProgress[course._id];
                  const percentage = progress?.completionPercentage || 0;
                  return (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--gray-600)' }}>Progress</span>
                        <span style={{ fontWeight: 600, color: percentage >= 100 ? '#10b981' : 'var(--primary)' }}>
                          {percentage}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--gray-200)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          backgroundColor: percentage >= 100 ? '#10b981' : 'var(--primary)', 
                          borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })()}
                
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <span>{(course.content?.modules?.length || course.content?.length || 0)} Modules</span>
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                className="btn btn-outline p-2"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button 
                className="btn btn-outline p-2"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
