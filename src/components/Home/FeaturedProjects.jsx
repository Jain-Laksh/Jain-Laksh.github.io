import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink, FiFileText } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa6';
import { FiFolder } from 'react-icons/fi';
import projectsData from '../../data/projects.json';

export default function FeaturedProjects() {
  const featured = projectsData
    .filter((p) => p.featured)
    .sort((a, b) => {
      const dateA = a.date || `${a.year}-01`;
      const dateB = b.date || `${b.year}-01`;
      return dateB.localeCompare(dateA);
    });

  return (
    <section className="section">
      <div className="container">
        <div
          className="section-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span className="section-label">Engineering</span>
            <h2>Featured Projects</h2>
            <p className="section-subtitle">
              Selected machine learning systems and open-source software projects.
            </p>
          </div>
          <Link to="/projects" className="btn btn-outline btn-sm">
            <span>All Projects</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="projects-grid">
          {featured.map((project) => (
            <div key={project.id} className="card project-card">
              <div className="project-card-header">
                <div className="project-card-icon">
                  <FiFolder />
                </div>
                <div className="project-card-links">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      aria-label="GitHub Repository"
                      title="GitHub Repository"
                    >
                      <FaGithub />
                    </a>
                  )}
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      aria-label="Live Demo"
                      title="Live Demo"
                    >
                      <FiExternalLink />
                    </a>
                  )}
                  {project.report && (
                    <a
                      href={project.report}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      aria-label="Project Report"
                      title="Project Report"
                    >
                      <FiFileText />
                    </a>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ margin: 0 }}>{project.title}</h4>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{project.year}</span>
              </div>

              {project.badge && (
                <div style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(217, 119, 6, 0.12)',
                      color: '#d97706',
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 600,
                    }}
                  >
                    ★ {project.badge}
                  </span>
                </div>
              )}

              {project.advisor && (
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', margin: '0 0 6px 0', fontStyle: 'italic' }}>
                  Advisor: {project.advisor}
                </p>
              )}

              <p>{project.description}</p>

              <div className="project-card-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
