import React from 'react';
import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import profileData from '../../data/profile.json';

export default function Footer() {
  const socials = [
    { name: 'GitHub', icon: <FaGithub />, url: profileData.socials.github },
    { name: 'LinkedIn', icon: <FaLinkedin />, url: profileData.socials.linkedin },
    { name: 'Scholar', icon: <FaGraduationCap />, url: profileData.socials.googleScholar },
    { name: 'Email', icon: <FaEnvelope />, url: `mailto:${profileData.socials.email}` },
    { name: 'Instagram', icon: <FaInstagram />, url: profileData.socials.instagram },
    { name: 'X / Twitter', icon: <FaXTwitter />, url: profileData.socials.twitter },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-socials">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label={s.name}
              title={s.name}
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {profileData.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
