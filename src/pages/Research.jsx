import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiCode, FiTv, FiSearch, FiArrowRight, FiExternalLink, FiDatabase, FiCopy, FiCheck } from 'react-icons/fi';
import { FaGraduationCap, FaEnvelope } from 'react-icons/fa6';
import { FiMessageSquare, FiEye, FiCpu, FiShield } from 'react-icons/fi';
import profileData from '../data/profile.json';
import publicationsData from '../data/publications.json';

function formatBioText(text) {
  if (typeof text !== 'string') return text;
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return (
        <em key={i} style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: 500 }}>
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}

export default function Research() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyBibtex = (bibtex, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bibtex);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Extract all unique tags from publications
  const allTags = ['All', ...Array.from(new Set(publicationsData.flatMap((p) => p.tags)))];

  const sortedPublications = [...publicationsData].sort((a, b) => {
    const dateA = a.date || `${a.year}-01`;
    const dateB = b.date || `${b.year}-01`;
    return dateB.localeCompare(dateA);
  });

  const filteredPublications = sortedPublications.filter((pub) => {
    const matchesTag = selectedTag === 'All' || pub.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery.trim() === '' ||
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const getInterestIcon = (iconName) => {
    switch (iconName) {
      case 'language':
        return <FiMessageSquare />;
      case 'vision':
        return <FiEye />;
      case 'rl':
        return <FiCpu />;
      case 'ethics':
        return <FiShield />;
      default:
        return <FiFileText />;
    }
  };

  return (
    <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-8))', paddingBottom: 'var(--space-20)' }}>
      {/* Header */}
      <div className="page-header">
        <span className="section-label">Academic Portfolio</span>
        <h1>Research</h1>
        <p className="page-subtitle">
          My primary research focus is in efficient machine learning, multi-modal systems, and responsible AI.
        </p>
      </div>

      {/* Research Interests */}
      <div style={{ marginBottom: 'var(--space-12)' }}>
        <h3 style={{ marginBottom: 'var(--space-6)' }}>Research Interests</h3>
        <div className="research-interests-grid">
          {profileData.researchInterests.map((interest, index) => (
            <div key={index} className="card research-interest-card">
              <div className={`research-interest-icon ${interest.icon}`}>
                {getInterestIcon(interest.icon)}
              </div>
              <h4>{interest.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Research Background */}
      <div className="research-background">
        <h3 style={{ marginBottom: 'var(--space-5)' }}>Background & Philosophy</h3>
        {Array.isArray(profileData.researchBackground) ? (
          profileData.researchBackground.map((para, idx) => (
            <p key={idx}>{formatBioText(para)}</p>
          ))
        ) : (
          <p>{formatBioText(profileData.researchBackground)}</p>
        )}
      </div>

      {/* Publications Section */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
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
            <h3>Publications</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)', marginTop: '4px' }}>
              Showing {filteredPublications.length} of {publicationsData.length} papers
            </p>
          </div>

          {/* Search box */}
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
              placeholder="Search papers, venues..."
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

        {/* Tag Filters */}
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

        {/* Publications List */}
        {filteredPublications.length === 0 ? (
          <div className="empty-state">
            <p>No publications match your search criteria.</p>
          </div>
        ) : (
          <div>
            {filteredPublications.map((pub) => (
              <div key={pub.id} className="card publication-card">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span className="pub-venue">{pub.venue}</span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>• {pub.year}</span>
                </div>
                <h4>{pub.title}</h4>
                <p className="pub-authors">
                  {pub.authors.map((author, index) => {
                    const cleaned = author.replace('*', '').trim().toLowerCase();
                    const isUser =
                      cleaned === profileData.name.toLowerCase() ||
                      cleaned === 'laksh' ||
                      cleaned === 'laksh jain';
                    return (
                      <React.Fragment key={author}>
                        {isUser ? <strong>{author}</strong> : author}
                        {index < pub.authors.length - 1 ? ', ' : ''}
                      </React.Fragment>
                    );
                  })}
                </p>
                {pub.equalContribution && (
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', margin: '-6px 0 10px 0', fontStyle: 'italic' }}>
                    {pub.equalContribution}
                  </p>
                )}
                <p className="pub-abstract">{pub.abstract}</p>

                <div className="pub-links">
                  {pub.links.paper && (
                    <a
                      href={pub.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pub-link"
                    >
                      <FiFileText />
                      <span>Paper</span>
                    </a>
                  )}
                  {pub.links.website && (
                    <a
                      href={pub.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pub-link"
                    >
                      <FiExternalLink />
                      <span>Project Page</span>
                    </a>
                  )}
                  {pub.links.code && (
                    <a
                      href={pub.links.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pub-link"
                    >
                      <FiCode />
                      <span>Code</span>
                    </a>
                  )}
                  {pub.links.dataset && (
                    <a
                      href={pub.links.dataset}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pub-link"
                    >
                      <FiDatabase />
                      <span>Dataset</span>
                    </a>
                  )}
                  {pub.bibtex && (
                    <button
                      onClick={() => handleCopyBibtex(pub.bibtex, pub.id)}
                      className="pub-link"
                      style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', font: 'inherit' }}
                      title="Copy BibTeX Citation"
                    >
                      {copiedId === pub.id ? <FiCheck style={{ color: '#2BA88E' }} /> : <FiCopy />}
                      <span>{copiedId === pub.id ? 'Copied BibTeX!' : 'Cite'}</span>
                    </button>
                  )}
                  {pub.links.slides && (
                    <a
                      href={pub.links.slides}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pub-link"
                    >
                      <FiTv />
                      <span>Slides</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect CTA */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-secondary), var(--surface))',
          padding: 'var(--space-10)',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Interested in Research Collaboration?</h3>
        <p style={{ maxWidth: '600px', margin: '0 auto var(--space-6)', color: 'var(--text-secondary)' }}>
          I am always open to discussing new research ideas, paper feedback, and potential academic collaborations.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`mailto:${profileData.email}`} className="btn btn-primary">
            <FaEnvelope />
            <span>Send an Email</span>
          </a>
          <a
            href={profileData.socials.googleScholar}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <FaGraduationCap />
            <span>Google Scholar</span>
          </a>
          <Link to="/connect" className="btn btn-outline">
            <span>View CV</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
