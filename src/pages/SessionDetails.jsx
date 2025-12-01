import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUserTie, FaListUl, FaLightbulb, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SessionService from '../apis/session';
import './SessionDetails.css';

const SessionDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSessionDetails();
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await SessionService.getSessionById(sessionId);
      if (response.success) {
        setSession(response.data);
      } else {
        setError(response.message || 'Failed to fetch session details');
      }
    } catch (err) {
      setError('An error occurred while fetching session details');
      console.error('Error fetching session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format time to AM/PM format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateParts = dateString.split('-').map(Number);
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="session-details-page">
        <Navbar />
        <div className="session-details-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading session details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="session-details-page">
        <Navbar />
        <div className="session-details-container">
          <div className="error-state">
            <p>{error}</p>
            <button className="back-btn" onClick={() => navigate('/qna')}>
              <FaArrowLeft /> Back to Sessions
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="session-details-page">
        <Navbar />
        <div className="session-details-container">
          <div className="error-state">
            <p>Session not found</p>
            <button className="back-btn" onClick={() => navigate('/qna')}>
              <FaArrowLeft /> Back to Sessions
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="session-details-page">
      <Navbar />
      <div className="session-details-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/qna')}>
          <FaArrowLeft /> Back to Sessions
        </button>

        {/* Session Header */}
        <div className="session-details-header">
          <h1>{session.title || session.name}</h1>
          <div className="session-meta">
            <div className="meta-item">
              <FaUserTie />
              <span>{session.scholarName || 'Scholar'}</span>
            </div>
            <div className="meta-item">
              <FaCalendarAlt />
              <span>{formatDate(session.date)}</span>
            </div>
            <div className="meta-item">
              <FaClock />
              <span>{formatTime(session.startTime)}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {session.description && (
          <div className="session-section">
            <h2><FaFileAlt /> Description</h2>
            <div className="section-content">
              <p>{session.description}</p>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {session.summary && (
          <div className="session-section">
            <h2><FaClipboardList /> Summary</h2>
            <div className="section-content">
              <p>{session.summary}</p>
            </div>
          </div>
        )}

        {/* Key Points Section */}
        {session.keyPoints && session.keyPoints.length > 0 && (
          <div className="session-section">
            <h2><FaLightbulb /> Key Points</h2>
            <div className="section-content">
              <ul className="key-points-list">
                {session.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Items Section */}
        {session.actionItems && session.actionItems.length > 0 && (
          <div className="session-section">
            <h2><FaListUl /> Action Items</h2>
            <div className="section-content">
              <ul className="action-items-list">
                {session.actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Transcript Section */}
        {session.transcript && (
          <div className="session-section transcript-section">
            <h2><FaFileAlt /> Transcript</h2>
            <div className="section-content transcript-content">
              <p>{session.transcript}</p>
            </div>
          </div>
        )}

        {/* No Additional Details Message */}
        {!session.summary && !session.transcript && (!session.keyPoints || session.keyPoints.length === 0) && (!session.actionItems || session.actionItems.length === 0) && (
          <div className="no-details-message">
            <p>No additional details available for this session yet. Details will be added after the session is completed.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SessionDetails;
