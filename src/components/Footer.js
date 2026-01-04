import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
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
                {/* Keeping your existing logo */}
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
              <a href="https://youtube.com/@islamicsphere-v2l?si=vrxQRntcmxMWvTb0" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="YouTube">
                <div className="social-icon-wrapper">
                  <FaYoutube />
                </div>
              </a>
              <a href="https://www.facebook.com/share/19ghWF2Tbz/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                <div className="social-icon-wrapper">
                  <FaFacebook />
                </div>
              </a>
              <a href="https://www.instagram.com/islamicsphereorg?utm_source=qr&igsh=aWx5MnFqOTMzbGl2" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                <div className="social-icon-wrapper">
                  <FaInstagram />
                </div>
              </a>
              <a href="https://www.tiktok.com/@islamic.sphere?_t=ZS-8zT80aObvxF&_r=1" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="TikTok">
                <div className="social-icon-wrapper">
                  <FaTiktok />
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
  );
};

export default Footer;