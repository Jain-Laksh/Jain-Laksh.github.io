import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import newsData from '../../data/news.json';

export default function RecentNews() {
  const sorted = [...newsData].sort((a, b) => b.date.localeCompare(a.date));
  const recentNews = sorted.slice(0, 5);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Updates</span>
          <h2>Recent News</h2>
          <p className="section-subtitle">Latest milestones, publications, and announcements.</p>
        </div>

        <div className="card card-flat" style={{ padding: 'var(--space-6)' }}>
          <div className="news-list">
            {recentNews.map((item) => (
              <div key={item.id} className="news-item">
                <span className="news-date">{item.date}</span>
                <span className="news-content">
                  {item.content}{' '}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Learn more"
                    >
                      [link <FiExternalLink style={{ fontSize: '0.8em', verticalAlign: 'middle' }} />]
                    </a>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="news-view-all">
            <Link to="/news" className="btn btn-outline btn-sm">
              <span>View All News ({newsData.length})</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
