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
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Honors & Recognition</span>
          <h2>Achievements</h2>
          <p className="section-subtitle">
            Academic honors, competitive milestones, and research recognitions.
          </p>
        </div>

        <div className="achievements-grid">
          {achievementsData.map((item) => (
            <div key={item.id} className="achievement-item">
              <div className={`achievement-icon ${item.icon}`}>
                {getIcon(item.icon)}
              </div>
              <div>
                <p className="achievement-text">{item.title}</p>
                <p className="achievement-year">{item.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
