import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import workData from '../../data/workExperience.json';

export default function WorkSummary() {
  // Kabal Research is kept only in the dedicated Work Experience tab
  const displayWork = workData.filter((item) => item.id !== 'kabal-research-2024');
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-label">Experience</span>
            <h2>Work Experience</h2>
            <p className="section-subtitle">Where I've worked and conducted research.</p>
          </div>
          <Link to="/work" className="btn btn-outline btn-sm">
            <span>View Full Timeline</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="work-summary-grid">
          {displayWork.map((item) => (
            <div key={item.id} className="card work-summary-card">
              <div className="work-dot" />
              <div className="work-summary-info">
                <h4>{item.company}</h4>
                <p className="work-summary-role">{item.role}</p>
                <p className="work-summary-period">
                  {item.startDate} — {item.endDate} {item.location && `• ${item.location}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
