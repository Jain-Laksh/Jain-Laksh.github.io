import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import newsData from '../data/news.json';

export default function AllNews() {
  const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div
      className="container"
      style={{
        paddingTop: 'calc(var(--navbar-height) + var(--space-8))',
        paddingBottom: 'var(--space-20)',
      }}
    >
      <Link to="/" className="back-link">
        <FiArrowLeft />
        <span>Back to Home</span>
      </Link>

      <div className="page-header" style={{ paddingTop: 'var(--space-4)' }}>
        <span className="section-label">Archive</span>
        <h1>All News & Updates</h1>
        <p className="page-subtitle">
          A complete chronological timeline of announcements, research publications, awards, and life milestones.
        </p>
      </div>

      <div className="card card-flat" style={{ padding: 'var(--space-6)', maxWidth: '900px' }}>
        <div className="all-news-list">
          {sortedNews.map((item) => (
            <div key={item.id} className="news-item">
              <span className="news-date">{item.date}</span>
              <span className="news-content">
                {item.content}{' '}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="External Link"
                  >
                    [link <FiExternalLink style={{ fontSize: '0.8em', verticalAlign: 'middle' }} />]
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
