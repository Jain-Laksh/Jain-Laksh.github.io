import React from 'react';
import profileData from '../../data/profile.json';

function formatBioText(text) {
  if (typeof text !== 'string') return text;
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={i}>{token.slice(1, -1)}</em>;
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

  const facts = [
    { label: 'Education', value: 'B.Tech in Artificial Intelligence' },
    { label: 'Institution', value: 'IIT Gandhinagar (2023 — 2027)' },
    { label: 'Academic Merit', value: 'CPI: 9.05 / 10.0' },
    { label: 'College Location', value: 'Gandhinagar, Gujarat, India' },
    { label: 'Hometown', value: 'Bengaluru, Karnataka, India' },
    { label: 'Focus Areas', value: 'Multimodal, Explainability, ML Infra & Edge' },
    { label: 'Beyond Tech', value: 'Chess, Puzzles, Sci-Fi, Gaming' },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <header className="section-head margin-grid">
          <p className="margin-label">Background</p>
          <div>
            <h2>About Me</h2>
            <p className="section-lede">
              An overview of my academic background, technical skills, and research pursuits.
            </p>
          </div>
        </header>

        <div className="about-grid">
          <div aria-hidden="true" />
          <div className="about-columns">
            {/* Narrative & Tags */}
            <div className="about-body">
              <h3>Building at the Intersection of Multimodal AI & High-Performance Systems</h3>
              {Array.isArray(profileData.bio) ? (
                profileData.bio.map((paragraph, idx) => <p key={idx}>{formatBioText(paragraph)}</p>)
              ) : (
                <p>{formatBioText(profileData.bio)}</p>
              )}

              <ul className="chip-list skill-list" aria-label="Skills and interests">
                {tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Facts */}
            <dl className="facts" aria-label="Quick Facts">
              {facts.map((f) => (
                <div key={f.label} className="fact">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
              <div className="fact">
                <dt>Status</dt>
                <dd>
                  <span className="fact-status">{profileData.status || 'Upcoming SDE @ Eternal'}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
