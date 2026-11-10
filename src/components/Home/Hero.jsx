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
        <span className="hero-callout-head">
          <span className="live-dot" aria-hidden="true" />
          <span>{bubble.badge || '#OpenToWork'}</span>
        </span>
        <p>
          {bubble.text}
          {bubble.highlight && (
            <>
              {' '}
              <strong>{bubble.highlight}</strong>
            </>
          )}
        </p>
      </>
    );

    if (link && link.startsWith('http')) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="hero-callout" title={tooltip}>
          {content}
        </a>
      );
    }
    if (link) {
      return (
        <Link to={link} className="hero-callout" title={tooltip}>
          {content}
        </Link>
      );
    }
    return (
      <div className="hero-callout" title={tooltip}>
        {content}
      </div>
    );
  };

  const firstName = profileData.firstName;
  const lastName = profileData.lastName;
  const email = profileData.socials.email || profileData.email;

  const socials = [
    profileData.socials.github && { label: 'GitHub', url: profileData.socials.github, icon: <FaGithub /> },
    profileData.socials.linkedin && { label: 'LinkedIn', url: profileData.socials.linkedin, icon: <FaLinkedin /> },
    profileData.socials.googleScholar && {
      label: 'Google Scholar',
      url: profileData.socials.googleScholar,
      icon: <FaGraduationCap />,
    },
    email && { label: `Email ${email}`, url: `mailto:${email}`, icon: <FaEnvelope />, mail: true },
    profileData.socials.twitter && { label: 'X / Twitter', url: profileData.socials.twitter, icon: <FaXTwitter /> },
  ].filter(Boolean);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Portrait */}
          <div className="hero-figure">
            <div className="hero-photo">
              {!imgError ? (
                <img
                  src={imgSrc}
                  alt={profileData.name}
                  onError={handleImageError}
                  fetchpriority="high"
                  decoding="async"
                />
              ) : (
                <div className="hero-photo-placeholder">{profileData.initials || 'YN'}</div>
              )}
            </div>
          </div>

          {/* Text & CTAs */}
          <div className="hero-text">
            {renderThoughtBubble()}
            <p className="hero-greeting hero-rise" style={{ '--d': '0ms' }}>
              Hello, I'm
            </p>
            <h1 className="hero-name">
              {firstName && lastName ? (
                <>
                  <span className="hero-name-line">
                    <span style={{ '--d': '80ms' }}>{firstName}</span>
                  </span>{' '}
                  <span className="hero-name-line">
                    <span style={{ '--d': '170ms' }}>{lastName}</span>
                  </span>
                </>
              ) : (
                profileData.name
              )}
            </h1>
            <p className="hero-title hero-rise" style={{ '--d': '320ms' }}>
              {profileData.title}
            </p>

            <p className="hero-bio hero-rise" style={{ '--d': '400ms' }}>
              {profileData.shortBio}
            </p>

            <div className="hero-actions hero-rise" style={{ '--d': '480ms' }}>
              <Link to="/research" className="btn btn-solid">
                <FiBookOpen />
                <span>Explore Research</span>
              </Link>
              <Link to="/projects" className="btn btn-line">
                <FiCode />
                <span>Projects</span>
              </Link>
              <Link to="/connect" className="btn btn-line">
                <FiFileText />
                <span>CV & Connect</span>
              </Link>
            </div>

            <div className="hero-socials hero-rise" style={{ '--d': '540ms' }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  {...(s.mail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="icon-btn"
                  aria-label={s.label}
                  title={s.mail ? email : s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <button type="button" className="hero-scroll" onClick={scrollToAbout}>
          <FiArrowDown />
          <span>Scroll to explore</span>
        </button>
      </div>
    </section>
  );
}
