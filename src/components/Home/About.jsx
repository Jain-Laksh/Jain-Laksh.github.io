import React from 'react';
import { FiBookOpen, FiMapPin, FiAward, FiCheckCircle } from 'react-icons/fi';
import profileData from '../../data/profile.json';

function formatBioText(text) {
  if (typeof text !== 'string') return text;
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return (
        <em key={i} style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: 500 }}>
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}

export default function About() {
  const tags = [
    'Multimodal Learning',
    'Model Explainability',
    'ML Infrastructure',
    'Fine-Tuning (LoRA / QLoRA)',
    'Low-Latency Inference',
    'Python',
    'C++',
    'C',
    'SQL',
    'PyTorch',
    'Azure',
    'FastAPI',
    'Chess & Puzzles',
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Background</span>
          <h2>About Me</h2>
          <p className="section-subtitle">
            An overview of my academic background, technical skills, and research pursuits.
          </p>
        </div>

        <div className="about">
          {/* Left Column: Quick Facts Card */}
          <div className="card about-facts-card">
            <h4 style={{ fontSize: 'var(--fs-md)', marginBottom: 'var(--space-4)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheckCircle />
              <span>Quick Facts</span>
            </h4>

            <div className="about-fact-item">
              <div className="about-fact-label">Education</div>
              <div className="about-fact-value">
                B.Tech in Artificial Intelligence
              </div>
            </div>

            <div className="about-fact-item">
              <div className="about-fact-label">Institution</div>
              <div className="about-fact-value">
                IIT Gandhinagar (2023 — 2027)
              </div>
            </div>

            <div className="about-fact-item">
              <div className="about-fact-label">Academic Merit</div>
              <div className="about-fact-value">
                CPI: 9.05 / 10.0
              </div>
            </div>

            <div className="about-fact-item">
              <div className="about-fact-label">College Location</div>
              <div className="about-fact-value">
                <FiMapPin style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--primary)' }} />
                Gandhinagar, Gujarat, India
              </div>
            </div>

            <div className="about-fact-item">
              <div className="about-fact-label">Hometown</div>
              <div className="about-fact-value">
                <FiMapPin style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--accent)' }} />
                Bengaluru, Karnataka, India
              </div>
            </div>

            <div className="about-fact-item">
              <div className="about-fact-label">Focus Areas</div>
              <div className="about-fact-value">
                Multimodal, Explainability, ML Infra & Edge
              </div>
            </div>

            <div className="about-fact-item">
              <div className="about-fact-label">Beyond Tech</div>
              <div className="about-fact-value">
                Chess, Puzzles, Sci-Fi, Gaming
              </div>
            </div>

            <div className="about-fact-item">
              <div className="about-fact-label">Status</div>
              <div className="about-fact-value" style={{ color: '#2BA88E', fontWeight: 600 }}>
                ● {profileData.status || 'Upcoming SDE @ Eternal'}
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Tags */}
          <div className="about-text">
            <h3>
              Building at the Intersection of{' '}
              <span className="gradient-text">Multimodal AI & High-Performance Systems</span>
            </h3>
            {Array.isArray(profileData.bio) ? (
              profileData.bio.map((paragraph, idx) => (
                <p key={idx}>{formatBioText(paragraph)}</p>
              ))
            ) : (
              <p>{formatBioText(profileData.bio)}</p>
            )}

            <div className="about-tags">
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
