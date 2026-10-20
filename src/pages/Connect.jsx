import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { FiDownload, FiExternalLink, FiFileText, FiMapPin, FiMail, FiPhone, FiAward, FiCheckCircle } from 'react-icons/fi';
import profileData from '../data/profile.json';
import workData from '../data/workExperience.json';
import publicationsData from '../data/publications.json';
import achievementsData from '../data/achievements.json';

export default function Connect() {
  // Default to 'embed' (PDF View) so user immediately sees their uploaded resume
  const [cvViewMode, setCvViewMode] = useState('embed');
  const [pdfLoadError, setPdfLoadError] = useState(false);

  const socialsList = [
    profileData.email && {
      name: 'Email',
      handle: profileData.email,
      url: `mailto:${profileData.email}`,
      iconClass: 'email',
      icon: <FaEnvelope />,
    },
    profileData.socials?.github && {
      name: 'GitHub',
      handle: '@' + (profileData.socials.github.split('/').filter(Boolean).pop() || 'github'),
      url: profileData.socials.github,
      iconClass: 'github',
      icon: <FaGithub />,
    },
    profileData.socials?.linkedin && {
      name: 'LinkedIn',
      handle: profileData.name,
      url: profileData.socials.linkedin,
      iconClass: 'linkedin',
      icon: <FaLinkedin />,
    },
    profileData.socials?.googleScholar && {
      name: 'Google Scholar',
      handle: 'Citations & Papers',
      url: profileData.socials.googleScholar,
      iconClass: 'scholar',
      icon: <FaGraduationCap />,
    },
    profileData.socials?.twitter && {
      name: 'X / Twitter',
      handle: '@' + (profileData.socials.twitter.split('/').filter(Boolean).pop() || 'twitter'),
      url: profileData.socials.twitter,
      iconClass: 'twitter',
      icon: <FaXTwitter />,
    },
    profileData.socials?.instagram && {
      name: 'Instagram',
      handle: '@' + (profileData.socials.instagram.split('/').filter(Boolean).pop() || 'instagram'),
      url: profileData.socials.instagram,
      iconClass: 'instagram',
      icon: <FaInstagram />,
    },
  ].filter(Boolean);

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rawCv = profileData.cvFile || '/cv.pdf';
  const cvUrl = rawCv.startsWith('http') ? rawCv : `${baseUrl}/${rawCv.replace(/^\.?\//, '')}`;

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
        <span className="section-label">Get in Touch</span>
        <h1>Connect & Curriculum Vitae</h1>
        <p className="page-subtitle">
          Feel free to reach out for research collaborations, engineering opportunities, or to discuss new ideas!
        </p>
      </div>

      {/* Socials Grid */}
      <div className="socials-grid">
        {socialsList.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <div className={`social-card-icon ${item.iconClass}`}>
              {item.icon}
            </div>
            <div className="social-card-info">
              <h4>{item.name}</h4>
              <p>{item.handle}</p>
            </div>
          </a>
        ))}
      </div>

      {/* CV Section */}
      <div style={{ marginTop: 'var(--space-10)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div>
            <h3>Curriculum Vitae</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)', marginTop: '4px' }}>
              Academic & Professional Profile • Updated 2026
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '3px',
              }}
            >
              <button
                onClick={() => setCvViewMode('text')}
                className={`tag tag-clickable ${cvViewMode === 'text' ? 'tag-active' : ''}`}
                style={{ borderRadius: 'var(--radius-full)', border: 'none' }}
              >
                Web Summary
              </button>
              <button
                onClick={() => setCvViewMode('embed')}
                className={`tag tag-clickable ${cvViewMode === 'embed' ? 'tag-active' : ''}`}
                style={{ borderRadius: 'var(--radius-full)', border: 'none' }}
              >
                PDF View
              </button>
            </div>

            {/* Download PDF link */}
            <a
              href={cvUrl}
              download="Laksh_Jain_CV.pdf"
              className="btn btn-primary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* CV Viewer Box */}
        <div className="cv-viewer">
          <div className="cv-viewer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiFileText style={{ color: 'var(--primary)' }} />
              <h4 style={{ margin: 0 }}>{profileData.name} — Curriculum Vitae</h4>
            </div>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              <FiExternalLink />
              <span>Open PDF in New Tab</span>
            </a>
          </div>

          {cvViewMode === 'embed' ? (
            <div style={{ width: '100%', minHeight: '750px', height: '82vh', position: 'relative' }}>
              <object
                data={`${cvUrl}#view=FitH`}
                type="application/pdf"
                className="cv-viewer-embed"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              >
                <iframe
                  src={`${cvUrl}#view=FitH`}
                  title="Curriculum Vitae PDF"
                  className="cv-viewer-embed"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                >
                  <div style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                    <p style={{ marginBottom: 'var(--space-4)' }}>PDF preview could not be displayed directly.</p>
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Open PDF in New Tab
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          ) : (
            /* Structured Web CV summary */
            <div style={{ padding: 'var(--space-8) var(--space-10)', maxWidth: '840px', margin: '0 auto' }}>
              {/* Header Box */}
              <div
                style={{
                  borderBottom: '2px solid var(--border)',
                  paddingBottom: 'var(--space-6)',
                  marginBottom: 'var(--space-8)',
                }}
              >
                <h2 style={{ margin: '0 0 6px 0', fontSize: 'var(--fs-2xl)' }}>{profileData.name}</h2>
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--fs-md)', margin: '0 0 8px 0' }}>
                  {profileData.title} • {profileData.institution}
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    color: 'var(--text-tertiary)',
                    fontSize: 'var(--fs-sm)',
                  }}
                >
                  <span>
                    <FiMapPin style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--accent)' }} />
                    {profileData.location}
                  </span>
                  <span>
                    <FiMail style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--primary)' }} />
                    <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
                  </span>
                  {profileData.phone && (
                    <span>
                      <FiPhone style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {profileData.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Education */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
                  Education
                </h3>
                {profileData.education && profileData.education.length > 0 ? (
                  profileData.education.map((edu, idx) => (
                    <div key={idx} style={{ marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <strong>{edu.institution}</strong>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>{edu.period}</span>
                      </div>
                      <p style={{ margin: '2px 0', color: 'var(--text-secondary)' }}>
                        {edu.degree} • <strong style={{ color: 'var(--accent)' }}>{edu.grade}</strong>
                      </p>
                      {edu.details && (
                        <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                          {edu.details}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{profileData.institution}</strong>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>2023 — 2027</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      B.Tech in Artificial Intelligence • CPI: 9.05/10
                    </p>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
                  Key Honors & Achievements
                </h3>
                <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                  {achievementsData.map((ach) => (
                    <li key={ach.id} style={{ marginBottom: '6px' }}>
                      <strong>{ach.year}</strong>: {ach.title}
                      {ach.link && (
                        <a
                          href={ach.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: '6px', color: 'var(--primary)', fontSize: 'var(--fs-xs)' }}
                        >
                          [Link ↗]
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Publications */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
                  Publications
                </h3>
                {publicationsData.map((pub) => (
                  <div key={pub.id} style={{ marginBottom: 'var(--space-4)' }}>
                    <strong>{pub.title}</strong>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', margin: '2px 0' }}>
                      {pub.authors.join(', ')} • <em>{pub.venue}</em>
                    </p>
                    {pub.equalContribution && (
                      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', margin: '0 0 4px 0', fontStyle: 'italic' }}>
                        {pub.equalContribution}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: 'var(--fs-xs)', flexWrap: 'wrap' }}>
                      {pub.links?.paper && (
                        <a href={pub.links.paper} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                          [Paper PDF ↗]
                        </a>
                      )}
                      {pub.links?.website && (
                        <a href={pub.links.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                          [Project Page ↗]
                        </a>
                      )}
                      {pub.links?.code && (
                        <a href={pub.links.code} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                          [Code ↗]
                        </a>
                      )}
                      {pub.links?.dataset && (
                        <a href={pub.links.dataset} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                          [Dataset (Kaggle) ↗]
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Work Experience */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
                  Work Experience & Internships
                </h3>
                {workData.map((w) => (
                  <div key={w.id} style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <strong>{w.role} — {w.company}</strong>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-xs)' }}>
                        {w.startDate} - {w.endDate}
                      </span>
                    </div>
                    {w.department && (
                      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', margin: '2px 0' }}>
                        {w.department}
                      </p>
                    )}
                    <p style={{ fontSize: 'var(--fs-sm)', marginTop: '4px', marginBottom: '6px' }}>{w.description}</p>
                    {w.highlights && (
                      <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>
                        {w.highlights.map((h, i) => (
                          <li key={i} style={{ marginBottom: '2px' }}>{h}</li>
                        ))}
                      </ul>
                    )}
                    {w.link && (
                      <div style={{ marginTop: '4px' }}>
                        <a
                          href={w.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 'var(--fs-xs)', color: 'var(--primary)' }}
                        >
                          ↗ {w.linkText || 'Project / Demo'}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Technical Skills */}
              {profileData.technicalSkills && (
                <div style={{ marginBottom: 'var(--space-8)' }}>
                  <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
                    Technical Skills
                  </h3>
                  <div style={{ fontSize: 'var(--fs-sm)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>
                      <strong>Programming Languages:</strong>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {profileData.technicalSkills.languages?.join(', ')}
                      </span>
                    </div>
                    <div>
                      <strong>Tools & Platforms:</strong>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {profileData.technicalSkills.tools?.join(', ')}
                      </span>
                    </div>
                    <div>
                      <strong>Libraries & Frameworks:</strong>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {profileData.technicalSkills.frameworks?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Relevant Coursework */}
              {profileData.coursework && (
                <div style={{ marginBottom: 'var(--space-8)' }}>
                  <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
                    Relevant Coursework & Academic Performance
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profileData.coursework.map((c, cIdx) => (
                      <span key={cIdx} className="tag">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Positions of Responsibility */}
              {profileData.positionsOfResponsibility && (
                <div>
                  <h3 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
                    Leadership & Positions of Responsibility
                  </h3>
                  {profileData.positionsOfResponsibility.map((pos, pIdx) => (
                    <div key={pIdx} style={{ marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <strong>{pos.role}</strong>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-xs)' }}>{pos.period}</span>
                      </div>
                      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', margin: '2px 0' }}>
                        <em>{pos.organization}</em> — {pos.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
