import React from 'react';
import { Link } from 'react-router-dom';
import workData from '../../data/workExperience.json';

export default function WorkSummary() {
  // Kabal Research is kept only in the dedicated Work Experience tab
  const displayWork = workData.filter((item) => item.id !== 'kabal-research-2024');
  return (
    <section className="section">
      <div className="container">
        <header className="section-head">
          <div className="section-head-row">
            <div>
              <h2>Work Experience</h2>
              <p className="section-lede">Where I've worked and conducted research.</p>
            </div>
            <Link to="/work" className="text-link">
              View Full Timeline
            </Link>
          </div>
        </header>

        <div>
          <ul className="work-rows">
            {displayWork.map((item) => (
              <li key={item.id} className="work-row">
                <h3>{item.company}</h3>
                <p className="work-row-role">{item.role}</p>
                <p className="work-row-meta">
                  <span>
                    {item.startDate} — {item.endDate}
                  </span>
                  {item.location && <span>{item.location}</span>}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
