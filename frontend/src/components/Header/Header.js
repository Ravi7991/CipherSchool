import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <h1 className="header__title">CipherSQLStudio</h1>
        </Link>
        
        {!isHomePage && (
          <nav className="header__nav">
            <Link to="/" className="header__nav-link">
              ← Back to Assignments
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;