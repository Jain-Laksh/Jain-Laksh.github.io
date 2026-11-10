import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { FiDownload, FiExternalLink, FiFileText, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import profileData from '../data/profile.json';
import workData from '../data/workExperience.json';
import publicationsData from '../data/publications.json';
import achievementsData from '../data/achievements.json';
import { PageHead } from '../components/Shared/PageHead';

export default function Connect() {
  // Default to 'embed' (PDF View) so the uploaded resume is visible immediately
  const [cvViewMode, setCvViewMode] = useState('embed');

  const socialsList = [
    profileData.email && {
      name: 'Email',
      handle: profileData.email,
      url: `mailto:${profileData.email}`,
      icon: <FaEnvelope />,
    },
    profileData.socials?.github && {
      name: 'GitHub',
      handle: '@' + (profileData.socials.github.split('/').filter(Boolean).pop() || 'github'),
      url: profileData.socials.github,
      icon: <FaGithub />,
    },
    profileData.socials?.linkedin && {
      name: 'LinkedIn',
      handle: profileData.name,
      url: profileData.socials.linkedin,
      icon: <FaLinkedin />,
    },
    profileData.socials?.googleScholar && {
      name: 'Google Scholar',
      handle: 'Citations & Papers',
      url: profileData.socials.googleScholar,
      icon: <FaGraduationCap />,
    },
    profileData.socials?.twitter && {
      name: 'X / Twitter',
      handle: '@' + (profileData.socials.twitter.split('/').filter(Boolean).pop() || 'twitter'),
      url: profileData.socials.twitter,
      icon: <FaXTwitter />,
    },
    profileData.socials?.instagram && {
      name: 'Instagram',
      handle: '@' + (profileData.socials.instagram.split('/').filter(Boolean).pop() || 'instagram'),
      url: profileData.socials.instagram,
      icon: <FaInstagram />,
    },
  ].filter(Boolean);

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rawCv = profileData.cvFile || '/cv.pdf';
  const cvUrl = rawCv.startsWith('http') ? rawCv : `${baseUrl}/${rawCv.replace(/^\.?\//, '')}`;

  return (
    <div className="container page">
      <PageHead label="Get in Touch" title="Connect & Curriculum Vitae">
        Feel free to reach out for research collaborations, engineering opportunities, or to discuss new ideas!
      </PageHead>

      {/* Socials */}
      <div className="contact-list">
        {socialsList.map((item) => (
          <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="contact">
            <span className="contact-icon" aria-hidden="true">
              {item.icon}
            </span>
            <div>
              <h3>{item.name}</h3>
              <p>{item.handle}</p>
            </div>
          </a>
        ))}
      </div>

      {/* CV Section */}
      <section aria-labelledby="cv-title">
        <div className="cv-head">
          <div>
            <h2 id="cv-title">Curriculum Vitae</h2>
            <p className="cv-sub">Academic & Professional Profile, updated 2026</p>
          </div>

          <div className="cv-controls">
            <div className="seg" role="group" aria-label="CV view">
              <button type="button" aria-pressed={cvViewMode === 'text'} onClick={() => setCvViewMode('text')}>
                Web Summary
              </button>
              <button type="button" aria-pressed={cvViewMode === 'embed'} onClick={() => setCvViewMode('embed')}>
                PDF View
              </button>
            </div>

            <a
              href={cvUrl}
              download="Laksh_Jain_CV.pdf"
              className="btn btn-solid btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        <div className="cv-frame">
          <div className="cv-frame-bar">
            <h3>
              <FiFileText aria-hidden="true" />
              {profileData.name} — Curriculum Vitae
            </h3>
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-quiet btn-sm">
              <FiExternalLink />
              <span>Open PDF in New Tab</span>
            </a>
          </div>

          {cvViewMode === 'embed' ? (
            <div className="cv-embed">
              <object data={`${cvUrl}#view=FitH`} type="application/pdf" aria-label="Curriculum Vitae PDF">
                <iframe src={`${cvUrl}#view=FitH`} title="Curriculum Vitae PDF">
                  <div className="cv-embed-fallback">
                    <p>PDF preview could not be displayed directly.</p>
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                      Open PDF in New Tab
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          ) : (
            /* Structured Web CV summary */
            <div className="cv-summary">
              <div className="cv-summary-head">
                <h2>{profileData.name}</h2>
                <p className="cv-summary-title">
                  <span>{profileData.title}</span>
                  <span>{profileData.institution}</span>
                </p>
                <div className="cv-contact-line">
                  <span>
                    <FiMapPin aria-hidden="true" />
                    {profileData.location}
                  </span>
                  <span>
                    <FiMail aria-hidden="true" />
                    <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
                  </span>
                  {profileData.phone && (
                    <span>
                      <FiPhone aria-hidden="true" />
                      {profileData.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="cv-section">
                <h3>Education</h3>
                <div>
                  {profileData.education && profileData.education.length > 0 ? (
                    profileData.education.map((edu, idx) => (
                      <div key={idx} className="cv-entry">
                        <div className="cv-entry-head">
                          <strong>{edu.institution}</strong>
                          <span className="cv-entry-when">{edu.period}</span>
                        </div>
                        <p>
                          {edu.degree}, <span className="cv-grade">{edu.grade}</span>
                        </p>
                        {edu.details && <p className="cv-small">{edu.details}</p>}
                      </div>
                    ))
                  ) : (
                    <div className="cv-entry">
                      <div className="cv-entry-head">
                        <strong>{profileData.institution}</strong>
                        <span className="cv-entry-when">2023 — 2027</span>
                      </div>
                      <p>B.Tech in Artificial Intelligence, CPI: 9.05/10</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="cv-section">
                <h3>Key Honors & Achievements</h3>
                <ul className="cv-bullets cv-honors">
                  {achievementsData.map((ach) => (
                    <li key={ach.id}>
                      <strong>{ach.year}</strong>: {ach.title}
                      {ach.link && (
                        <>
                          {' '}
                          <a href={ach.link} target="_blank" rel="noopener noreferrer" className="cv-inline-link">
                            [Link ↗]
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Publications */}
              <div className="cv-section">
                <h3>Publications</h3>
                <div>
                  {publicationsData.map((pub) => (
                    <div key={pub.id} className="cv-entry">
                      <strong className="cv-entry-title">{pub.title}</strong>
                      <p className="cv-small">
                        {pub.authors.join(', ')}. <em>{pub.venue}</em>
                      </p>
                      {pub.equalContribution && (
                        <p className="cv-small">
                          <em>{pub.equalContribution}</em>
                        </p>
                      )}
                      <div className="cv-links">
                        {pub.links?.paper && (
                          <a href={pub.links.paper} target="_blank" rel="noopener noreferrer">
                            [Paper PDF ↗]
                          </a>
                        )}
                        {pub.links?.website && (
                          <a href={pub.links.website} target="_blank" rel="noopener noreferrer">
                            [Project Page ↗]
                          </a>
                        )}
                        {pub.links?.code && (
                          <a href={pub.links.code} target="_blank" rel="noopener noreferrer">
                            [Code ↗]
                          </a>
                        )}
                        {pub.links?.dataset && (
                          <a href={pub.links.dataset} target="_blank" rel="noopener noreferrer">
                            [Dataset (Kaggle) ↗]
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="cv-section">
                <h3>Work Experience & Internships</h3>
                <div>
                  {workData.map((w) => (
                    <div key={w.id} className="cv-entry">
                      <div className="cv-entry-head">
                        <strong>
                          {w.role} — {w.company}
                        </strong>
                        <span className="cv-entry-when">
                          {w.startDate} - {w.endDate}
                        </span>
                      </div>
                      {w.department && <p className="cv-small">{w.department}</p>}
                      <p>{w.description}</p>
                      {w.highlights && (
                        <ul className="cv-bullets">
                          {w.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                      {w.link && (
                        <div className="cv-links">
                          <a href={w.link} target="_blank" rel="noopener noreferrer">
                            ↗ {w.linkText || 'Project / Demo'}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              {profileData.technicalSkills && (
                <div className="cv-section">
                  <h3>Technical Skills</h3>
                  <div className="cv-skills">
                    <div>
                      <strong>Programming Languages:</strong>{' '}
                      <span>{profileData.technicalSkills.languages?.join(', ')}</span>
                    </div>
                    <div>
                      <strong>Tools & Platforms:</strong> <span>{profileData.technicalSkills.tools?.join(', ')}</span>
                    </div>
                    <div>
                      <strong>Libraries & Frameworks:</strong>{' '}
                      <span>{profileData.technicalSkills.frameworks?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Relevant Coursework */}
              {profileData.coursework && (
                <div className="cv-section">
                  <h3>Relevant Coursework & Academic Performance</h3>
                  <ul className="chip-list">
                    {profileData.coursework.map((c, cIdx) => (
                      <li key={cIdx} className="chip">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Positions of Responsibility */}
              {profileData.positionsOfResponsibility && (
                <div className="cv-section">
                  <h3>Leadership & Positions of Responsibility</h3>
                  <div>
                    {profileData.positionsOfResponsibility.map((pos, pIdx) => (
                      <div key={pIdx} className="cv-entry">
                        <div className="cv-entry-head">
                          <strong>{pos.role}</strong>
                          <span className="cv-entry-when">{pos.period}</span>
                        </div>
                        <p className="cv-small">
                          <em>{pos.organization}</em> — {pos.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
