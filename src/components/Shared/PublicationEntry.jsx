import React, { useState } from 'react';
import { FiFileText, FiCode, FiTv, FiExternalLink, FiDatabase, FiCopy, FiCheck } from 'react-icons/fi';
import profileData from '../../data/profile.json';

export default function PublicationEntry({ pub, showYear = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopyBibtex = (bibtex) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const links = [
    pub.links.paper && { key: 'paper', href: pub.links.paper, icon: <FiFileText />, label: 'Paper' },
    pub.links.website && { key: 'website', href: pub.links.website, icon: <FiExternalLink />, label: 'Project Page' },
    pub.links.code && { key: 'code', href: pub.links.code, icon: <FiCode />, label: 'Code' },
    pub.links.dataset && { key: 'dataset', href: pub.links.dataset, icon: <FiDatabase />, label: 'Dataset' },
  ].filter(Boolean);

  return (
    <article className="pub">
      <div className="pub-venue-row">
        <span className="pub-venue">{pub.venue}</span>
        {showYear && <span className="pub-year">{pub.year}</span>}
      </div>
      <h3 className="pub-title">{pub.title}</h3>
      <p className="pub-authors">
        {pub.authors.map((author, index) => {
          const cleaned = author.replace('*', '').trim().toLowerCase();
          const isUser =
            cleaned === profileData.name.toLowerCase() || cleaned === 'laksh' || cleaned === 'laksh jain';
          return (
            <React.Fragment key={author}>
              {isUser ? <strong>{author}</strong> : author}
              {index < pub.authors.length - 1 ? ', ' : ''}
            </React.Fragment>
          );
        })}
      </p>
      {pub.equalContribution && <p className="pub-note">{pub.equalContribution}</p>}
      <p className="pub-abstract">{pub.abstract}</p>

      <div className="pub-actions">
        {links.map((l) => (
          <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" className="pub-action">
            {l.icon}
            <span>{l.label}</span>
          </a>
        ))}
        {pub.bibtex && (
          <button
            type="button"
            onClick={() => handleCopyBibtex(pub.bibtex)}
            className={`pub-action ${copied ? 'is-done' : ''}`}
            title="Copy BibTeX Citation"
          >
            {copied ? <FiCheck /> : <FiCopy />}
            <span>{copied ? 'Copied BibTeX!' : 'Cite'}</span>
          </button>
        )}
        {pub.links.slides && (
          <a href={pub.links.slides} target="_blank" rel="noopener noreferrer" className="pub-action">
            <FiTv />
            <span>Slides</span>
          </a>
        )}
      </div>
    </article>
  );
}
