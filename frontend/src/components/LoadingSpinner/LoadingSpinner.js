import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className={`loading-spinner__spinner loading-spinner__spinner--${size}`}></div>
      <p className="loading-spinner__message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;