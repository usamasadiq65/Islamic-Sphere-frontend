import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {
  FaBrain,
  FaCalendarAlt,
  FaUserFriends,
  FaQuestionCircle,
  FaHeartbeat,
  FaComments
} from "react-icons/fa";

import Navbar from "../components/Navbar"; // Import the Navbar component
import "./Home.css"; // Optional, if you have custom styles

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Add the Navbar here */}
      <Navbar />

      {/* Hero Section for Authenticated Users */}
      {isAuthenticated && (
        <section className="auth-hero-section">
          <div className="auth-particles"></div>
          <div className="auth-stars">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`auth-star star-${i + 1}`}></div>
            ))}
          </div>
          <div className="auth-overlay"></div>
          <div className="auth-mosque-silhouette"></div>
          <div className="container auth-container">
            <div className="auth-content">
              <div className="auth-decorative-element left">
                <div className="auth-decorative-circle"></div>
                <div className="auth-decorative-icon"></div>
              </div>
              <div className="auth-text-container">
                <div className="auth-badge">Welcome to Islamic Sphere</div>
                <h2 className="auth-heading">
                  Continue Your <span className="highlight">Journey</span> of Knowledge
                  <div className="heading-ornament">
                    <span></span><span></span><span></span>
                  </div>
                </h2>
                <p className="auth-description">Explore our features and enhance your spiritual growth with our supportive Islamic community</p>
                <div className="auth-features">
                  <div className="auth-feature">
                    <i className="fas fa-compass"></i>
                    <span>Your Learning Path</span>
                  </div>
                  <div className="auth-feature">
                    <i className="fas fa-heart"></i>
                    <span>Personal Growth</span>
                  </div>
                  <div className="auth-feature">
                    <i className="fas fa-hands-helping"></i>
                    <span>Community Support</span>
                  </div>
                </div>
                <div className="auth-buttons">
                  <Link to="/learning-path" className="auth-primary-button">
                    <div className="button-background"></div>
                    <span className="button-text">Continue Learning</span>
                    <span className="button-icon"><i className="fas fa-graduation-cap"></i></span>
                  </Link>
                  <Link to="/profile" className="auth-secondary-button">
                    <div className="button-background"></div>
                    <span className="button-text">My Profile</span>
                    <span className="button-icon"><i className="fas fa-user"></i></span>
                  </Link>
                </div>
              </div>
              <div className="auth-decorative-element right">
                <div className="auth-decorative-circle"></div>
                <div className="auth-decorative-icon"></div>
              </div>
            </div>
          </div>
          <div className="auth-floating-elements">
            <div className="floating-element elem1"><i className="fas fa-moon"></i></div>
            <div className="floating-element elem2"><i className="fas fa-sun"></i></div>
            <div className="floating-element elem3"><i className="fas fa-star"></i></div>
            <div className="floating-element elem4"><i className="fas fa-heart"></i></div>
          </div>
        </section>
      )}

      {/* Call to Action for Unauthenticated Users */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-particles"></div>
          <div className="cta-stars">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`star star-${i + 1}`}></div>
            ))}
          </div>
          <div className="cta-overlay"></div>
          <div className="cta-mosque-silhouette"></div>
          <div className="container cta-container">
            <div className="cta-content">
              <div className="cta-decorative-element left">
                <div className="decorative-circle"></div>
                <div className="decorative-icon"></div>
              </div>
              <div className="cta-text-container">
                <div className="cta-badge">Islamic Community</div>
                <h2 className="cta-heading">
                  Begin Your <span className="highlight">Journey</span> Today
                  <div className="heading-ornament">
                    <span></span><span></span><span></span>
                  </div>
                </h2>
                <p className="cta-description">Join our growing community of believers seeking knowledge and connection in a supportive Islamic environment</p>
                <div className="cta-features">
                  <div className="cta-feature">
                    <i className="fas fa-book-reader"></i>
                    <span>Islamic Learning</span>
                  </div>
                  <div className="cta-feature">
                    <i className="fas fa-users"></i>
                    <span>Community Support</span>
                  </div>
                  <div className="cta-feature">
                    <i className="fas fa-mosque"></i>
                    <span>Spiritual Growth</span>
                  </div>
                </div>
                <div className="cta-buttons">
                  <Link to="/signup" className="primary-button">
                    <div className="button-background"></div>
                    <span className="button-text">Get Started</span>
                    <span className="button-icon"><i className="fas fa-arrow-right"></i></span>
                  </Link>
                  <Link to="/about" className="secondary-button">
                    <div className="button-background"></div>
                    <span className="button-text">Learn More</span>
                    <span className="button-icon"><i className="fas fa-info-circle"></i></span>
                  </Link>
                </div>
              </div>
              <div className="cta-decorative-element right">
                <div className="decorative-circle"></div>
                <div className="decorative-icon"></div>
              </div>
            </div>
          </div>
          <div className="cta-floating-elements">
            <div className="floating-element elem1"><i className="fas fa-star-and-crescent"></i></div>
            <div className="floating-element elem2"><i className="fas fa-kaaba"></i></div>
            <div className="floating-element elem3"><i className="fas fa-pray"></i></div>
            <div className="floating-element elem4"><i className="fas fa-quran"></i></div>
          </div>
        </section>
      )}

      {/* Gorgeous Features Grid */}
      <section className="features-section">
        <div className="section-background">
          <div className="bg-pattern"></div>
          <div className="bg-glow"></div>
        </div>

        <div className="container">
          <div className="section-header">
            <div className="title-decoration">
              <span className="decoration-line"></span>
              <span className="decoration-icon"><i className="fas fa-gem"></i></span>
              <span className="decoration-line"></span>
            </div>
            <h2 className="section-title">Our <span>Premium</span> Features</h2>
            <p className="section-subtitle">Discover the tools that will elevate your spiritual journey</p>
          </div>

          <div className="features-grid">
            {/* EmoVerse Card */}
            <div className="feature-card-wrapper">
              <div className="feature-card">
                <div className="card-inner">
                  <div className="card-front">
                    <div className="feature-icon-container">
                      <div className="icon-background"></div>
                      <div className="icon-wrapper">
                        <FaHeartbeat className="feature-icon" />
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h3 className="feature-title">EmoVerse</h3>
                    <div className="feature-badge">Popular</div>
                  </div>
                  <div className="card-back">
                    <p className="feature-description">Track your emotional and spiritual well-being with our innovative aura scanning technology</p>
                    <button className="feature-btn">Learn More</button>
                  </div>
                </div>
                <div className="card-decorations">
                  <div className="decoration-element top-left"></div>
                  <div className="decoration-element top-right"></div>
                  <div className="decoration-element bottom-left"></div>
                  <div className="decoration-element bottom-right"></div>
                </div>
              </div>
            </div>

            {/* Faith Route Card */}
            <div className="feature-card-wrapper">
              <div className="feature-card">
                <div className="card-inner">
                  <div className="card-front">
                    <div className="feature-icon-container">
                      <div className="icon-background"></div>
                      <div className="icon-wrapper">
                        <FaBrain className="feature-icon" />
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h3 className="feature-title">Faith Route</h3>
                    <div className="feature-badge">Exclusive</div>
                  </div>
                  <div className="card-back">
                    <p className="feature-description">Follow a customized Islamic learning journey tailored to your knowledge and interests</p>
                    <button className="feature-btn">Learn More</button>
                  </div>
                </div>
                <div className="card-decorations">
                  <div className="decoration-element top-left"></div>
                  <div className="decoration-element top-right"></div>
                  <div className="decoration-element bottom-left"></div>
                  <div className="decoration-element bottom-right"></div>
                </div>
              </div>
            </div>

            {/* Faith Circles Card */}
            <div className="feature-card-wrapper">
              <div className="feature-card">
                <div className="card-inner">
                  <div className="card-front">
                    <div className="feature-icon-container">
                      <div className="icon-background"></div>
                      <div className="icon-wrapper">
                        <FaUserFriends className="feature-icon" />
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h3 className="feature-title">Faith Circles</h3>
                    <div className="feature-badge">Community</div>
                  </div>
                  <div className="card-back">
                    <p className="feature-description">Connect with like-minded individuals in study circles and discussion groups</p>
                    <button className="feature-btn">Learn More</button>
                  </div>
                </div>
                <div className="card-decorations">
                  <div className="decoration-element top-left"></div>
                  <div className="decoration-element top-right"></div>
                  <div className="decoration-element bottom-left"></div>
                  <div className="decoration-element bottom-right"></div>
                </div>
              </div>
            </div>

            {/* Event Calendar Card */}
            <div className="feature-card-wrapper">
              <div className="feature-card">
                <div className="card-inner">
                  <div className="card-front">
                    <div className="feature-icon-container">
                      <div className="icon-background"></div>
                      <div className="icon-wrapper">
                        <FaCalendarAlt className="feature-icon" />
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h3 className="feature-title">Events</h3>
                    <div className="feature-badge">Updated</div>
                  </div>
                  <div className="card-back">
                    <p className="feature-description">Stay updated with community events, prayer times, and Islamic occasions</p>
                    <button className="feature-btn">Learn More</button>
                  </div>
                </div>
                <div className="card-decorations">
                  <div className="decoration-element top-left"></div>
                  <div className="decoration-element top-right"></div>
                  <div className="decoration-element bottom-left"></div>
                  <div className="decoration-element bottom-right"></div>
                </div>
              </div>
            </div>

            {/* Q&A Card */}
            <div className="feature-card-wrapper">
              <div className="feature-card">
                <div className="card-inner">
                  <div className="card-front">
                    <div className="feature-icon-container">
                      <div className="icon-background"></div>
                      <div className="icon-wrapper">
                        <FaQuestionCircle className="feature-icon" />
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h3 className="feature-title">Q&A</h3>
                    <div className="feature-badge">Expert</div>
                  </div>
                  <div className="card-back">
                    <p className="feature-description">Get authentic answers to your questions from qualified Islamic scholars</p>
                    <button className="feature-btn">Learn More</button>
                  </div>
                </div>
                <div className="card-decorations">
                  <div className="decoration-element top-left"></div>
                  <div className="decoration-element top-right"></div>
                  <div className="decoration-element bottom-left"></div>
                  <div className="decoration-element bottom-right"></div>
                </div>
              </div>
            </div>

            {/* Chat Card */}
            <div className="feature-card-wrapper">
              <div className="feature-card">
                <div className="card-inner">
                  <div className="card-front">
                    <div className="feature-icon-container">
                      <div className="icon-background"></div>
                      <div className="icon-wrapper">
                        <FaComments className="feature-icon" />
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h3 className="feature-title">Chat</h3>
                    <div className="feature-badge">New</div>
                  </div>
                  <div className="card-back">
                    <p className="feature-description">Connect with fellow community members through real-time chat and discussions</p>
                    <button className="feature-btn">Learn More</button>
                  </div>
                </div>
                <div className="card-decorations">
                  <div className="decoration-element top-left"></div>
                  <div className="decoration-element top-right"></div>
                  <div className="decoration-element bottom-left"></div>
                  <div className="decoration-element bottom-right"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Section */}
      <section className="stats-section">
        <div className="stats-background">
          <div className="stats-pattern"></div>
        </div>
        <div className="container">
          <div className="stats-header">
            <h2 className="stats-title">Platform <span>Capabilities</span></h2>
            <p className="stats-subtitle">Discover the powerful features that make Islamic Sphere unique</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-video"></i>
              </div>
              <div className="stat-number"><i className="fas fa-broadcast-tower"></i></div>
              <div className="stat-label">Live Q&A Sessions</div>
              <div className="stat-description">Join live sessions with scholars via Google Meet with real-time interaction</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="stat-number"><i className="fas fa-brain"></i></div>
              <div className="stat-label">AI Meeting Insights</div>
              <div className="stat-description">Auto-generated transcripts, summaries, key points & action items using OpenAI</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-number"><i className="fas fa-users"></i></div>
              <div className="stat-label">Faith Circles</div>
              <div className="stat-description">Create study groups with tasks, polls, and real-time group chat</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="stat-number"><i className="fas fa-chart-line"></i></div>
              <div className="stat-label">Spiritual Tracking</div>
              <div className="stat-description">Track your emotional & spiritual well-being with EmoVerse analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Islamic Sphere Section */}
      <section className="why-section">
        <div className="container">
          <div className="why-header">
            <div className="why-badge">Why Choose Us</div>
            <h2 className="why-title">Why <span>Islamic Sphere</span> Stands Out</h2>
            <p className="why-subtitle">We address the common challenges Muslims face in their spiritual journey</p>
          </div>

          <div className="why-grid">
            <div className="why-card problem">
              <div className="why-card-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <h3>The Challenge</h3>
              <p>Fragmented resources, unreliable information, and lack of qualified guidance make it difficult for Muslims to find authentic Islamic knowledge and community support.</p>
            </div>
            <div className="why-card solution">
              <div className="why-card-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Our Solution</h3>
              <p>A unified platform with verified scholars, personalized learning paths, and a supportive community - all in one place to nurture your faith journey.</p>
            </div>
          </div>

          <div className="why-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="benefit-content">
                <h4>Verified Scholars</h4>
                <p>All our scholars are certified with authentic Islamic credentials</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-route"></i>
              </div>
              <div className="benefit-content">
                <h4>Personalized Learning</h4>
                <p>Customized paths based on your knowledge level and interests</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="benefit-content">
                <h4>Flexible Schedule</h4>
                <p>Learn at your own pace with on-demand and live content</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <div className="benefit-content">
                <h4>Community Support</h4>
                <p>Connect with like-minded Muslims from around the world</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="how-header">
            <h2 className="how-title">How It <span>Works</span></h2>
            <p className="how-subtitle">Start your spiritual journey in three simple steps</p>
          </div>

          <div className="how-steps">
            <div className="how-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <div className="step-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <h3>Create Your Account</h3>
                <p>Sign up for free and create your personal profile to start your journey</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="how-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <div className="step-icon">
                  <i className="fas fa-compass"></i>
                </div>
                <h3>Explore Features</h3>
                <p>Discover Faith Route, join Faith Circles, and connect with scholars</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="how-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <div className="step-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Grow Spiritually</h3>
                <p>Track your progress, attend live sessions, and strengthen your faith</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-background">
          <div className="testimonials-pattern"></div>
        </div>
        <div className="container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">What Our <span>Community</span> Says</h2>
            <p className="testimonials-subtitle">Hear from Muslims who have transformed their spiritual journey with us</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="testimonial-text">Islamic Sphere has transformed my learning. The Faith Route feature keeps me motivated daily!</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Ahmed Hassan</h4>
                  <span>Member since 2024</span>
                </div>
              </div>
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>

            <div className="testimonial-card featured">
              <div className="testimonial-quote">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="testimonial-text">The Q&A sessions helped me understand topics I've struggled with for years. Amazing community!</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Fatima Al-Zahra</h4>
                  <span>Member since 2023</span>
                </div>
              </div>
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="testimonial-text">As a busy professional, the flexibility is incredible. EmoVerse perfectly tracks my spiritual well-being.</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Omar Malik</h4>
                  <span>Member since 2024</span>
                </div>
              </div>
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Recall Integration Section */}
      <section className="faq-section recall-section">
        <div className="container">
          <div className="faq-header">
            <h2 className="faq-title">AI-Powered <span>Meeting Intelligence</span></h2>
            <p className="faq-subtitle">Experience seamless session recording and AI-generated insights with Recall AI & OpenAI integration</p>
          </div>

          <div className="recall-flow">
            <div className="recall-step">
              <div className="recall-step-icon">
                <i className="fas fa-video"></i>
              </div>
              <div className="recall-step-content">
                <h3>1. Join Live Session</h3>
                <p>Connect to scholar-led Q&A sessions via Google Meet. Our AI bot automatically joins to assist.</p>
              </div>
            </div>

            <div className="recall-connector">
              <i className="fas fa-long-arrow-alt-right"></i>
            </div>

            <div className="recall-step">
              <div className="recall-step-icon">
                <i className="fas fa-microphone-alt"></i>
              </div>
              <div className="recall-step-content">
                <h3>2. Audio Recording</h3>
                <p>Recall AI records the entire session audio, capturing every word from scholars and participants.</p>
              </div>
            </div>

            <div className="recall-connector">
              <i className="fas fa-long-arrow-alt-right"></i>
            </div>

            <div className="recall-step">
              <div className="recall-step-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="recall-step-content">
                <h3>3. Transcript Generation</h3>
                <p>Audio is converted to accurate text transcripts, preserving the complete discussion for reference.</p>
              </div>
            </div>

            <div className="recall-connector">
              <i className="fas fa-long-arrow-alt-right"></i>
            </div>

            <div className="recall-step">
              <div className="recall-step-icon">
                <i className="fas fa-brain"></i>
              </div>
              <div className="recall-step-content">
                <h3>4. AI Insights</h3>
                <p>OpenAI analyzes transcripts to generate summaries, key points, and action items automatically.</p>
              </div>
            </div>
          </div>

          <div className="recall-features">
            <div className="recall-feature-card">
              <div className="recall-feature-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h4>Meeting Summary</h4>
              <p>Get a concise overview of the entire session, highlighting main topics discussed and conclusions reached.</p>
            </div>
            <div className="recall-feature-card">
              <div className="recall-feature-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h4>Key Points</h4>
              <p>AI extracts the most important insights and learnings from the session for quick review.</p>
            </div>
            <div className="recall-feature-card">
              <div className="recall-feature-icon">
                <i className="fas fa-tasks"></i>
              </div>
              <h4>Action Items</h4>
              <p>Automatically identified follow-up tasks and recommendations based on session content.</p>
            </div>
            <div className="recall-feature-card">
              <div className="recall-feature-icon">
                <i className="fas fa-scroll"></i>
              </div>
              <h4>Full Transcript</h4>
              <p>Complete searchable transcript of the session for detailed study and reference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-background">
          <div className="cta-pattern"></div>
          <div className="cta-glow"></div>
        </div>
        <div className="container">
          <div className="final-cta-content">
            <h2>Ready to Begin Your <span>Spiritual Journey</span>?</h2>
            <p>Start your journey today with AI-powered learning and authentic Islamic guidance</p>
            <div className="final-cta-buttons">
              <Link to="/signup" className="cta-primary-btn">
                <span>Get Started Free</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/about" className="cta-secondary-btn">
                <span>Learn More</span>
                <i className="fas fa-info-circle"></i>
              </Link>
            </div>
            <div className="cta-trust-badges">
              <div className="trust-badge">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Platform</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-check-circle"></i>
                <span>Verified Scholars</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-globe"></i>
                <span>Global Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="amazing-footer">
        <div className="footer-waves">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>

        <div className="footer-content-wrapper">
          <div className="footer-mosque-silhouette"></div>

          <div className="container">
            <div className="footer-top">
              <div className="footer-branding">
                <div className="footer-logo-container">
                  <div className="footer-brand">
                    <div className="footer-logo-icon-wrapper">
                      <svg className="footer-logo-svg" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="19" stroke="url(#footerGoldGradient)" strokeWidth="1.5" fill="none" />
                        <defs>
                          <linearGradient id="footerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f8e16c" />
                            <stop offset="50%" stopColor="#d4af37" />
                            <stop offset="100%" stopColor="#f8e16c" />
                          </linearGradient>
                        </defs>
                        <path d="M24 10c-5.5 0-10 4.5-10 10s4.5 10 10 10c1.5 0 3-.3 4.3-.9-1.8 1.2-4 1.9-6.3 1.9-6.1 0-11-4.9-11-11s4.9-11 11-11c2.3 0 4.5.7 6.3 1.9-1.3-.6-2.8-.9-4.3-.9z" fill="url(#footerGoldGradient)" />
                        <polygon points="30,12 31,15 34,15 31.5,17 32.5,20 30,18 27.5,20 28.5,17 26,15 29,15" fill="url(#footerGoldGradient)" />
                      </svg>
                    </div>
                    <h2 className="footer-logo-text">Islamic<span>Sphere</span></h2>
                  </div>

                </div>
                <p className="footer-slogan">Illuminating Your Spiritual Journey</p>
              </div>

              <div className="footer-nav-container">
                <div className="footer-nav-column">
                  <h3>Explore</h3>
                  <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/features">Features</Link></li>
                  </ul>
                </div>

                <div className="footer-nav-column">
                  <h3>Connect</h3>
                  <ul>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/support">Support</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer-divider-fancy">
              <div className="divider-line"></div>
              <div className="divider-emblem"><i className="fas fa-star-and-crescent"></i></div>
              <div className="divider-line"></div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">&copy; {new Date().getFullYear()} Islamic Sphere. All rights reserved.</p>

              <div className="footer-social">
                <a href="#" className="social-btn" aria-label="Facebook">
                  <div className="social-icon-wrapper">
                    <i className="fab fa-facebook-f"></i>
                  </div>
                </a>
                <a href="#" className="social-btn" aria-label="Twitter">
                  <div className="social-icon-wrapper">
                    <i className="fab fa-twitter"></i>
                  </div>
                </a>
                <a href="#" className="social-btn" aria-label="Instagram">
                  <div className="social-icon-wrapper">
                    <i className="fab fa-instagram"></i>
                  </div>
                </a>
                <a href="#" className="social-btn" aria-label="YouTube">
                  <div className="social-icon-wrapper">
                    <i className="fab fa-youtube"></i>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-stars">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`footer-star star-${i + 1}`}></div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Home;
