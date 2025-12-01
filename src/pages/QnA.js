import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUserAlt, FaVideo, FaMapMarkerAlt, FaUsers, FaStar, FaRegClock, FaChalkboardTeacher, FaUserTie, FaQuestionCircle, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaStarAndCrescent, FaSearch, FaPlus, FaTimes, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import './QnA.css';
import SessionService from '../apis/session';
import ScholarService from '../apis/scholar';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the Home.css file for footer styling
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const DEFAULT_SESSION_IMAGE = '/images/1.jpg';  // Using existing image
const DEFAULT_SCHOLAR_IMAGE = '/images/1.jpg';  // Using existing image

const QnA = () => {

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const [scholarCount, setScholarCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeScholar, setActiveScholar] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [scholars, setScholars] = useState([]);
  const [scholarLoading, setScholarLoading] = useState(true);
  const [scholarError, setScholarError] = useState(null);
  const [featuredSessions, setFeaturedSessions] = useState([]);
  const [scholarSearchQuery, setScholarSearchQuery] = useState('');

  // Session Tabs State
  const [activeSessionTab, setActiveSessionTab] = useState('today'); // 'today', 'upcoming', or 'mysessions'
  const [todaySessionSearch, setTodaySessionSearch] = useState('');
  const [upcomingSessionSearch, setUpcomingSessionSearch] = useState('');
  const [mySessionSearch, setMySessionSearch] = useState(''); // Search for My Sessions tab

  // Session Modal State (for scholars)
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    zoomLink: '',
    meetingPlatform: 'zoom',
    scholarUserId: '',
    scholarName: ''
  });

  // Edit Session State
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  // Custom Scholar Dropdown State
  const [showScholarDropdown, setShowScholarDropdown] = useState(false);

  // Format date to display in a more readable format

  const navigate = useNavigate();


  const formatDate = (dateString) => {
    // Parse the date string manually to avoid timezone issues
    // dateString format: "YYYY-MM-DD"
    const parts = dateString?.split('-').map(Number);
    if (parts && parts.length === 3) {
      const date = new Date(parts[0], parts[1] - 1, parts[2]); // month is 0-indexed
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    // Fallback for other date formats
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to get proper image URL (handles base64, full URLs, and file paths)
  const getScholarImageUrl = (imagePath) => {
    const BASE_URL = 'https://islamic-sphere-backend-two.vercel.app/uploads/';
    
    if (!imagePath || typeof imagePath !== 'string' || imagePath.length < 5) {
      return DEFAULT_SCHOLAR_IMAGE;
    }
    // Check if it's already a full URL or base64
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    // Check if it's a valid filename (not garbage)
    if (imagePath.includes('==') || imagePath.length > 500) {
      return DEFAULT_SCHOLAR_IMAGE;
    }
    // Assume it's a file path
    return `${BASE_URL}${imagePath}`;
  };

  // Get scholar by ID
  const getScholarById = (id) => {
    return scholars.find(scholar => scholar._id === id);
  };

  // Helper function to get scholar info from session (supports both ScholarSession and User-based scholars)
  const getSessionScholarInfo = (session) => {
    const BASE_URL = 'https://islamic-sphere-backend-two.vercel.app/uploads/';
    
    // Helper to validate image path
    const getValidImageUrl = (imagePath) => {
      if (!imagePath || typeof imagePath !== 'string' || imagePath.length < 5) {
        return DEFAULT_SCHOLAR_IMAGE;
      }
      // Check if it's already a full URL or base64
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
        return imagePath;
      }
      // Check if it's a valid filename (not garbage data)
      if (imagePath.includes('==') || imagePath.length > 500) {
        return DEFAULT_SCHOLAR_IMAGE;
      }
      return `${BASE_URL}${imagePath}`;
    };

    // First check if session has a populated scholarSession (from ScholarSession collection)
    if (session.scholarSession?.name) {
      return {
        name: session.scholarSession.name,
        image: getValidImageUrl(session.scholarSession.image)
      };
    }
    // Then check if it has scholarName (direct field for user-based scholars)
    if (session.scholarName) {
      return {
        name: session.scholarName,
        image: getValidImageUrl(session.scholarUserId?.image)
      };
    }
    // Check populated scholarUserId
    if (session.scholarUserId) {
      const fullName = `${session.scholarUserId.firstName || ''} ${session.scholarUserId.lastName || ''}`.trim();
      return {
        name: fullName || session.scholarUserId.username || 'Scholar',
        image: getValidImageUrl(session.scholarUserId.image)
      };
    }
    // Fallback
    return { name: 'Scholar', image: DEFAULT_SCHOLAR_IMAGE };
  };

  // Filter sessions by scholar ID
  const getScholarSessions = (scholarId) => {
    return sessions.filter(session => session.scholarSession === scholarId);
  };

  // Filter scholars based on search query
  const filteredScholars = scholars.filter(scholar =>
    scholar.name.toLowerCase().includes(scholarSearchQuery.toLowerCase()) ||
    scholar.specialty.toLowerCase().includes(scholarSearchQuery.toLowerCase()) ||
    (scholar.bio && scholar.bio.toLowerCase().includes(scholarSearchQuery.toLowerCase()))
  );

  // Clear active scholar if they're not in filtered results
  useEffect(() => {
    if (activeScholar && scholarSearchQuery && !filteredScholars.some(scholar => scholar._id === activeScholar._id)) {
      setActiveScholar(null);
    }
  }, [filteredScholars, activeScholar, scholarSearchQuery]);

  // Function to highlight search terms
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Join session handler - now supports multiple platforms
  const handleJoinSession = (meetingLink, platform = 'zoom') => {
    window.open(meetingLink, '_blank');
  };

  // Get platform-specific icon and text
  const getPlatformInfo = (platform) => {
    switch (platform) {
      case 'googlemeet':
        return {
          icon: '📹',
          name: 'Google Meet',
          buttonText: 'Join Google Meet'
        };
      case 'zoom':
      default:
        return {
          icon: '🎥',
          name: 'Zoom',
          buttonText: 'Join Zoom Meeting'
        };
    }
  };

  // Session Modal Handlers (for scholars)
  const handleOpenSessionModal = () => {
    // For scholar users, use their own user ID and name
    const scholarName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || '';
    
    setSessionFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      zoomLink: '',
      meetingPlatform: 'zoom',
      scholarUserId: user?._id || user?.id || '',
      scholarName: scholarName
    });
    setShowSessionModal(true);
  };

  const handleCloseSessionModal = () => {
    setShowSessionModal(false);
    setIsEditingSession(false);
    setEditingSessionId(null);
    setSessionFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      zoomLink: '',
      meetingPlatform: 'zoom',
      scholarUserId: '',
      scholarName: ''
    });
    setShowScholarDropdown(false);
  };

  // Handle Edit Session - Open modal with session data
  const handleEditSession = (session) => {
    setSessionFormData({
      title: session.title || session.name || '',
      description: session.description || '',
      date: session.date || '',
      startTime: session.startTime || '',
      endTime: session.endTime || '',
      zoomLink: session.zoomLink || '',
      meetingPlatform: session.meetingPlatform || 'zoom',
      scholarUserId: session.scholarUserId?._id || session.scholarUserId || user?._id || user?.id || '',
      scholarName: session.scholarName || `${user?.firstName} ${user?.lastName}`.trim() || user?.username
    });
    setEditingSessionId(session._id);
    setIsEditingSession(true);
    setShowSessionModal(true);
  };

  // Handle Delete Session
  const handleDeleteSession = async (sessionId, sessionTitle) => {
    if (!window.confirm(`Are you sure you want to delete the session "${sessionTitle}"?`)) {
      return;
    }

    try {
      const response = await SessionService.deleteSession(sessionId);
      if (response.success) {
        toast.success('Session deleted successfully');
        // Refresh sessions list
        const sessionsResponse = await SessionService.getSessions();
        if (sessionsResponse.success) {
          setSessions(sessionsResponse.data || []);
          setFeaturedSessions(sessionsResponse.data?.slice(0, 3) || []);
        }
      } else {
        toast.error(response.message || 'Failed to delete session');
      }
    } catch (error) {
      toast.error('Failed to delete session');
      console.error('Delete session error:', error);
    }
  };

  // Check if user can edit/delete a session
  const canManageSession = (session) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'scholar') {
      // Scholar can manage their own sessions
      const userId = user._id || user.id;
      return session.scholarUserId === userId || 
             session.scholarUserId?._id === userId ||
             session.scholarName === `${user.firstName} ${user.lastName}`.trim() ||
             session.scholarName === user.username;
    }
    return false;
  };

  const handleSessionFormChange = (e) => {
    const { name, value } = e.target;
    setSessionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle custom scholar dropdown selection
  const handleScholarSelect = (scholarId) => {
    setSessionFormData(prev => ({
      ...prev,
      scholarSession: scholarId
    }));
    setShowScholarDropdown(false);
  };

  // Get selected scholar name
  const getSelectedScholarName = () => {
    if (!sessionFormData.scholarSession) return '-- Select Scholar --';
    const scholar = scholars.find(s => s._id === sessionFormData.scholarSession);
    return scholar ? scholar.name : '-- Select Scholar --';
  };

  const validateSessionForm = () => {
    if (!sessionFormData.title.trim()) {
      toast.error('Please enter a session title');
      return false;
    }
    if (!sessionFormData.description.trim()) {
      toast.error('Please enter a session description');
      return false;
    }
    if (!sessionFormData.date) {
      toast.error('Please select a date');
      return false;
    }
    if (!sessionFormData.startTime) {
      toast.error('Please select a start time');
      return false;
    }
    if (!sessionFormData.endTime) {
      toast.error('Please select an end time');
      return false;
    }
    if (!sessionFormData.zoomLink.trim()) {
      toast.error('Please enter a meeting link');
      return false;
    }

    // Check if date is in the past (allow today)
    // Parse the date string manually to avoid timezone issues
    const [year, month, day] = sessionFormData.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day); // month is 0-indexed
    selectedDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Please select today or a future date');
      return false;
    }

    // Check if end time is after start time
    const [startHours, startMinutes] = sessionFormData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = sessionFormData.endTime.split(':').map(Number);
    if (endHours < startHours || (endHours === startHours && endMinutes <= startMinutes)) {
      toast.error('End time must be after start time');
      return false;
    }

    return true;
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    if (!validateSessionForm()) return;

    try {
      setSessionLoading(true);
      const sessionData = {
        ...sessionFormData,
        name: sessionFormData.title
      };
      
      let response;
      
      if (isEditingSession && editingSessionId) {
        // Update existing session
        console.log('Updating session with data:', sessionData);
        response = await SessionService.updateSession(editingSessionId, sessionData);
        console.log('Session update response:', response);
        
        if (response.success) {
          toast.success('Session updated successfully!');
          handleCloseSessionModal();
          fetchData(); // Refresh the data
        } else {
          toast.error(response.message || 'Failed to update session');
        }
      } else {
        // Create new session
        console.log('Creating session with data:', sessionData);
        response = await SessionService.createSession(sessionData);
        console.log('Session creation response:', response);
        
        if (response.success) {
          toast.success('Session created successfully!');
          handleCloseSessionModal();
          fetchData(); // Refresh the data
        } else {
          toast.error(response.message || 'Failed to create session');
        }
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error(isEditingSession ? 'Failed to update session' : 'Failed to create session');
    } finally {
      setSessionLoading(false);
    }
  };

  // Fetch both scholars and sessions data
  const fetchData = async () => {
    setLoading(true);
    setScholarLoading(true);
    try {
      // Fetch scholars
      const scholarsResponse = await ScholarService.getScholars();
      if (scholarsResponse.success) {
        setScholars(scholarsResponse.data);
        setActiveScholar(scholarsResponse.data[0]); // Set first scholar as active
      } else {
        setScholarError(scholarsResponse.message);
      }

      // Fetch sessions
      const sessionsResponse = await SessionService.getSessions();
      console.log('Fetched sessions:', sessionsResponse.data);
      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data);
        // Filter featured sessions
        const featured = sessionsResponse.data.filter(session =>
          new Date(session.date) >= new Date() &&
          session.featured
        );
        setFeaturedSessions(featured);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setScholarError('Failed to fetch data');
    } finally {
      setLoading(false);
      setScholarLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch real-time scholar and session counts
    const fetchCounts = async () => {
      try {
        const scholarCount = await ScholarService.getScholarCount();
        setScholarCount(scholarCount);
        const sessionCount = await SessionService.getSessionCount();
        setSessionCount(sessionCount);
      } catch (err) {
        // Optionally handle errors
      }
    };
    fetchCounts();
  }, []);

  // Toggle FAQ item expansion
  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  // Helper to create datetime from date and time strings without timezone issues
  const createDateTime = (dateStr, timeStr) => {
    const dateParts = dateStr?.split('-').map(Number);
    const [hours, minutes] = timeStr?.split(':').map(Number) || [0, 0];
    if (dateParts && dateParts.length === 3) {
      return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes);
    }
    return new Date(`${dateStr}T${timeStr}`);
  };

  const isSessionLive = (date, startTime, endTime) => {
    const sessionStartDateTime = createDateTime(date, startTime);
    const sessionEndDateTime = createDateTime(date, endTime);
    const now = new Date();
    return now >= sessionStartDateTime && now <= sessionEndDateTime;
  };

  const isSessionReadyToJoin = (date, startTime, endTime) => {
    // Session is ready to join if it's currently live
    return isSessionLive(date, startTime, endTime);
  };

  // Check if a session has already ended
  const isPastSession = (date, endTime) => {
    const sessionEndDateTime = createDateTime(date, endTime);
    const now = new Date();
    return now > sessionEndDateTime;
  };

  // Check if a session is upcoming (not started yet)
  const isUpcomingSession = (date, startTime) => {
    const sessionStartDateTime = createDateTime(date, startTime);
    const now = new Date();
    return now < sessionStartDateTime;
  };

  // Format time to AM/PM format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Helper to parse date string without timezone issues
  const parseDateString = (dateString) => {
    const parts = dateString?.split('-').map(Number);
    if (parts && parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]); // month is 0-indexed
    }
    return new Date(dateString);
  };

  // Get month from date string
  const getMonthFromDate = (dateString) => {
    return parseDateString(dateString).toLocaleString('default', { month: 'short' });
  };

  // Get day from date string
  const getDayFromDate = (dateString) => {
    return parseDateString(dateString).getDate();
  };

  // Calculate time remaining until session
  const getTimeUntilSession = (date, startTime) => {
    const sessionDateTime = createDateTime(date, startTime);
    const now = new Date();
    const diffMs = sessionDateTime - now;

    if (diffMs < 0) return 'Session has started';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000); // Calculate seconds

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHrs} hr${diffHrs > 1 ? 's' : ''} ${diffMins} min${diffMins > 1 ? 's' : ''} ${diffSecs} sec${diffSecs > 1 ? 's' : ''}`;
    } else if (diffHrs > 0) {
      return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ${diffMins} min${diffMins > 1 ? 's' : ''} ${diffSecs} sec${diffSecs > 1 ? 's' : ''}`;
    } else {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ${diffSecs} sec${diffSecs > 1 ? 's' : ''}`;
    }
  };

  // State for countdown timers
  const [countdowns, setCountdowns] = useState({});

  // Generate random particles for hero section
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`
      });
    }
    return particles;
  };

  const particles = generateParticles();



  // Update countdown timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns = {};

      featuredSessions.forEach(session => {
        const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
        const now = new Date();
        const diffMs = sessionDateTime - now;

        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

          updatedCountdowns[session.id] = {
            timeString: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            progressPercent: Math.max(0, Math.min(100, 100 - (diffMs / (24 * 60 * 60 * 1000)) * 10))
          };
        } else {
          updatedCountdowns[session.id] = {
            timeString: 'Live Now!',
            progressPercent: 100
          };
        }
      });

      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="qna-container w-full min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div className="qna-hero">
        <div className="qna-hero-overlay"></div>
        <div className="qna-hero-particles">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay
              }}
            ></div>
          ))}
        </div>
        <div className="qna-hero-content">
          <div className="hero-badge">Live Q&A Sessions</div>
          <h1>Ask Your Questions</h1>
          <p>Connect with renowned scholars and get answers to your most pressing questions</p>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">{scholarCount}</div>
              <div className="stat-label">Scholars</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">{sessionCount}</div>
              <div className="stat-label">Sessions</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Questions Answered</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
          <div className="scroll-text">Scroll Down</div>
        </div>
      </div>
      
      

      {/* Scholars Section */}
      <section className="scholars-section">
        <div className="section-header">
          <h2><FaUserTie className="section-icon" /> Our Scholars</h2>
          <p>Learn from the best Islamic scholars from around the world</p>
        </div>

        {/* Scholar Search Bar */}
        <div className="scholar-search-container">
          <div className="scholar-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search scholars by name, specialty, or expertise..."
              value={scholarSearchQuery}
              onChange={(e) => setScholarSearchQuery(e.target.value)}
              className="scholar-search-input"
            />
            {scholarSearchQuery && (
              <button
                onClick={() => setScholarSearchQuery('')}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {scholarSearchQuery && (
            <div className="search-results-info">
              {filteredScholars.length} scholar{filteredScholars.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {scholarLoading && (
          <div className="flex justify-center items-center py-8">
            <span className="text-lg text-blue-600 font-semibold">Loading scholars...</span>
          </div>
        )}

        {scholarError && (
          <div className="flex justify-center items-center py-8">
            <span className="text-lg text-red-600 font-semibold">{scholarError}</span>
          </div>
        )}

        {!scholarLoading && !scholarError && scholars.length > 0 && (
          <div className="scholars-container">
            <div className="scholars-list">
              {filteredScholars.length > 0 ? (
                filteredScholars.map(scholar => (
                  <div
                    key={scholar._id}
                    className={`scholar-card ${activeScholar?._id === scholar._id ? 'active' : ''}`}
                    onClick={() => setActiveScholar(scholar)}
                  >
                    <div className="scholar-image">
                      <img 
                        src={getScholarImageUrl(scholar.image)} 
                        alt={scholar.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SCHOLAR_IMAGE;
                        }}
                      />
                      <div className="scholar-rating">
                        <FaStar /> {scholar.rating || 0}
                      </div>
                    </div>
                    <div className="scholar-info">
                      <h3 
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(scholar.name, scholarSearchQuery)
                        }}
                      />
                      <p 
                        className="scholar-specialty"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(scholar.specialty || 'Islamic Studies', scholarSearchQuery)
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-scholars-found">
                  <p>No scholars found matching "{scholarSearchQuery}"</p>
                  <button
                    onClick={() => setScholarSearchQuery('')}
                    className="clear-search-suggestion"
                  >
                    Clear search to see all scholars
                  </button>
                </div>
              )}
            </div>

            {/* Scholar Details */}
            {activeScholar && (
              <div className="scholar-details">
                <div className="scholar-profile">
                  <div className="scholar-header">
                    <div className="scholar-large-image">
                      <img 
                        src={getScholarImageUrl(activeScholar.image)} 
                        alt={activeScholar.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SCHOLAR_IMAGE;
                        }}
                      />
                    </div>
                    <div className="scholar-header-info">
                      <h2>{activeScholar.name}</h2>
                      <p className="scholar-specialty">{activeScholar.specialty || 'Islamic Studies'}</p>
                      <div className="scholar-stats">
                        <div className="stat">
                          <FaRegClock /> {activeScholar.sessions || 0} Sessions
                        </div>
                        <div className="stat">
                          <FaUsers /> {activeScholar.students || 0} Students
                        </div>
                        <div className="stat">
                          <FaStar /> {activeScholar.rating || 0} Rating
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="scholar-bio">
                    <h3>About</h3>
                    <p>{activeScholar.bio || 'No bio available.'}</p>
                    <p className="scholar-availability">
                      <FaCalendarAlt /> Available: {activeScholar.availability || 'Contact for availability'}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Languages:</span> {activeScholar.languages?.join(', ') || 'Not specified'}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Certifications:</span>
                    {activeScholar.certifications?.length > 0 ? (
                      <ul className="list-disc list-inside ml-2">
                        {activeScholar.certifications.map((cert, idx) => (
                          <li key={idx}>{cert}</li>
                        ))}
                      </ul>
                    ) : (
                      <span> Not specified</span>
                    )}
                  </div>
                </div>

               
              </div>
            )}
          </div>
        )}
      </section>

      {/* Featured Sessions Section */}
      <section className="featured-sessions-section">
        {/* <div className="section-header">
          <div className="section-badge">Don't Miss Out</div>
          <h2><FaCalendarAlt className="section-icon" /> Featured Sessions</h2>
          <p>Join our most popular and highly anticipated Q&A sessions</p>
        </div> */}

        <div className="featured-sessions-container">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-lg text-blue-600 font-semibold">Loading sessions...</span>
            </div>
          ) : (
            featuredSessions.map(session => {
              const scholarInfo = getSessionScholarInfo(session);
              return (
                <div key={session._id} className="featured-session-card">
                  <div className="featured-session-image">
                    <img src={scholarInfo.image} alt={scholarInfo.name} />
                    {isSessionLive(session.date, session.startTime) && (
                      <div className="featured-live-badge">LIVE NOW</div>
                    )}
                  </div>
                  <div className="featured-session-content">
                    <h3>{session.topic}</h3>
                    <div className="featured-session-scholar">
                      <span>{scholarInfo.name}</span>
                    </div>
                    <p className="featured-session-description">{session.description}</p>
                    <div className="featured-session-details">
                      <div className="detail">
                        <FaCalendarAlt /> {formatDate(session.date)}
                      </div>
                      <div className="detail">
                        <FaClock /> {session.startTime} - {session.endTime}
                      </div>
                      <div className="detail">
                        <FaUsers /> {session.participants}/{session.maxParticipants} participants
                      </div>
                    </div>
                    <div className="featured-session-countdown">
                      <div className="countdown-label">Starts in:</div>
                      <div className="countdown-timer">{getTimeUntilSession(session.date, session.startTime)}</div>
                      <div className="countdown-progress">
                        <div className="countdown-bar" style={{
                          width: `${Math.min(100, (1 - (new Date(`${session.date}T${session.startTime}`) - new Date()) / (1000 * 60 * 60 * 24 * 7)) * 100)}%`
                        }}></div>
                      </div>
                    </div>
                    <button
                      className={`featured-join-button ${isSessionReadyToJoin(session.date, session.startTime) ? 'active' : 'disabled'}`}
                      onClick={() => isSessionReadyToJoin(session.date, session.startTime) && handleJoinSession(session.zoomLink, session.meetingPlatform)}
                      disabled={!isSessionReadyToJoin(session.date, session.startTime)}
                    >
                      <FaVideo /> {isSessionLive(session.date, session.startTime) ? 
                        `Join Live on ${getPlatformInfo(session.meetingPlatform).name}` :
                        isSessionReadyToJoin(session.date, session.startTime) ? 
                        getPlatformInfo(session.meetingPlatform).buttonText : 'Remind Me'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Sessions Section with Tabs */}
      <div className="sessions-tabs-section">
        <div className="section-container">
          {/* Section Header */}
          <div className="sessions-section-header">
            <div className="section-badge">Q&A Sessions</div>
            <h2 className="section-title">Browse Sessions</h2>
            <p className="section-subtitle">Join live Q&A sessions with renowned scholars or explore upcoming events</p>
          </div>

          {/* Add Session Button for Scholars */}
          {user && user.role === 'scholar' && (
            <button
              className="add-session-btn"
              onClick={handleOpenSessionModal}
            >
              <FaPlus /> Add New Session
            </button>
          )}

          {/* Tabs Header */}
          <div className="sessions-tabs-header">
            <button
              className={`session-tab ${activeSessionTab === 'today' ? 'active' : ''}`}
              onClick={() => setActiveSessionTab('today')}
            >
              <FaCalendarAlt /> Live & Today's Sessions
            </button>
            <button
              className={`session-tab ${activeSessionTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveSessionTab('upcoming')}
            >
              <FaRegClock /> Upcoming Sessions
            </button>
            {/* My Sessions tab - only visible for scholars */}
            {user?.role === 'scholar' && (
              <button
                className={`session-tab ${activeSessionTab === 'mysessions' ? 'active' : ''}`}
                onClick={() => setActiveSessionTab('mysessions')}
              >
                <FaUserAlt /> My Sessions
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="sessions-tabs-content">
            {/* Today's Sessions Tab */}
            {activeSessionTab === 'today' && (
              <div className="tab-panel">
                {/* Search Bar for Today's Sessions */}
                <div className="session-search-bar">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search today's sessions by name..."
                    value={todaySessionSearch}
                    onChange={(e) => setTodaySessionSearch(e.target.value)}
                  />
                  {todaySessionSearch && (
                    <button className="clear-search" onClick={() => setTodaySessionSearch('')}>
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className="featured-sessions-container">
                  {sessions.filter(session => {
                    // Parse session date properly to avoid timezone issues
                    const dateParts = session.date?.split('-').map(Number) || [];
                    const sessionDate = dateParts.length === 3 
                      ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                      : new Date(session.date);
                    const today = new Date();
                    
                    // Check if session is today
                    const isToday = (
                      sessionDate.getDate() === today.getDate() &&
                      sessionDate.getMonth() === today.getMonth() &&
                      sessionDate.getFullYear() === today.getFullYear()
                    );
                    
                    // Filter by search query - support both scholarSession and scholarName
                    const scholarInfo = getSessionScholarInfo(session);
                    const matchesSearch = !todaySessionSearch || 
                      (session.title || session.name || '').toLowerCase().includes(todaySessionSearch.toLowerCase()) ||
                      scholarInfo.name.toLowerCase().includes(todaySessionSearch.toLowerCase());
                    
                    return isToday && matchesSearch;
                  }).map(session => {
                    const isLive = isSessionLive(session.date, session.startTime, session.endTime);
                    const isReadyToJoin = isSessionReadyToJoin(session.date, session.startTime, session.endTime);
                    const isPast = isPastSession(session.date, session.endTime);
                    const isUpcoming = isUpcomingSession(session.date, session.startTime);

                    // Get scholar data (supports both ScholarSession and User-based scholars)
                    const scholarInfo = getSessionScholarInfo(session);

                    // Use actual session and scholar data
                    const sessionImg = session.image || 'https://via.placeholder.com/400x200?text=Islamic+Session';
                    const scholarImg = scholarInfo.image;
                    const scholarName = scholarInfo.name;

                    return (
                      <div key={session._id} className="featured-session-card">
                        {/* View Button at top-left */}
                        <div className="session-card-view">
                          <button
                            className="card-action-icon view-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/session/${session._id}`);
                            }}
                            title="View Session Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                        {/* Edit/Delete icons at top-right for scholars and admins */}
                        {canManageSession(session) && (
                          <div className="session-card-actions">
                            <button
                              className="card-action-icon edit-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSession(session);
                              }}
                              title="Edit Session"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="card-action-icon delete-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session._id, session.title || session.name);
                              }}
                              title="Delete Session"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                        <div className="featured-session-content">
                          <div className="session-header">
                            <h3>{session.title || session.name}</h3>
                            <div className="platform-badge" title={`Meeting via ${getPlatformInfo(session.meetingPlatform).name}`}>
                              {getPlatformInfo(session.meetingPlatform).icon} {getPlatformInfo(session.meetingPlatform).name}
                            </div>
                          </div>
                          <div className="featured-session-scholar">
                            <div className="scholar-avatar">
                              <img
                                src={scholarImg}
                                alt={scholarName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = DEFAULT_SCHOLAR_IMAGE;
                                }}
                              />
                            </div>
                            <span>{scholarName}</span>
                          </div>
                          <p className="featured-session-description">{session.description}</p>

                          <div className="featured-session-details">
                            <div className="detail">
                              <FaCalendarAlt /> {formatDate(session.date)}
                            </div>
                            <div className="detail">
                              <FaClock /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </div>
                            <div className="detail">
                              <FaMapMarkerAlt /> {session.location || 'Online via Zoom/Google Meet'}
                            </div>
                          </div>

                          {isUpcoming && countdowns[session._id || session.id] && (
                            <div className="featured-session-countdown">
                              <div className="countdown-label">Starting in:</div>
                              <div className="countdown-timer">{countdowns[session._id || session.id].timeString}</div>
                              <div className="countdown-progress">
                                <div
                                  className="countdown-bar"
                                  style={{ width: `${countdowns[session._id || session.id].progressPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {isLive && (
                            <div className="featured-session-live-indicator">
                              <div className="live-pulse"></div>
                              <span>This session is live now!</span>
                            </div>
                          )}

                          <div className="featured-session-countdown">
                            <div className="countdown-label">Starts in:</div>
                            <div className="countdown-timer">{getTimeUntilSession(session.date, session.startTime)}</div>
                            <div className="countdown-progress">
                              <div className="countdown-bar" style={{
                                width: `${Math.min(100, (1 - (new Date(`${session.date}T${session.startTime}`) - new Date()) / (1000 * 60 * 60 * 24 * 7)) * 100)}%`
                              }}></div>
                            </div>
                          </div>

                          <button
                            className={`featured-join-button ${isLive ? 'active' : ''} ${isPast ? 'disabled' : ''}`}
                            onClick={() => handleJoinSession(session.zoomLink, session.meetingPlatform)}
                            disabled={!isLive}
                          >
                            {isLive ? (
                              <>
                                <FaVideo /> {getPlatformInfo(session.meetingPlatform).buttonText}
                              </>
                            ) : isPast ? (
                              'Session Ended'
                            ) : (
                              <>
                                <FaRegClock /> Upcoming Today
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {sessions.filter(session => {
                    // Parse session date properly to avoid timezone issues
                    const dateParts = session.date?.split('-').map(Number) || [];
                    const sessionDate = dateParts.length === 3 
                      ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                      : new Date(session.date);
                    const today = new Date();
                    
                    const isToday = (
                      sessionDate.getDate() === today.getDate() &&
                      sessionDate.getMonth() === today.getMonth() &&
                      sessionDate.getFullYear() === today.getFullYear()
                    );
                    
                    const scholarInfo = getSessionScholarInfo(session);
                    const matchesSearch = !todaySessionSearch || 
                      (session.title || session.name || '').toLowerCase().includes(todaySessionSearch.toLowerCase()) ||
                      scholarInfo.name.toLowerCase().includes(todaySessionSearch.toLowerCase());
                    
                    return isToday && matchesSearch;
                  }).length === 0 && (
                    <div className="no-sessions-message">
                      <p className='no-message'>
                        {todaySessionSearch 
                          ? `No sessions found matching "${todaySessionSearch}"` 
                          : "No sessions scheduled for today. Check out our upcoming sessions!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming Sessions Tab */}
            {activeSessionTab === 'upcoming' && (
              <div className="tab-panel">
                {/* Search Bar for Upcoming Sessions */}
                <div className="session-search-bar">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search upcoming sessions by name..."
                    value={upcomingSessionSearch}
                    onChange={(e) => setUpcomingSessionSearch(e.target.value)}
                  />
                  {upcomingSessionSearch && (
                    <button className="clear-search" onClick={() => setUpcomingSessionSearch('')}>
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className="featured-sessions-container">
                  {sessions.filter(session => {
                    // Parse session date properly to avoid timezone issues
                    const dateParts = session.date?.split('-').map(Number) || [];
                    const sessionDate = dateParts.length === 3 
                      ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                      : new Date(session.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    sessionDate.setHours(0, 0, 0, 0);
                    
                    // Check if session is in the future (not today)
                    const isFutureDate = sessionDate > today;
                    
                    // Check if session is today
                    const isToday = (
                      sessionDate.getDate() === today.getDate() &&
                      sessionDate.getMonth() === today.getMonth() &&
                      sessionDate.getFullYear() === today.getFullYear()
                    );
                    
                    // Filter by search query - support both scholarSession and scholarName
                    const scholarInfo = getSessionScholarInfo(session);
                    const matchesSearch = !upcomingSessionSearch || 
                      (session.title || session.name || '').toLowerCase().includes(upcomingSessionSearch.toLowerCase()) ||
                      scholarInfo.name.toLowerCase().includes(upcomingSessionSearch.toLowerCase());
                    
                    return isFutureDate && !isToday && matchesSearch;
                  }).map(session => {
                    const isLive = isSessionLive(session.date, session.startTime, session.endTime);
                    const isReadyToJoin = isSessionReadyToJoin(session.date, session.startTime, session.endTime);
                    const isPast = isPastSession(session.date, session.endTime);
                    const isUpcoming = isUpcomingSession(session.date, session.startTime);

                    // Get scholar data (supports both ScholarSession and User-based scholars)
                    const scholarInfo = getSessionScholarInfo(session);

                    // Use actual session and scholar data
                    const sessionImg = session.image || 'https://via.placeholder.com/400x200?text=Upcoming+Session';
                    const scholarImg = scholarInfo.image;
                    const scholarName = scholarInfo.name;

                    return (
                      <div key={session._id} className="featured-session-card">
                        {/* View Button at top-left */}
                        <div className="session-card-view">
                          <button
                            className="card-action-icon view-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/session/${session._id}`);
                            }}
                            title="View Session Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                        {/* Edit/Delete icons at top-right for scholars and admins */}
                        {canManageSession(session) && (
                          <div className="session-card-actions">
                            <button
                              className="card-action-icon edit-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSession(session);
                              }}
                              title="Edit Session"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="card-action-icon delete-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session._id, session.title || session.name);
                              }}
                              title="Delete Session"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                        <div className="featured-session-content">
                          <div className="session-header">
                            <h3>{session.title || session.name}</h3>
                            <div className="platform-badge" title={`Meeting via ${getPlatformInfo(session.meetingPlatform).name}`}>
                              {getPlatformInfo(session.meetingPlatform).icon} {getPlatformInfo(session.meetingPlatform).name}
                            </div>
                          </div>
                          <div className="featured-session-scholar">
                            <div className="scholar-avatar">
                              <img
                                src={scholarImg}
                                alt={scholarName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = DEFAULT_SCHOLAR_IMAGE;
                                }}
                              />
                            </div>
                            <span>{scholarName}</span>
                          </div>
                          <p className="featured-session-description">{session.description}</p>

                          <div className="featured-session-details">
                            <div className="detail">
                              <FaCalendarAlt /> {formatDate(session.date)}
                            </div>
                            <div className="detail">
                              <FaClock /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </div>
                            <div className="detail">
                              <FaMapMarkerAlt /> Online via {getPlatformInfo(session.meetingPlatform).name}
                            </div>
                          </div>

                          <button
                            className="featured-join-button"
                          >
                            <FaRegClock /> Upcoming
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {sessions.filter(session => {
                    // Parse session date properly to avoid timezone issues
                    const dateParts = session.date?.split('-').map(Number) || [];
                    const sessionDate = dateParts.length === 3 
                      ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                      : new Date(session.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    sessionDate.setHours(0, 0, 0, 0);
                    
                    const isFutureDate = sessionDate > today;
                    
                    const isToday = (
                      sessionDate.getDate() === today.getDate() &&
                      sessionDate.getMonth() === today.getMonth() &&
                      sessionDate.getFullYear() === today.getFullYear()
                    );
                    
                    const scholarInfo = getSessionScholarInfo(session);
                    const matchesSearch = !upcomingSessionSearch || 
                      (session.title || session.name || '').toLowerCase().includes(upcomingSessionSearch.toLowerCase()) ||
                      scholarInfo.name.toLowerCase().includes(upcomingSessionSearch.toLowerCase());
                    
                    return isFutureDate && !isToday && matchesSearch;
                  }).length === 0 && (
                    <div className="no-sessions-message">
                      <p className='no-message'>
                        {upcomingSessionSearch 
                          ? `No upcoming sessions found matching "${upcomingSessionSearch}"` 
                          : "No upcoming sessions scheduled yet. Check back soon!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Sessions Tab - Only for Scholars */}
            {activeSessionTab === 'mysessions' && user?.role === 'scholar' && (
              <div className="tab-panel">
                {/* Search Bar for My Sessions */}
                <div className="session-search-bar">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search your sessions by name..."
                    value={mySessionSearch}
                    onChange={(e) => setMySessionSearch(e.target.value)}
                  />
                  {mySessionSearch && (
                    <button className="clear-search" onClick={() => setMySessionSearch('')}>
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className="featured-sessions-container">
                  {sessions.filter(session => {
                    // Filter only sessions created by this scholar
                    // scholarUserId can be either a string ID or a populated object with _id
                    const sessionScholarId = typeof session.scholarUserId === 'object' 
                      ? session.scholarUserId?._id 
                      : session.scholarUserId;
                    
                    const currentUserId = user?.id || user?._id;
                    
                    const isMySession = sessionScholarId === currentUserId ||
                                        String(sessionScholarId) === String(currentUserId);
                    
                    // Filter by search query
                    const matchesSearch = !mySessionSearch || 
                      (session.title || session.name || '').toLowerCase().includes(mySessionSearch.toLowerCase());
                    
                    return isMySession && matchesSearch;
                  }).map(session => {
                    const isLive = isSessionLive(session.date, session.startTime, session.endTime);
                    const isPast = isPastSession(session.date, session.endTime);

                    // For My Sessions, use the logged-in user's data since these are their own sessions
                    const scholarName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Scholar';
                    const scholarImg = getScholarImageUrl(user?.image);

                    return (
                      <div key={session._id} className="featured-session-card">
                        {/* View Button at top-left */}
                        <div className="session-card-view">
                          <button
                            className="card-action-icon view-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/session/${session._id}`);
                            }}
                            title="View Session Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                        {/* Edit/Delete icons at top-right */}
                        <div className="session-card-actions">
                          <button
                            className="card-action-icon edit-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSession(session);
                            }}
                            title="Edit Session"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="card-action-icon delete-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session._id, session.title || session.name);
                            }}
                            title="Delete Session"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="featured-session-content">
                          <div className="session-header">
                            <h3>{session.title || session.name}</h3>
                            <div className="platform-badge" title={`Meeting via ${getPlatformInfo(session.meetingPlatform).name}`}>
                              {getPlatformInfo(session.meetingPlatform).icon} {getPlatformInfo(session.meetingPlatform).name}
                            </div>
                          </div>
                          <div className="featured-session-scholar">
                            <div className="scholar-avatar">
                              <img
                                src={scholarImg}
                                alt={scholarName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = DEFAULT_SCHOLAR_IMAGE;
                                }}
                              />
                            </div>
                            <span>{scholarName}</span>
                          </div>
                          <p className="featured-session-description">{session.description}</p>

                          <div className="featured-session-details">
                            <div className="detail">
                              <FaCalendarAlt /> {formatDate(session.date)}
                            </div>
                            <div className="detail">
                              <FaClock /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </div>
                            <div className="detail">
                              <FaMapMarkerAlt /> {session.location || 'Online via ' + getPlatformInfo(session.meetingPlatform).name}
                            </div>
                          </div>

                          {isLive && (
                            <div className="featured-session-live-indicator">
                              <div className="live-pulse"></div>
                              <span>This session is live now!</span>
                            </div>
                          )}

                          <div className="featured-session-countdown">
                            <div className="countdown-label">Starts in:</div>
                            <div className="countdown-timer">{getTimeUntilSession(session.date, session.startTime)}</div>
                          </div>

                          <button
                            className={`featured-join-button ${isLive ? 'active' : ''} ${isPast ? 'disabled' : ''}`}
                            onClick={() => handleJoinSession(session.zoomLink, session.meetingPlatform)}
                            disabled={!isLive}
                          >
                            {isLive ? (
                              <>
                                <FaVideo /> {getPlatformInfo(session.meetingPlatform).buttonText}
                              </>
                            ) : isPast ? (
                              'Session Ended'
                            ) : (
                              <>
                                <FaRegClock /> Upcoming
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {sessions.filter(session => {
                    // scholarUserId can be either a string ID or a populated object with _id
                    const sessionScholarId = typeof session.scholarUserId === 'object' 
                      ? session.scholarUserId?._id 
                      : session.scholarUserId;
                    
                    const currentUserId = user?.id || user?._id;
                    
                    const isMySession = sessionScholarId === currentUserId ||
                                        String(sessionScholarId) === String(currentUserId);
                    const matchesSearch = !mySessionSearch || 
                      (session.title || session.name || '').toLowerCase().includes(mySessionSearch.toLowerCase());
                    return isMySession && matchesSearch;
                  }).length === 0 && (
                    <div className="no-sessions-message">
                      <p className='no-message'>
                        {mySessionSearch 
                          ? `No sessions found matching "${mySessionSearch}"` 
                          : "You haven't created any sessions yet. Click 'Add Session' to create one!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Session Modal for Scholars */}
      {showSessionModal && (
        <div className="session-modal-overlay">
          <div className="session-modal">
            <div className="session-modal-header">
              <h2><FaCalendarAlt /> {isEditingSession ? 'Edit Session' : 'Add New Session'}</h2>
              <button className="close-modal-btn" onClick={handleCloseSessionModal}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateSession} className="session-modal-form">
              <div className="form-group">
                <label htmlFor="title">Session Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={sessionFormData.title}
                  onChange={handleSessionFormChange}
                  placeholder="Enter session title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={sessionFormData.description}
                  onChange={handleSessionFormChange}
                  placeholder="Enter session description"
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={sessionFormData.date}
                    onChange={handleSessionFormChange}
                    min={isEditingSession ? undefined : (() => {
                      const today = new Date();
                      const year = today.getFullYear();
                      const month = String(today.getMonth() + 1).padStart(2, '0');
                      const day = String(today.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    })()}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time *</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={sessionFormData.startTime}
                    onChange={handleSessionFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endTime">End Time *</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={sessionFormData.endTime}
                    onChange={handleSessionFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="meetingPlatform">Meeting Platform *</label>
                <select
                  id="meetingPlatform"
                  name="meetingPlatform"
                  value={sessionFormData.meetingPlatform}
                  onChange={handleSessionFormChange}
                  required
                >
                  <option value="zoom">Zoom</option>
                  <option value="googlemeet">Google Meet</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="zoomLink">
                  {sessionFormData.meetingPlatform === 'zoom' ? 'Zoom' : 'Google Meet'} Link *
                </label>
                <input
                  type="url"
                  id="zoomLink"
                  name="zoomLink"
                  value={sessionFormData.zoomLink}
                  onChange={handleSessionFormChange}
                  placeholder={`Enter ${sessionFormData.meetingPlatform === 'zoom' ? 'Zoom' : 'Google Meet'} link`}
                  required
                />
              </div>

              <div className="session-modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseSessionModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={sessionLoading}>
                  {sessionLoading 
                    ? (isEditingSession ? 'Updating...' : 'Creating...') 
                    : (isEditingSession ? 'Update Session' : 'Create Session')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />






    </div>
  );
};

export default QnA;