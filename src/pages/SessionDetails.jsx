import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUserTie, FaListUl, FaLightbulb, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import SessionService from '../apis/session'; // Commented out - using dummy data
import './SessionDetails.css';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Helper function to get a future date
const getFutureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Dummy sessions data with full details
const DUMMY_SESSIONS_DETAILS = {
  'dummy-session-1': {
    _id: 'dummy-session-1',
    title: 'Understanding Fiqh of Salah',
    name: 'Understanding Fiqh of Salah',
    description: 'A comprehensive session covering the essential rulings of prayer according to the four schools of thought. Perfect for beginners and those seeking to deepen their understanding.',
    date: getTodayDate(),
    startTime: '18:00',
    endTime: '19:30',
    scholarName: 'Sheikh Ahmad Al-Farooq',
    summary: 'This session provided an in-depth exploration of the Fiqh (Islamic jurisprudence) of Salah (prayer). Sheikh Ahmad Al-Farooq discussed the essential rulings, conditions, and pillars of prayer according to the four major schools of Islamic thought (Hanafi, Maliki, Shafi\'i, and Hanbali). The session covered topics such as the prerequisites for prayer, the proper method of performing ablution (wudu), the times for each of the five daily prayers, and common mistakes to avoid.',
    keyPoints: [
      'The five pillars of Salah and their importance in Islamic worship',
      'Differences between the four schools of thought regarding prayer rulings',
      'The significance of intention (niyyah) before starting prayer',
      'Common mistakes in prayer and how to correct them',
      'The importance of maintaining focus and humility (khushu\') during prayer'
    ],
    actionItems: [
      'Review and correct your own prayer method based on the teachings discussed',
      'Practice proper ablution (wudu) according to the Sunnah',
      'Study the specific rulings of your chosen school of thought',
      'Implement strategies to improve concentration during prayer',
      'Teach family members the correct method of performing Salah'
    ],
    transcript: 'Ustadh Usama Sadiq: Okay, let\'s begin our discussion on the Fiqh of Salah. As-salamu alaykum wa rahmatullahi wa barakatuhu, dear brothers and sisters. Today, we will explore the fundamental aspects of Islamic prayer according to the four schools of thought. Prayer is the second pillar of Islam and the most important act of worship after the testimony of faith. Let us start by discussing the conditions that must be met before prayer...'
  },
  'dummy-session-2': {
    _id: 'dummy-session-2',
    title: 'Tafseer of Surah Al-Kahf',
    name: 'Tafseer of Surah Al-Kahf',
    description: 'Deep dive into the meanings and lessons from Surah Al-Kahf. Learn about the four stories and their relevance to our daily lives.',
    date: getTodayDate(),
    startTime: '20:00',
    endTime: '21:30',
    scholarName: 'Ustadha Aisha Khatun',
    summary: 'The main topic discussed in this session was the Dajjal (the Anti-Christ) and the role of Sayyiduna \'Isa (Jesus, peace be upon him) in defeating him. The speaker referenced a hadith that states 70,000 Jewish people will be with the Dajjal, and that it will be a great challenge to deal with him. However, the speaker emphasized that Sayyiduna \'Isa will ultimately come and, with the help of Allah, kill the Dajjal and save humanity. The session focused on the Islamic teachings and prophecies regarding the Dajjal and the second coming of Sayyiduna \'Isa.',
    keyPoints: [
      'The Dajjal (the Anti-Christ) and his role in the end times',
      'A hadith stating that 70,000 Jewish people will be with the Dajjal',
      'The difficulty in dealing with the Dajjal and his trials',
      'The role of Sayyiduna \'Isa (Jesus, peace be upon him) in defeating the Dajjal',
      'The importance of seeking refuge in Allah and strengthening one\'s faith to withstand the trials of the Dajjal'
    ],
    actionItems: [
      'Seek refuge in Allah from the trials and tribulations of the Dajjal',
      'Study the Islamic teachings and prophecies regarding the Dajjal and the second coming of Sayyiduna \'Isa',
      'Strengthen one\'s faith and connection with Allah to be able to withstand the trials of the Dajjal'
    ],
    transcript: 'Ustadh Usama Sadiq: Okay, let\'s begin our discussion on some important Islamic topics, like the Dajjal (the Anti-Christ). I think the public has been eagerly anticipating this discussion, and now even the Israelis are waiting for it. According to a hadith, 70,000 Jewish people will be with the Dajjal. It will be very difficult to deal with him, but at the end, Sayyiduna \'Isa (Jesus, peace be upon him) will come and, with Allah\'s help, he will kill the Dajjal and save humanity.'
  },
  'dummy-session-3': {
    _id: 'dummy-session-3',
    title: 'Hadith Authentication Methods',
    name: 'Hadith Authentication Methods',
    description: 'Learn how scholars authenticate hadith narrations. Understanding the science of isnad and matn analysis.',
    date: getTodayDate(),
    startTime: '22:00',
    endTime: '23:00',
    scholarName: 'Mufti Ibrahim Hassan',
    summary: 'This comprehensive session explored the rigorous methodology used by Islamic scholars to authenticate hadith narrations. Mufti Ibrahim Hassan explained the dual approach of examining both the chain of narrators (isnad) and the text content (matn). The session covered the classification system of hadith, from Sahih (authentic) to Mawdu\' (fabricated), and the criteria used to evaluate narrator reliability.',
    keyPoints: [
      'The importance of isnad (chain of narration) in hadith authentication',
      'Categories of hadith: Sahih, Hasan, Da\'if, and Mawdu\'',
      'Criteria for evaluating narrator trustworthiness and memory',
      'The science of matn (text) analysis and identifying contradictions',
      'Famous hadith collections and their authentication standards'
    ],
    actionItems: [
      'Study the biographies of major hadith narrators',
      'Learn to identify the authentication level when reading hadith',
      'Consult authentic hadith collections for religious guidance',
      'Understand the context and background of hadith narrations'
    ],
    transcript: 'Bismillah ar-Rahman ar-Rahim. Dear students, today we embark on a journey into the science of hadith authentication, a field that has preserved the teachings of our beloved Prophet ﷺ for over 1400 years. The scholars of hadith developed an unparalleled system of verification...'
  },
  'dummy-session-4': {
    _id: 'dummy-session-4',
    title: 'The Life of Prophet Muhammad ﷺ',
    name: 'The Life of Prophet Muhammad ﷺ',
    description: 'An enlightening journey through the Seerah of our beloved Prophet ﷺ. From his birth to the establishment of the first Muslim community.',
    date: getFutureDate(1),
    startTime: '19:00',
    endTime: '20:30',
    scholarName: 'Sheikh Omar Abdullah',
    summary: 'This session will take participants through the remarkable life of Prophet Muhammad ﷺ, from his birth in Makkah to the establishment of the Islamic state in Madinah. Sheikh Omar will highlight key events, lessons, and the Prophet\'s exemplary character that continues to inspire billions of Muslims worldwide.',
    keyPoints: [
      'The early life of the Prophet ﷺ and his reputation as Al-Amin (the Trustworthy)',
      'The first revelation in the Cave of Hira and the beginning of prophethood',
      'The persecution of early Muslims and the migration to Abyssinia',
      'The Night Journey (Isra and Mi\'raj) and its significance',
      'The Hijrah to Madinah and the establishment of the first Islamic society'
    ],
    actionItems: [
      'Read a biography of the Prophet ﷺ to deepen your understanding',
      'Reflect on how to apply the Prophet\'s character in daily life',
      'Share stories from the Seerah with family and friends',
      'Visit or learn about the historical sites mentioned in the session'
    ],
    transcript: 'As-salamu alaykum wa rahmatullahi wa barakatuhu. Welcome to this blessed gathering where we will explore the life of the best of creation, our beloved Prophet Muhammad ﷺ. His life is a complete guide for humanity, showing us how to live with integrity, compassion, and unwavering faith...'
  },
  'dummy-session-5': {
    _id: 'dummy-session-5',
    title: 'Islamic Parenting Workshop',
    name: 'Islamic Parenting Workshop',
    description: 'Practical guidance on raising children with Islamic values in the modern world. Tips for building strong family bonds.',
    date: getFutureDate(2),
    startTime: '17:00',
    endTime: '18:30',
    scholarName: 'Dr. Maryam Noor',
    summary: 'This workshop will provide practical strategies for raising children with strong Islamic values while navigating the challenges of modern society. Dr. Maryam Noor will discuss age-appropriate Islamic education, building emotional intelligence, and creating a nurturing home environment that fosters both spiritual and personal growth.',
    keyPoints: [
      'Balancing Islamic values with modern educational systems',
      'Teaching children about Allah and developing their relationship with the Quran',
      'Age-appropriate discussions about faith, identity, and contemporary issues',
      'Building emotional resilience and character development',
      'Creating family traditions that strengthen Islamic identity'
    ],
    actionItems: [
      'Establish a daily family routine that includes Quran recitation and prayer',
      'Create opportunities for meaningful conversations with your children',
      'Identify and address challenges your children face in their environment',
      'Connect with other Muslim families for community support',
      'Continuously educate yourself on Islamic parenting principles'
    ],
    transcript: 'Bismillah. Dear parents, raising children in today\'s world presents unique challenges, but also incredible opportunities. Our children are growing up in a time where they have access to knowledge like never before, but also face pressures and influences that can pull them away from their faith...'
  }
};

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
    // USING DUMMY DATA INSTEAD OF API CALL
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get dummy session data
      const dummySession = DUMMY_SESSIONS_DETAILS[sessionId];

      if (dummySession) {
        setSession(dummySession);
      } else {
        setError('Session not found in dummy data');
      }
    } catch (err) {
      setError('An error occurred while fetching session details');
      console.error('Error fetching session:', err);
    } finally {
      setLoading(false);
    }
  };

  // COMMENTED OUT: Original API call implementation
  /*
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
  */

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
