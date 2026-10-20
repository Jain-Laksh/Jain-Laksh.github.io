import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiSearch, FiHeart, FiEye } from 'react-icons/fi';
import postsData from '../data/posts.json';
import { useBlogListStats } from '../hooks/usePostLikes';

export default function Blog() {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const postStats = useBlogListStats(postsData);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    postsData.forEach((post) => post.tags.forEach((t) => tags.add(t)));
    return ['All', ...Array.from(tags)];
  }, []);

  // Filter posts based on tag and search
  const filteredPosts = useMemo(() => {
    return postsData.filter((post) => {
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [selectedTag, searchQuery]);

  // Group by year descending, and sort by date descending within each year
  const groupedByYear = useMemo(() => {
    const groups = {};
    filteredPosts.forEach((post) => {
      const year = post.year || new Date(post.date).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(post);
    });

    // Sort within each year
    Object.keys(groups).forEach((year) => {
      groups[year].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    // Return array of [year, posts] sorted by year descending
    return Object.entries(groups).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));
  }, [filteredPosts]);

  return (
    <div
      className="container"
      style={{
        paddingTop: 'calc(var(--navbar-height) + var(--space-8))',
        paddingBottom: 'var(--space-20)',
      }}
    >
      {/* Header */}
      <div className="page-header">
        <span className="section-label">Thoughts & Tutorials</span>
        <h1>Posts</h1>
        <p className="page-subtitle">
          Writings on machine learning research, interview experiences, systems engineering, and technical tutorials.
        </p>
      </div>

      {/* Filter and Search Bar */}
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
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
          Showing {filteredPosts.length} of {postsData.length} articles
        </p>

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
            placeholder="Search articles..."
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

      {/* Year-grouped Posts List */}
      {groupedByYear.length === 0 ? (
        <div className="empty-state">
          <p>No articles match your search criteria.</p>
        </div>
      ) : (
        <div>
          {groupedByYear.map(([year, posts]) => (
            <div key={year} className="blog-year-group">
              <h3 className="blog-year-title">{year}</h3>
              <div className="blog-list">
                {posts.map((post) => (
                  <div
                    key={post.slug}
                    className="card blog-card"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <div className="blog-card-meta">
                      <span className="blog-card-date">
                        <FiCalendar style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {post.date}
                      </span>
                      {post.readTime && (
                        <span className="blog-card-readtime">
                          <FiClock style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {post.readTime}
                        </span>
                      )}
                      <div className="blog-card-stats">
                        <span className="blog-card-stat-item" title={`${(postStats[post.slug]?.views ?? 0).toLocaleString()} views`}>
                          <FiEye style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--secondary)' }} />
                          {(postStats[post.slug]?.views ?? 0).toLocaleString()}
                        </span>
                        <span className="blog-card-stat-item" title={`${(postStats[post.slug]?.likes ?? 0).toLocaleString()} likes`}>
                          <FiHeart style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--heart-color)' }} />
                          {(postStats[post.slug]?.likes ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <h4>{post.title}</h4>
                    <p>{post.excerpt}</p>

                    <div className="blog-card-tags">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="tag"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
