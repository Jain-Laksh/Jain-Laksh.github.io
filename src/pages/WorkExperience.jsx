import React from 'react';
import { FiMapPin, FiCalendar, FiExternalLink } from 'react-icons/fi';
import workData from '../data/workExperience.json';

export default function WorkExperience() {
  return (
    <div
      className="container"
      style={{
        paddingTop: 'calc(var(--navbar-height) + var(--space-8))',
        paddingBottom: 'var(--space-20)',
      }}
    >
      {/* Header */}
      <div className="page-header">
        <span className="section-label">Career & Industry</span>
        <h1>Work Experience</h1>
        <p className="page-subtitle">
          My professional roles, research fellowships, and industry internships in AI and software engineering.
        </p>
      </div>

      {/* Timeline */}
      <div className="work-timeline">
        {workData.map((item) => (
          <div key={item.id} className="work-timeline-item">
            <div className="work-timeline-dot" />
            <div className="card work-card">
              <div className="work-card-header">
                <div>
                  <h3 className="work-card-company">{item.company}</h3>
                  {item.department && (
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>
                      {item.department}
                    </p>
                  )}
                  <p className="work-card-role">{item.role}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className="work-card-period">
                    <FiCalendar style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {item.startDate} — {item.endDate}
                  </span>
                  {item.location && (
                    <span className="work-card-location" style={{ margin: 0 }}>
                      <FiMapPin style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {item.location}
                    </span>
                  )}
                </div>
              </div>

              <p>{item.description}</p>

              {item.highlights && item.highlights.length > 0 && (
                <ul className="work-card-highlights">
                  {item.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}

              {item.link && (
                <div style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pub-link"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FiExternalLink />
                    <span>{item.linkText || 'Project / Demo Link'}</span>
                  </a>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="work-card-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {item.photos && item.photos.length > 0 && (
                <div className="work-card-photos">
                  {item.photos.map((photo, pIdx) => (
                    <img
                      key={pIdx}
                      src={photo}
                      alt={`${item.company} moment ${pIdx + 1}`}
                      className="work-card-photo"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
