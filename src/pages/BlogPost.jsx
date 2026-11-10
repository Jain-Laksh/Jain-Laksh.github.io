import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { FiArrowLeft, FiCalendar, FiClock, FiShare2, FiCheck, FiArrowUp, FiHeart, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import postsData from '../data/posts.json';
import { usePostLikes, usePostViews } from '../hooks/usePostLikes';

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [topFloatingHearts, setTopFloatingHearts] = useState([]);
  const [bottomFloatingHearts, setBottomFloatingHearts] = useState([]);

  const postMeta = useMemo(() => {
    return postsData.find((p) => p.slug === slug);
  }, [slug]);

  const { likes, isLiked, toggleLike, animating } = usePostLikes(
    slug,
    postMeta?.likes || 0
  );

  const { views } = usePostViews(slug, postMeta?.views || 0);

  const handleLike = (isTop = true) => {
    const newlyLiked = toggleLike();
    if (newlyLiked) {
      const hearts = Array.from({ length: 4 }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x: 15 + Math.random() * 70,
      }));
      if (isTop) {
        setTopFloatingHearts((prev) => [...prev, ...hearts]);
        setTimeout(() => {
          setTopFloatingHearts((prev) =>
            prev.filter((h) => !hearts.some((nh) => nh.id === h.id))
          );
        }, 1100);
      } else {
        setBottomFloatingHearts((prev) => [...prev, ...hearts]);
        setTimeout(() => {
          setBottomFloatingHearts((prev) =>
            prev.filter((h) => !hearts.some((nh) => nh.id === h.id))
          );
        }, 1100);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const markdownPath = `${baseUrl}/posts/${slug}.md`;

    fetch(markdownPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load post (${res.status})`);
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching markdown post:', err);
        setError('Could not load this blog post. Please check the URL.');
        setLoading(false);
      });
  }, [slug]);

  const getNodeText = (node) => {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (typeof node === 'object' && node.props && node.props.children) {
      return getNodeText(node.props.children);
    }
    return '';
  };

  const createSlug = (text) => {
    return String(text)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Extract table of contents from content
  const headings = useMemo(() => {
    if (!content) return [];
    const lines = content.split('\n');
    const items = [];
    const counts = {};
    const headingRegex = /^(#{2,3})\s+(.+)$/;

    lines.forEach((line) => {
      const match = line.match(headingRegex);
      if (match) {
        const level = match[1].length; // 2 or 3
        const title = match[2].trim().replace(/[*_`]/g, '');
        let id = createSlug(title) || 'section';
        if (counts[id] !== undefined) {
          counts[id]++;
          id = `${id}-${counts[id]}`;
        } else {
          counts[id] = 0;
        }
        items.push({ level, title, id });
      }
    });

    return items;
  }, [content]);

  const scrollToHeading = (id, title) => (e) => {
    e.preventDefault();
    let target = document.getElementById(id);

    // If ID lookup misses, fallback to matching heading text in the article
    if (!target && title) {
      const cleanTitle = title.trim().toLowerCase();
      const allHeadings = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
      for (const h of allHeadings) {
        if (h.textContent.trim().toLowerCase() === cleanTitle) {
          target = h;
          break;
        }
      }
    }

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <div className="loading-spinner" role="status" aria-label="Loading post" />
      </div>
    );
  }

  if (error || !postMeta) {
    return (
      <div className="container page">
        <Link to="/blog" className="back-link">
          <FiArrowLeft />
          <span>Back to all posts</span>
        </Link>
        <div className="empty">
          <h2>Post Not Found</h2>
          <p>{error || "The post you are looking for doesn't exist."}</p>
          <div style={{ marginTop: '24px' }}>
            <Link to="/blog" className="btn btn-solid">
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderHearts = (list) =>
    list.map((h) => (
      <span key={h.id} className="floating-heart" style={{ left: `${h.x}%` }} aria-hidden="true">
        ❤️
      </span>
    ));

  return (
    <div className="container page">
      <div className={`post-layout ${headings.length > 0 ? '' : 'no-toc'}`}>
        <div className="post-main">
          <Link to="/blog" className="back-link">
            <FiArrowLeft />
            <span>Back to all posts</span>
          </Link>

          <header className="post-head">
            <h1 className="post-title">{postMeta.title}</h1>
            <div className="post-meta">
              <span className="post-meta-item">
                <FiCalendar aria-hidden="true" />
                {postMeta.date}
              </span>
              {postMeta.readTime && (
                <span className="post-meta-item">
                  <FiClock aria-hidden="true" />
                  {postMeta.readTime}
                </span>
              )}

              {/* Views badge, like button with visible count & share */}
              <div className="post-actions">
                <div className="views-badge" title={`${views.toLocaleString()} total views`}>
                  <FiEye aria-hidden="true" />
                  <span>{views.toLocaleString()}</span>
                  <span className="views-label">views</span>
                </div>

                <button
                  id="top-like-button"
                  type="button"
                  onClick={() => handleLike(true)}
                  className={`like-btn ${isLiked ? 'liked' : ''} ${animating ? 'like-pop' : ''}`}
                  title={isLiked ? 'You liked this post! Click to unlike' : 'Like this post'}
                  aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                  aria-pressed={isLiked}
                >
                  <span className="like-icon">{isLiked ? <FaHeart /> : <FiHeart />}</span>
                  <span>{likes}</span>
                  {renderHearts(topFloatingHearts)}
                </button>

                <button type="button" onClick={handleShare} className="share-btn" title="Copy post link">
                  {copied ? <FiCheck className="is-ok" /> : <FiShare2 />}
                  <span>{copied ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            <ul className="chip-list post-tags">
              {postMeta.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          </header>

          <article className="markdown-body">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                h2: ({ node, children, ...props }) => {
                  const rawText = getNodeText(children).replace(/[*_`]/g, '');
                  const id = createSlug(rawText);
                  return (
                    <h2 {...props} id={id || props.id}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ node, children, ...props }) => {
                  const rawText = getNodeText(children).replace(/[*_`]/g, '');
                  const id = createSlug(rawText);
                  return (
                    <h3 {...props} id={id || props.id}>
                      {children}
                    </h3>
                  );
                },
                img: ({ node, src, alt, ...props }) => {
                  const resolvedSrc = src?.startsWith('http') || src?.startsWith('data:')
                    ? src
                    : `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${src?.replace(/^\.?\//, '')}`;
                  return <img {...props} src={resolvedSrc} alt={alt} loading="lazy" />;
                },
              }}
            >
              {content}
            </Markdown>
          </article>

          {/* End of post feedback & like */}
          <section className="feedback" aria-labelledby="feedback-title">
            <p className="feedback-kicker">Enjoyed this read?</p>
            <h2 id="feedback-title" className="feedback-title">Did this post help you?</h2>
            <p className="feedback-desc">
              If this article helped you prepare for your interviews, understand tricky concepts,
              or provided valuable insights, please consider giving it a like! It lets me know what
              topics you find most useful.
            </p>

            <div className="feedback-actions">
              <button
                type="button"
                onClick={() => handleLike(false)}
                className={`like-cta ${isLiked ? 'liked' : ''} ${animating ? 'like-pop' : ''}`}
                aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                aria-pressed={isLiked}
              >
                <span className="like-icon">{isLiked ? <FaHeart /> : <FiHeart />}</span>
                <span>{isLiked ? 'Liked — Thank you!' : 'Like this post'}</span>
                <span className="like-cta-count">{likes}</span>
                {renderHearts(bottomFloatingHearts)}
              </button>

              <button type="button" onClick={handleShare} className="btn btn-line" title="Share article link">
                {copied ? <FiCheck className="is-ok" /> : <FiShare2 />}
                <span>{copied ? 'Link Copied!' : 'Share Post'}</span>
              </button>
            </div>

            {isLiked && (
              <p className="feedback-thanks">🎉 Thank you for supporting this article! Your feedback means a lot.</p>
            )}
          </section>
        </div>

        {/* Table of Contents Sticky Sidebar */}
        {headings.length > 0 && (
          <aside className="toc" aria-label="Table of Contents">
            <h2 className="toc-title">Table of Contents</h2>
            <nav className="toc-list">
              {headings.map((h, idx) => (
                <a
                  key={idx}
                  href={`#${h.id}`}
                  onClick={scrollToHeading(h.id, h.title)}
                  className={`toc-link ${h.level === 3 ? 'toc-h3' : ''}`}
                >
                  {h.title}
                </a>
              ))}
            </nav>

            {/* Sidebar quick like & stats */}
            <div className="toc-actions">
              <div className="toc-views" title={`${views.toLocaleString()} total views`}>
                <FiEye aria-hidden="true" />
                <span>{views.toLocaleString()} views</span>
              </div>
              <button
                type="button"
                onClick={() => handleLike(true)}
                className={`toc-like ${isLiked ? 'liked' : ''} ${animating ? 'like-pop' : ''}`}
                title={isLiked ? 'You liked this post!' : 'Like this post'}
                aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
              >
                {isLiked ? <FaHeart /> : <FiHeart />}
                <span>
                  {likes} {likes === 1 ? 'like' : 'likes'}
                </span>
              </button>
              <button type="button" onClick={scrollToTop} className="toc-top" title="Scroll to top of post">
                <FiArrowUp />
                <span>Top</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
