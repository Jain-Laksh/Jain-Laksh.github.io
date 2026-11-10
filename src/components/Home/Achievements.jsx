import React from 'react';
import { FiAward, FiStar, FiCode } from 'react-icons/fi';
import { FaTrophy, FaMedal, FaFire } from 'react-icons/fa';
import achievementsData from '../../data/achievements.json';

export default function Achievements() {
  const getIcon = (type) => {
    switch (type) {
      case 'trophy':
        return <FaTrophy />;
      case 'star':
        return <FiStar />;
      case 'award':
        return <FiAward />;
      case 'medal':
        return <FaMedal />;
      case 'fire':
        return <FaFire />;
      case 'code':
        return <FiCode />;
      default:
        return <FiAward />;
    }
  };

  return (
    <section className="section">
      <div className="container">
        <header className="section-head margin-grid">
          <p className="margin-label">Honors & Recognition</p>
          <div>
            <h2>Achievements</h2>
            <p className="section-lede">Academic honors, competitive milestones, and research recognitions.</p>
          </div>
        </header>

        <div className="margin-grid">
          <div aria-hidden="true" />
          <ul className="honors">
            {achievementsData.map((item) => (
              <li key={item.id} className="honor">
                <span className="honor-icon" aria-hidden="true">
                  {getIcon(item.icon)}
                </span>
                <p className="honor-text">{item.title}</p>
                <span className="honor-year">{item.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
