import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaXTwitter } from 'react-icons/fa6';
import { FiArrowDown, FiBookOpen, FiCode, FiFileText } from 'react-icons/fi';
import profileData from '../../data/profile.json';

export default function Hero() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rawProfileImg = profileData.profileImage || '/images/profile.jpg';
  const initialImg = rawProfileImg.startsWith('http')
    ? rawProfileImg
    : `${baseUrl}/${rawProfileImg.replace(/^\.?\//, '')}`;
  const fallbackSvg = `${baseUrl}/images/profile.svg`;

  const [imgSrc, setImgSrc] = useState(initialImg);
  const [imgError, setImgError] = useState(false);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageError = () => {
    if (imgSrc !== fallbackSvg) {
      setImgSrc(fallbackSvg);
    } else {
      setImgError(true);
    }
  };

  const bubble = profileData.thoughtBubble;
  const isBubbleEnabled = Boolean(bubble && bubble.enabled !== false);

  const renderThoughtBubble = () => {
    if (!isBubbleEnabled) return null;

    const link = bubble.link;
    const tooltip = bubble.tooltip || bubble.text || 'Opportunities';
    const content = (
      <>
        <div className="thought-bubble-header">
          <span className="thought-bubble-dot" />
          <span className="thought-bubble-badge">{bubble.badge || '#OpenToWork'}</span>
        </div>
        <p className="thought-bubble-text">
          {bubble.text}
          {bubble.highlight && (
            <>
              {' '}
              <strong>{bubble.highlight}</strong>
            </>
          )}
        </p>
        <div className="thought-bubble-tail" aria-hidden="true">
          <span className="thought-tail-circle-1" />
          <span className="thought-tail-circle-2" />
        </div>
      </>
    );

    if (link && link.startsWith('http')) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-thought-bubble"
          title={tooltip}
        >
          {content}
        </a>
      );
    }

    if (link) {
      return (
        <Link
          to={link}
          className="hero-thought-bubble"
          title={tooltip}
        >
          {content}
        </Link>
      );
    }

    return (
      <div
        className="hero-thought-bubble"
        style={{ cursor: 'default' }}
        title={tooltip}
      >
        {content}
      </div>
    );
  };

  return (
    <section className="hero">
      <div className="hero-grid">
        {/* Left Column: Text & CTAs */}
        <div className="hero-text">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name">
            <span className="gradient-text">{profileData.name}</span>
          </h1>
          <p className="hero-title">{profileData.title}</p>

          <p className="hero-bio">
            {profileData.shortBio}
          </p>

          <div className="hero-actions">
            <Link to="/research" className="btn btn-primary">
              <FiBookOpen />
              <span>Explore Research</span>
            </Link>
            <Link to="/projects" className="btn btn-outline">
              <FiCode />
              <span>Projects</span>
            </Link>
            <Link to="/connect" className="btn btn-outline">
              <FiFileText />
              <span>CV & Connect</span>
            </Link>
          </div>

          <div className="hero-socials">
            {profileData.socials.github && (
              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="GitHub"
                title="GitHub"
              >
                <FaGithub />
              </a>
            )}
            {profileData.socials.linkedin && (
              <a
                href={profileData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
            )}
            {profileData.socials.googleScholar && (
              <a
                href={profileData.socials.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="Google Scholar"
                title="Google Scholar"
              >
                <FaGraduationCap />
              </a>
            )}
            {profileData.socials.email && (
              <a
                href={`mailto:${profileData.socials.email}`}
                className="hero-social-link"
                aria-label="Email"
                title="Email"
              >
                <FaEnvelope />
              </a>
            )}
            {profileData.socials.twitter && (
              <a
                href={profileData.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="X / Twitter"
                title="X / Twitter"
              >
                <FaXTwitter />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Featured Image with floating thought bubble */}
        <div className="hero-image-wrapper">
          {/* Floating Thought Bubble */}
          {renderThoughtBubble()}

          <div className="hero-avatar-card">
            {!imgError ? (
              <img
                src={imgSrc}
                alt={profileData.name}
                onError={handleImageError}
              />
            ) : (
              <div className="hero-avatar-placeholder">
                {profileData.initials || 'YN'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint" onClick={scrollToAbout} style={{ cursor: 'pointer' }}>
        <span>Scroll to explore</span>
        <FiArrowDown />
      </div>
    </section>
  );
}
