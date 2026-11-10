import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { FiArrowLeft, FiCalendar, FiClock, FiShare2, FiCheck, FiArrowUp, FiHeart, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import posts from 'virtual:posts';
import { usePostLikes, usePostViews } from '../hooks/usePostLikes';
import { formatLongDate, plural, stripFrontmatter, copyText } from '../lib/format';
import profileData from '../data/profile.json';

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

const markdownComponents = {
  img: ({ node, src, alt, ...props }) => {
    const resolvedSrc =
      src?.startsWith('http') || src?.startsWith('data:') ? src : `${baseUrl}/${src?.replace(/^\.?\//, '')}`;
    return <img {...props} src={resolvedSrc} alt={alt || ''} loading="lazy" decoding="async" />;
  },
  a: ({ node, href, children, ...props }) => {
    const external = /^https?:\/\//.test(href || '');
    return (
      <a href={href} {...props} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const postMeta = posts.find((p) => p.slug === slug);

  const [content, setContent] = useState('');
  const [status, setStatus] = useState(postMeta ? 'loading' : 'missing'); // loading | ready | error | missing
  const [headings, setHeadings] = useState([]);
  const [shareState, setShareState] = useState('idle'); // idle | copied | failed
  const [topFloatingHearts, setTopFloatingHearts] = useState([]);
  const [bottomFloatingHearts, setBottomFloatingHearts] = useState([]);
  const articleRef = useRef(null);

  // Only real posts are tracked, so mistyped URLs never create counters
  const { likes, isLiked, toggleLike, animating } = usePostLikes(postMeta ? slug : null);
  const { views } = usePostViews(postMeta ? slug : null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeadings([]);
    setContent('');
    if (!postMeta) {
      setStatus('missing');
      return undefined;
    }
    setStatus('loading');
    const controller = new AbortController();

    fetch(`${baseUrl}/posts/${slug}.md`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load post (${res.status})`);
        return res.text();
      })
      .then((text) => {
        if (/^\s*<!doctype html/i.test(text)) throw new Error('Post file not found');
        setContent(stripFrontmatter(text));
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Error fetching markdown post:', err);
        setStatus('error');
      });

    return () => controller.abort();
  }, [slug, postMeta]);

  // Page title for tabs, bookmarks and shared links
  useEffect(() => {
    const previous = document.title;
    if (postMeta) document.title = `${postMeta.title} | ${profileData.name}`;
    return () => {
      document.title = previous;
    };
  }, [postMeta]);

  // Build the table of contents from the rendered headings, so ids always match
  useLayoutEffect(() => {
    if (status !== 'ready' || !articleRef.current) return;
    const found = [...articleRef.current.querySelectorAll('h2[id], h3[id]')].map((h) => ({
      id: h.id,
      title: h.textContent.trim(),
      level: h.tagName === 'H3' ? 3 : 2,
    }));
    setHeadings(found);
  }, [status, content]);

  const handleLike = (isTop = true) => {
    const newlyLiked = toggleLike();
    if (newlyLiked) {
      const hearts = Array.from({ length: 4 }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x: 15 + Math.random() * 70,
      }));
      const setter = isTop ? setTopFloatingHearts : setBottomFloatingHearts;
      setter((prev) => [...prev, ...hearts]);
      setTimeout(() => {
        setter((prev) => prev.filter((h) => !hearts.some((nh) => nh.id === h.id)));
      }, 1100);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToHeading = (id) => (e) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    // Native share sheet on phones; copy link elsewhere
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share({ title: postMeta.title, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    const ok = await copyText(url);
    setShareState(ok ? 'copied' : 'failed');
    setTimeout(() => setShareState('idle'), 2200);
  };

  const shareLabel = (idle) => (shareState === 'copied' ? 'Link Copied!' : shareState === 'failed' ? 'Copy failed' : idle);

  if (status === 'loading') {
    return (
      <div className="container page">
        <div className="loading-spinner" role="status" aria-label="Loading post" />
      </div>
    );
  }

  if (status === 'missing' || status === 'error') {
    return (
      <div className="container page">
        <Link to="/blog" className="back-link">
          <FiArrowLeft />
          <span>Back to all posts</span>
        </Link>
        <div className="empty">
          <h2>{status === 'missing' ? 'Post Not Found' : "This post didn't load"}</h2>
          <p>
            {status === 'missing'
              ? "The post you are looking for doesn't exist. Check the link, or browse all posts."
              : 'Check your connection and try again.'}
          </p>
          <div className="empty-actions">
            {status === 'error' && (
              <button type="button" className="btn btn-solid" onClick={() => window.location.reload()}>
                Try again
              </button>
            )}
            <Link to="/blog" className={`btn ${status === 'error' ? 'btn-line' : 'btn-solid'}`}>
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

  const tocLinks = headings.map((h) => (
    <a
      key={h.id}
      href={`#${h.id}`}
      onClick={scrollToHeading(h.id)}
      className={`toc-link ${h.level === 3 ? 'toc-h3' : ''}`}
    >
      {h.title}
    </a>
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
                <time dateTime={postMeta.date}>{formatLongDate(postMeta.date)}</time>
              </span>
              <span className="post-meta-item">
                <FiClock aria-hidden="true" />
                {postMeta.readMinutes} min read
              </span>

              <div className="post-actions">
                {views !== null && (
                  <span className="views-badge" title={plural(views, 'view')}>
                    <FiEye aria-hidden="true" />
                    <span>{views.toLocaleString()}</span>
                    <span className="views-label">{views === 1 ? 'view' : 'views'}</span>
                  </span>
                )}

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
                  <span>{likes ?? 'Like'}</span>
                  {renderHearts(topFloatingHearts)}
                </button>

                <button type="button" onClick={handleShare} className="share-btn" title="Share this post">
                  {shareState === 'copied' ? <FiCheck className="is-ok" /> : <FiShare2 />}
                  <span aria-live="polite">{shareLabel('Share')}</span>
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

          {headings.length > 0 && (
            <details className="toc-mobile">
              <summary>On this page</summary>
              <nav className="toc-list" aria-label="On this page">
                {tocLinks}
              </nav>
            </details>
          )}

          <article className="markdown-body" ref={articleRef}>
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={markdownComponents}
            >
              {content}
            </Markdown>
          </article>

          {/* End of post feedback & like */}
          <section className="feedback" aria-labelledby="feedback-title">
            <p className="feedback-kicker">Enjoyed this read?</p>
            <h2 id="feedback-title" className="feedback-title">
              Did this post help you?
            </h2>
            <p className="feedback-desc">
              If this article helped you prepare for your interviews, understand tricky concepts, or provided
              valuable insights, please consider giving it a like! It lets me know what topics you find most useful.
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
                {likes !== null && <span className="like-cta-count">{likes}</span>}
                {renderHearts(bottomFloatingHearts)}
              </button>

              <button type="button" onClick={handleShare} className="btn btn-line" title="Share this post">
                {shareState === 'copied' ? <FiCheck className="is-ok" /> : <FiShare2 />}
                <span>{shareLabel('Share Post')}</span>
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
            <nav className="toc-list">{tocLinks}</nav>

            <div className="toc-actions">
              {views !== null && (
                <div className="toc-views">
                  <FiEye aria-hidden="true" />
                  <span>{plural(views, 'view')}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleLike(true)}
                className={`toc-like ${isLiked ? 'liked' : ''} ${animating ? 'like-pop' : ''}`}
                title={isLiked ? 'You liked this post!' : 'Like this post'}
                aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                aria-pressed={isLiked}
              >
                {isLiked ? <FaHeart /> : <FiHeart />}
                <span>{likes === null ? 'Like' : plural(likes, 'like')}</span>
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
