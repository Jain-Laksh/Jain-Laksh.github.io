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

  // Values come from profile.json so they stay in sync with the CV
  const facts = [
    { label: 'Education', value: `B.Tech in ${profileData.department || 'Artificial Intelligence'}` },
    { label: 'Institution', value: `${profileData.institutionShort} (2023 — 2027)` },
    { label: 'Academic Merit', value: `CPI: ${profileData.cpi}` },
    { label: 'College Location', value: profileData.collegeLocation },
    { label: 'Hometown', value: profileData.hometown },
    { label: 'Focus Areas', value: 'Multimodal, Explainability, ML Infra & Edge' },
    { label: 'Beyond Tech', value: 'Chess, Puzzles, Sci-Fi, Gaming' },
  ].filter((f) => f.value);

  return (
    <section id="about" className="section">
      <div className="container">
        <header className="section-head">
          <div>
            <h2>About Me</h2>
            <p className="section-lede">
              An overview of my academic background, technical skills, and research pursuits.
            </p>
          </div>
        </header>

        <div>
          <div className="about-columns">
            {/* Narrative & Tags */}
            <div className="about-body">
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
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
