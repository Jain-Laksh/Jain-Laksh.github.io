import React from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../../data/projects.json';
import ProjectEntry from '../Shared/ProjectEntry';

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
        <header className="section-head">
          <div className="section-head-row">
            <div>
              <h2>Featured Projects</h2>
              <p className="section-lede">
                Selected machine learning systems and open-source software projects.
              </p>
            </div>
            <Link to="/projects" className="text-link">
              All Projects
            </Link>
          </div>
        </header>

        <div className="project-grid">
          {featured.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
