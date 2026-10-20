import React, { useState } from 'react';
import { FiFolder, FiExternalLink, FiFileText, FiSearch } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa6';
import projectsData from '../data/projects.json';

export default function Projects() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = ['All', ...Array.from(new Set(projectsData.flatMap((p) => p.tags)))];

  const sortedProjects = [...projectsData].sort((a, b) => {
    const dateA = a.date || `${a.year}-01`;
    const dateB = b.date || `${b.year}-01`;
    return dateB.localeCompare(dateA);
  });

  const filteredProjects = sortedProjects.filter((proj) => {
    const matchesTag = selectedTag === 'All' || proj.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery.trim() === '' ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

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
        <span className="section-label">Engineering & Open Source</span>
        <h1>Projects</h1>
        <p className="page-subtitle">
          A showcase of software systems, machine learning pipelines, and experimental applications I've built.
        </p>
      </div>

      {/* Filter and Search Bar */}
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
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
          Showing {filteredProjects.length} of {projectsData.length} projects
        </p>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: 'var(--fs-sm)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Tag Filter */}
      <div className="tag-filter">
        <span className="tag-filter-label">Filter:</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`tag tag-clickable ${selectedTag === tag ? 'tag-active' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Projects Grid (Square boxes) */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
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
      )}
    </div>
  );
}
