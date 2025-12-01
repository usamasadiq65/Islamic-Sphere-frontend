import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaYoutube, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Left: Brand */}
        <div className="footer-brand-section">
          <div className="footer-brand">
            <div className="footer-logo-icon-wrapper">
              <svg className="footer-logo-svg" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" stroke="url(#footerGoldGradient)" strokeWidth="1.5" fill="none"/>
                <defs>
                  <linearGradient id="footerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8e16c"/>
                    <stop offset="50%" stopColor="#d4af37"/>
                    <stop offset="100%" stopColor="#f8e16c"/>
                  </linearGradient>
                </defs>
                <path d="M24 10c-5.5 0-10 4.5-10 10s4.5 10 10 10c1.5 0 3-.3 4.3-.9-1.8 1.2-4 1.9-6.3 1.9-6.1 0-11-4.9-11-11s4.9-11 11-11c2.3 0 4.5.7 6.3 1.9-1.3-.6-2.8-.9-4.3-.9z" fill="url(#footerGoldGradient)"/>
                <polygon points="30,12 31,15 34,15 31.5,17 32.5,20 30,18 27.5,20 28.5,17 26,15 29,15" fill="url(#footerGoldGradient)"/>
              </svg>
            </div>
            <span className="logos-text">Islamic Sphere</span>
          </div>
          <p className="footer-description">Illuminating your spiritual journey</p>
        </div>
        
        {/* Center: Social Icons */}
        <div className="footer-social">
          <h4 className="social-title">Follow Us</h4>
          <div className="social-icons">
            <a href="https://youtube.com/@islamicsphere-v2l?si=vrxQRntcmxMWvTb0" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://www.facebook.com/share/19ghWF2Tbz/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/islamicsphereorg?utm_source=qr&igsh=aWx5MnFqOTMzbGl2" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@islamic.sphere?_t=ZS-8zT80aObvxF&_r=1" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>
        
        {/* Right: Navigation Links */}
        <div className="footer-links-container">
          <nav className="footer-nav">
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/learn-more" className="footer-link">Learn More</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </nav>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Islamic Sphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;