import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiImage } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import profileData from '../../data/profile.json';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Research', path: '/research' },
    { name: 'Projects', path: '/projects' },
    { name: 'Work Experience', path: '/work' },
    { name: 'Posts', path: '/blog' },
    { name: 'Connect/CV', path: '/connect' },
  ];

  const isMoreActive = location.pathname.startsWith('/gallery');

  return (
    <nav className={`nav ${scrolled || mobileMenuOpen ? 'is-scrolled' : ''}`} aria-label="Main">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-mark" aria-hidden="true">
            {profileData.initials || 'YN'}
          </span>
          <span>{profileData.name}</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.path === '/'}
            >
              {link.name}
            </NavLink>
          ))}

          {/* More Dropdown */}
          <div className="nav-more">
            <button
              type="button"
              className={`nav-link ${isMoreActive ? 'active' : ''}`}
              aria-haspopup="true"
            >
              <span>More</span>
              <FiChevronDown className="nav-chevron" aria-hidden="true" />
            </button>
            <div className="nav-more-menu">
              <NavLink
                to="/gallery"
                className={({ isActive }) => `nav-more-item ${isActive ? 'active' : ''}`}
              >
                <FiImage aria-hidden="true" />
                <span>Gallery</span>
                <span className="wip-badge">WIP</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="nav-controls">
          <button
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-btn menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
            end={link.path === '/'}
          >
            {link.name}
          </NavLink>
        ))}

        <p className="mobile-group-label">More</p>
        <NavLink
          to="/gallery"
          className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
        >
          <FiImage aria-hidden="true" />
          <span>Gallery</span>
          <span className="wip-badge">WIP</span>
        </NavLink>
      </div>
    </nav>
  );
}
