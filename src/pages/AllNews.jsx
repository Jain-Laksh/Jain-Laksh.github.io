import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import newsData from '../data/news.json';
import { PageHead } from '../components/Shared/PageHead';
import { NewsRow } from '../components/Home/RecentNews';

export default function AllNews() {
  const sortedNews = [...newsData].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="container page">
      <Link to="/" className="back-link">
        <FiArrowLeft />
        <span>Back to Home</span>
      </Link>

      <PageHead label="Archive" title="All News & Updates">
        A complete chronological timeline of announcements, research publications, awards, and life milestones.
      </PageHead>

      <div className="margin-grid">
        <div aria-hidden="true" />
        <ul className="news-list">
          {sortedNews.map((item) => (
            <NewsRow key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
