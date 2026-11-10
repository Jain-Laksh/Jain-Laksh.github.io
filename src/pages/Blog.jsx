import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiHeart, FiEye } from 'react-icons/fi';
import postsData from '../data/posts.json';
import { useBlogListStats } from '../hooks/usePostLikes';
import { PageHead, FilterBar } from '../components/Shared/PageHead';

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

    Object.keys(groups).forEach((year) => {
      groups[year].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return Object.entries(groups).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));
  }, [filteredPosts]);

  const openPost = (slug) => navigate(`/blog/${slug}`);

  return (
    <div className="container page">
      <PageHead label="Thoughts & Tutorials" title="Posts">
        Writings on machine learning research, interview experiences, systems engineering, and technical tutorials.
      </PageHead>

      <FilterBar
        count={`Showing ${filteredPosts.length} of ${postsData.length} articles`}
        query={searchQuery}
        onQuery={setSearchQuery}
        placeholder="Search articles..."
        tags={allTags}
        selected={selectedTag}
        onSelect={setSelectedTag}
      />

      {groupedByYear.length === 0 ? (
        <div className="empty">
          <p>No articles match your search criteria.</p>
        </div>
      ) : (
        <div>
          {groupedByYear.map(([year, posts]) => (
            <section key={year} className="year-group" aria-label={`Posts from ${year}`}>
              <h2 className="year-label">{year}</h2>
              <div>
                {posts.map((post) => {
                  const views = (postStats[post.slug]?.views ?? 0).toLocaleString();
                  const likes = (postStats[post.slug]?.likes ?? 0).toLocaleString();
                  return (
                    <article
                      key={post.slug}
                      className="post-row"
                      role="link"
                      tabIndex={0}
                      onClick={() => openPost(post.slug)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') openPost(post.slug);
                      }}
                    >
                      <div className="post-row-meta">
                        <span>
                          <FiCalendar aria-hidden="true" />
                          {post.date}
                        </span>
                        {post.readTime && (
                          <span>
                            <FiClock aria-hidden="true" />
                            {post.readTime}
                          </span>
                        )}
                        <span className="post-row-stats">
                          <span title={`${views} views`}>
                            <FiEye aria-hidden="true" />
                            {views}
                          </span>
                          <span className="is-heart" title={`${likes} likes`}>
                            <FiHeart aria-hidden="true" />
                            {likes}
                          </span>
                        </span>
                      </div>

                      <h3 className="post-row-title">{post.title}</h3>
                      <p className="post-row-excerpt">{post.excerpt}</p>

                      <div className="chip-list post-row-tags">
                        {post.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className={`chip chip-button ${selectedTag === tag ? 'is-active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
