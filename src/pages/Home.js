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

      {/* Amazing Footer */}
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
