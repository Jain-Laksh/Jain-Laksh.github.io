import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiHeart, FiEye } from 'react-icons/fi';
import posts from 'virtual:posts';
import { usePostRowStats } from '../hooks/usePostLikes';
import { PageHead, FilterBar } from '../components/Shared/PageHead';
import { formatShortDate, plural } from '../lib/format';

function PostRow({ post, selectedTag, onTag }) {
  const { ref, likes, views } = usePostRowStats(post.slug);

  return (
    <article className="post-row" ref={ref}>
      <div className="post-row-meta">
        <time dateTime={post.date}>{formatShortDate(post.date)}</time>
        <span>
          <FiClock aria-hidden="true" />
          {post.readMinutes} min read
        </span>
        <span className="post-row-stats">
          {views !== null && (
            <span title={plural(views, 'view')}>
              <FiEye aria-hidden="true" />
              <span className="sr-only">Views: </span>
              {views.toLocaleString()}
            </span>
          )}
          {likes !== null && (
            <span className="is-heart" title={plural(likes, 'like')}>
              <FiHeart aria-hidden="true" />
              <span className="sr-only">Likes: </span>
              {likes.toLocaleString()}
            </span>
          )}
        </span>
      </div>

      <h3 className="post-row-title">
        <Link to={`/blog/${post.slug}`} className="post-row-link">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && <p className="post-row-excerpt">{post.excerpt}</p>}

      <div className="chip-list post-row-tags">
        {post.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`chip chip-button ${selectedTag === tag ? 'is-active' : ''}`}
            onClick={() => onTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </article>
  );
}

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach((post) => post.tags.forEach((t) => tags.add(t)));
    return ['All', ...Array.from(tags)];
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  }, [selectedTag, searchQuery]);

  // Posts arrive sorted newest first; group them by year
  const groupedByYear = useMemo(() => {
    const groups = new Map();
    filteredPosts.forEach((post) => {
      if (!groups.has(post.year)) groups.set(post.year, []);
      groups.get(post.year).push(post);
    });
    return [...groups.entries()];
  }, [filteredPosts]);

  const selectTag = (tag) => {
    setSelectedTag(tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container page">
      <PageHead title="Posts">
        Writings on machine learning research, interview experiences, systems engineering, and technical tutorials.
      </PageHead>

      <FilterBar
        count={`Showing ${filteredPosts.length} of ${posts.length} articles`}
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
          <div className="empty-actions">
            <button
              type="button"
              className="btn btn-line btn-sm"
              onClick={() => {
                setSelectedTag('All');
                setSearchQuery('');
              }}
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div>
          {groupedByYear.map(([year, yearPosts]) => (
            <section key={year} className="year-group" aria-label={`Posts from ${year}`}>
              <h2 className="year-label">{year}</h2>
              <div>
                {yearPosts.map((post) => (
                  <PostRow key={post.slug} post={post} selectedTag={selectedTag} onTag={selectTag} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
