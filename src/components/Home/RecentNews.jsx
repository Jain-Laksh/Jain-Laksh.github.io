import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import newsData from '../../data/news.json';

export function NewsRow({ item }) {
  return (
    <li className="news-row">
      <time className="news-date" dateTime={item.date}>
        {item.date}
      </time>
      <span className="news-content">
        {item.content}{' '}
        {item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer" title="Learn more">
            [link <FiExternalLink style={{ fontSize: '0.85em', verticalAlign: '-0.05em' }} />]
          </a>
        )}
      </span>
    </li>
  );
}

export default function RecentNews() {
  const sorted = [...newsData].sort((a, b) => b.date.localeCompare(a.date));
  const recentNews = sorted.slice(0, 5);

  return (
    <section className="section">
      <div className="container">
        <header className="section-head margin-grid">
          <p className="margin-label">Updates</p>
          <div>
            <h2>Recent News</h2>
            <p className="section-lede">Latest milestones, publications, and announcements.</p>
          </div>
        </header>

        <div className="margin-grid">
          <div aria-hidden="true" />
          <div>
            <ul className="news-list">
              {recentNews.map((item) => (
                <NewsRow key={item.id} item={item} />
              ))}
            </ul>
            <div className="news-more">
              <Link to="/news" className="text-link">
                View All News ({newsData.length})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
