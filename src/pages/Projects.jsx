import React, { useState } from 'react';
import projectsData from '../data/projects.json';
import { PageHead, FilterBar } from '../components/Shared/PageHead';
import ProjectEntry from '../components/Shared/ProjectEntry';

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
    <div className="container page">
      <PageHead title="Projects">
        A showcase of software systems, machine learning pipelines, and experimental applications I've built.
      </PageHead>

      <FilterBar
        count={`Showing ${filteredProjects.length} of ${projectsData.length} projects`}
        query={searchQuery}
        onQuery={setSearchQuery}
        placeholder="Search projects..."
        tags={allTags}
        selected={selectedTag}
        onSelect={setSelectedTag}
      />

      {filteredProjects.length === 0 ? (
        <div className="empty">
          <p>No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
