import React from 'react';
import { FiMapPin, FiCalendar, FiExternalLink } from 'react-icons/fi';
import workData from '../data/workExperience.json';
import { PageHead } from '../components/Shared/PageHead';

export default function WorkExperience() {
  return (
    <div className="container page">
      <PageHead title="Work Experience">
        My professional roles, research fellowships, and industry internships in AI and software engineering.
      </PageHead>

      {/* Timeline */}
      <ol className="timeline">
        {workData.map((item) => (
          <li key={item.id} className="tl-item">
            <div className="tl-meta">
              <span className="tl-period">
                <FiCalendar aria-hidden="true" />
                {item.startDate} — {item.endDate}
              </span>
              {item.location && (
                <span>
                  <FiMapPin aria-hidden="true" />
                  {item.location}
                </span>
              )}
            </div>

            <div>
              <h2 className="tl-company">{item.company}</h2>
              {item.department && <p className="tl-dept">{item.department}</p>}
              <p className="tl-role">{item.role}</p>

              <p className="tl-desc">{item.description}</p>

              {item.highlights && item.highlights.length > 0 && (
                <ul className="tl-highlights">
                  {item.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}

              {item.link && (
                <div className="tl-link">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="pub-action">
                    <FiExternalLink />
                    <span>{item.linkText || 'Project / Demo Link'}</span>
                  </a>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <ul className="chip-list tl-tags">
                  {item.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {item.photos && item.photos.length > 0 && (
                <div className="tl-photos">
                  {item.photos.map((photo, pIdx) => (
                    <img key={pIdx} src={photo} alt={`${item.company} moment ${pIdx + 1}`} loading="lazy" />
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
