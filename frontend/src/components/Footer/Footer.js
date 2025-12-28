import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__section">
            <h4 className="footer__title">CipherSQLStudio</h4>
            <p className="footer__description">
              Interactive SQL learning platform with real-time execution and intelligent hints.
            </p>
          </div>
          
          <div className="footer__section">
            <h4 className="footer__title">Features</h4>
            <ul className="footer__list">
              <li>Interactive SQL Editor</li>
              <li>Sample Data Viewer</li>
              <li>AI-Powered Hints</li>
              <li>Mobile-First Design</li>
            </ul>
          </div>
          
          <div className="footer__section">
            <h4 className="footer__title">Tech Stack</h4>
            <ul className="footer__list">
              <li>React.js + SCSS</li>
              <li>Node.js + Express</li>
              <li>MongoDB + PostgreSQL</li>
              <li>Monaco Editor</li>
            </ul>
          </div>
          
          <div className="footer__section">
            <h4 className="footer__title">Demo Mode</h4>
            <p className="footer__demo-note">
              This demo uses mock data for SQL execution. 
              Perfect for learning SQL concepts without database setup!
            </p>
          </div>
        </div>
        
        <div className="footer__bottom">
          <p className="footer__copyright">
            Built with ❤️ for SQL learning • Mobile-first responsive design
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;