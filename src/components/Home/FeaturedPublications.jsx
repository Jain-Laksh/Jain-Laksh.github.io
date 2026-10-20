import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFileText, FiCode, FiTv, FiExternalLink, FiDatabase, FiCopy, FiCheck } from 'react-icons/fi';
import publicationsData from '../../data/publications.json';
import profileData from '../../data/profile.json';

export default function FeaturedPublications() {
  const [copiedId, setCopiedId] = useState(null);
  const featured = publicationsData.filter((p) => p.featured);

  const handleCopyBibtex = (bibtex, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bibtex);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section className="section section-alt">
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
            <span className="section-label">Research</span>
            <h2>Recent Publications</h2>
            <p className="section-subtitle">
              Selected peer-reviewed papers and conference contributions.
            </p>
          </div>
          <Link to="/research" className="btn btn-outline btn-sm">
            <span>All Publications</span>
            <FiArrowRight />
          </Link>
        </div>

        <div>
          {featured.map((pub) => (
            <div key={pub.id} className="card publication-card">
              <span className="pub-venue">{pub.venue}</span>
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
      </div>
    </section>
  );
}
