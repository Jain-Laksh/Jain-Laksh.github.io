import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiEye, FiCpu, FiShield } from 'react-icons/fi';
import { FaGraduationCap, FaEnvelope } from 'react-icons/fa6';
import profileData from '../data/profile.json';
import publicationsData from '../data/publications.json';
import { PageHead, FilterBar } from '../components/Shared/PageHead';
import PublicationEntry from '../components/Shared/PublicationEntry';

function formatBioText(text) {
  if (typeof text !== 'string') return text;
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={i}>{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

export default function Research() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="container page">
      <PageHead label="Academic Portfolio" title="Research">
        My primary research focus is in efficient machine learning, multi-modal systems, and responsible AI.
      </PageHead>

      {/* Research Interests */}
      <section className="research-block margin-grid">
        <div aria-hidden="true" />
        <div>
          <h2 className="block-title">Research Interests</h2>
          <ul className="interests">
            {profileData.researchInterests.map((interest, index) => (
              <li key={index} className="interest">
                <span className="interest-icon" aria-hidden="true">
                  {getInterestIcon(interest.icon)}
                </span>
                <h3>{interest.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Research Background */}
      <section className="research-block margin-grid">
        <div aria-hidden="true" />
        <div>
          <h2 className="block-title">Research Statement</h2>
          <div className="essay">
            {Array.isArray(profileData.researchBackground) ? (
              profileData.researchBackground.map((para, idx) => <p key={idx}>{formatBioText(para)}</p>)
            ) : (
              <p>{formatBioText(profileData.researchBackground)}</p>
            )}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="research-block margin-grid">
        <div aria-hidden="true" />
        <div>
          <h2 className="block-title">Publications</h2>
          <FilterBar
            count={`Showing ${filteredPublications.length} of ${publicationsData.length} papers`}
            query={searchQuery}
            onQuery={setSearchQuery}
            placeholder="Search papers, venues..."
            tags={allTags}
            selected={selectedTag}
            onSelect={setSelectedTag}
          />

          {filteredPublications.length === 0 ? (
            <div className="empty">
              <p>No publications match your search criteria.</p>
            </div>
          ) : (
            <div>
              {filteredPublications.map((pub) => (
                <PublicationEntry key={pub.id} pub={pub} showYear />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Connect CTA */}
      <section className="margin-grid">
        <div aria-hidden="true" />
        <div className="cta-block">
          <h2>Interested in Research Collaboration?</h2>
          <p>
            I am always open to discussing new research ideas, paper feedback, and potential academic collaborations.
          </p>
          <div className="cta-actions">
            <a href={`mailto:${profileData.email}`} className="btn btn-solid">
              <FaEnvelope />
              <span>Send an Email</span>
            </a>
            <a
              href={profileData.socials.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-line"
            >
              <FaGraduationCap />
              <span>Google Scholar</span>
            </a>
            <Link to="/connect" className="btn btn-line">
              <span>View CV</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
