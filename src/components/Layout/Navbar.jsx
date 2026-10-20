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
    window.addEventListener('scroll', handleScroll);
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
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            {profileData.initials || 'YN'}
          </div>
          <span>{profileData.name}</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              end={link.path === '/'}
            >
              {link.name}
            </NavLink>
          ))}

          {/* More Dropdown */}
          <div className="navbar-item-dropdown">
            <button
              type="button"
              className={`navbar-link navbar-dropdown-trigger ${isMoreActive ? 'active' : ''}`}
            >
              <span>More</span>
              <FiChevronDown className="dropdown-arrow" />
            </button>
            <div className="navbar-dropdown-menu">
              <NavLink to="/gallery" className="navbar-dropdown-link">
                <FiImage style={{ color: 'var(--primary)', fontSize: '15px' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
                  <span>Gallery</span>
                  <span className="tag" style={{ fontSize: '10px', padding: '1px 6px', background: 'var(--tag-orange-bg)', color: 'var(--tag-orange-text)' }}>
                    WIP
                  </span>
                </div>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="navbar-right">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `navbar-mobile-link ${isActive ? 'active' : ''}`
            }
            end={link.path === '/'}
          >
            {link.name}
          </NavLink>
        ))}

        <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
          <div style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            More
          </div>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `navbar-mobile-link ${isActive ? 'active' : ''}`
            }
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiImage style={{ color: 'var(--primary)' }} />
            <span>Gallery</span>
            <span className="tag" style={{ fontSize: '10px', padding: '1px 6px', background: 'var(--tag-orange-bg)', color: 'var(--tag-orange-text)', marginLeft: 'auto' }}>
              WIP
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
