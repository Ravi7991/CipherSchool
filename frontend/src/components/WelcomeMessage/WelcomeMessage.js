import React, { useState } from 'react';
import './WelcomeMessage.scss';

const WelcomeMessage = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="welcome-message">
      <div className="welcome-message__container">
        <button 
          className="welcome-message__close"
          onClick={() => setIsVisible(false)}
          aria-label="Close welcome message"
        >
          ×
        </button>
        
        <div className="welcome-message__content">
          <h3 className="welcome-message__title">
            🎉 Welcome to CipherSQLStudio!
          </h3>
          
          <p className="welcome-message__description">
            Practice your SQL skills with interactive assignments. Each assignment includes sample data, 
            an intelligent hint system, and real-time query execution.
          </p>
          
          <div className="welcome-message__features">
            <div className="feature">
              <span className="feature__icon">📊</span>
              <span className="feature__text">Interactive sample data viewer</span>
            </div>
            <div className="feature">
              <span className="feature__icon">💡</span>
              <span className="feature__text">AI-powered hints (not solutions!)</span>
            </div>
            <div className="feature">
              <span className="feature__icon">⚡</span>
              <span className="feature__text">Real-time query execution</span>
            </div>
            <div className="feature">
              <span className="feature__icon">📱</span>
              <span className="feature__text">Mobile-friendly responsive design</span>
            </div>
          </div>
          
          <div className="welcome-message__demo-note">
            <p>
              <strong>Demo Mode:</strong> This demo uses mock data for SQL execution. 
              Try queries like <code>SELECT * FROM employees WHERE salary > 60000</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;