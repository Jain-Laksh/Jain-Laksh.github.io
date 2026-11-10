import React from 'react';
import { FiExternalLink, FiFileText, FiAward } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa6';

export default function ProjectEntry({ project }) {
  return (
    <article className="project">
      <div className="project-top">
        <span className="project-year">{project.year}</span>
        <div className="project-links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
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
              className="icon-btn"
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
              className="icon-btn"
              aria-label="Project Report"
              title="Project Report"
            >
              <FiFileText />
            </a>
          )}
        </div>
      </div>

      <h3 className="project-title">{project.title}</h3>

      {project.badge && (
        <span className="project-badge">
          <FiAward aria-hidden="true" />
          {project.badge}
        </span>
      )}

      {project.advisor && <p className="project-advisor">Advisor: {project.advisor}</p>}

      <p className="project-desc">{project.description}</p>

      <ul className="chip-list project-tags">
        {project.tags.map((tag) => (
          <li key={tag} className="chip">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
