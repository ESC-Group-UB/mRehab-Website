import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="mrehab-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span>mRehab</span>
        </Link>

        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/why-it-matters">Why It Matters</Link>
          <Link to="/enroll">Enroll Now</Link>
          <Link to="/Account">Account</Link>
          <Link to="/Contact">Contact</Link>

          <div className="dropdown">
            <span
              className="dropdown-toggle"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              Technologies ▾
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu" onMouseLeave={() => setIsDropdownOpen(false)}>
                <Link to="/technologies/mobileapp" onClick={() => setIsDropdownOpen(false)}>Mobile App</Link>
                <Link to="/technologies/3dprinting" onClick={() => setIsDropdownOpen(false)}>3D Printing</Link>
                <Link to="/technologies/ai" onClick={() => setIsDropdownOpen(false)}>AI</Link>
              </div>
            )}
          </div>
        </nav>


        <div
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </div>
      </div>
    </header>
  );
};

export default Header;
