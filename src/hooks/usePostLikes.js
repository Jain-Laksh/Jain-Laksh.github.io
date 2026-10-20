import { useState, useEffect, useCallback, useRef } from 'react';

const COUNTER_API_BASE = 'https://abacus.jasoncameron.dev';
const COUNTER_LIKES_NAMESPACE = 'lakshjain-blog-likes';
const COUNTER_VIEWS_NAMESPACE = 'lakshjain-blog-views';

// In-memory sets to prevent duplicate hits and race conditions
const inMemoryContributedLikes = new Set();
const inFlightViewHits = new Set();

// One-time cache reset for legacy mock/test counts so counts start fresh at true zero
if (typeof window !== 'undefined') {
  try {
    const RESET_VERSION = 'portfolio_reset_v20261020_v1';
    if (!localStorage.getItem(RESET_VERSION)) {
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith('portfolio_likes_count_') ||
          key.startsWith('portfolio_views_count_') ||
          key.startsWith('portfolio_cloud_hits_') ||
          key.startsWith('portfolio_has_contributed_') ||
          key.startsWith('portfolio_liked_')
        ) {
          localStorage.removeItem(key);
        }
      });
      try {
        sessionStorage.clear();
      } catch (e) {}
      localStorage.setItem(RESET_VERSION, 'true');
    }
  } catch (e) {
    // Ignore storage errors in restricted contexts
  }
}

/**
 * Helper to compute total likes consistently:
 * - initialLikes: baseline (defaults to 0)
 * - cloudHits: total likes registered in the cloud API
 * - isLiked: current user's active like state (true/false)
 * - hasContributed: whether current user's like is already part of cloudHits
 */
function computeLikes(initialLikes = 0, cloudHits = 0, isLiked = false, hasContributed = false) {
  let count = (initialLikes || 0) + (cloudHits || 0);
  if (hasContributed && !isLiked) {
    count = Math.max(0, count - 1);
  }
  return Math.max(0, count);
}

/**
 * Hook to manage likes for a blog post with:
 * 1. Global cloud counter API synchronization across all visitors worldwide (starting from 0)
 * 2. Anti-spam / anti-hack protection (each visitor can only contribute 1 cloud hit)
 * 3. Instant optimistic UI updates & local storage persistence
 * 4. Real-time cross-component & cross-tab synchronization
 *
 * @param {string} slug - The blog post unique slug identifier.
 * @param {number} initialLikes - Baseline like count (defaults to 0).
 */
export function usePostLikes(slug, initialLikes = 0) {
  const [likes, setLikes] = useState(() => {
    if (!slug) return initialLikes;
    try {
      const storedCount = localStorage.getItem(`portfolio_likes_count_${slug}`);
      if (storedCount !== null) {
        const parsed = parseInt(storedCount, 10);
        return !isNaN(parsed) ? parsed : initialLikes;
      }
    } catch (e) {
      // ignore
    }
    return initialLikes;
  });

  const [isLiked, setIsLiked] = useState(() => {
    if (!slug) return false;
    try {
      return localStorage.getItem(`portfolio_liked_${slug}`) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [animating, setAnimating] = useState(false);
  const likesRef = useRef(likes);
  likesRef.current = likes;

  // Fetch latest global likes from the Counter API
  const fetchCloudLikes = useCallback(async () => {
    if (!slug) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(
        `${COUNTER_API_BASE}/get/${COUNTER_LIKES_NAMESPACE}/${slug}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      let cloudHits = 0;
      if (res.ok) {
        const data = await res.json();
        cloudHits = typeof data.value === 'number' ? data.value : 0;
      } else if (res.status === 404) {
        // 404 on Abacus means key does not exist yet -> true 0 count
        cloudHits = 0;
      } else {
        // Network or server error -> retain current state
        return;
      }

      try {
        localStorage.setItem(`portfolio_cloud_hits_${slug}`, cloudHits.toString());
      } catch (e) {}

      const userLikedLocally = localStorage.getItem(`portfolio_liked_${slug}`) === 'true';
      const hasContributedLocally =
        localStorage.getItem(`portfolio_has_contributed_${slug}`) === 'true' ||
        inMemoryContributedLikes.has(slug);

      const total = computeLikes(
        initialLikes,
        cloudHits,
        userLikedLocally,
        hasContributedLocally
      );

      setLikes(total);
      try {
        localStorage.setItem(`portfolio_likes_count_${slug}`, total.toString());
      } catch (e) {}
    } catch (err) {
      // Graceful offline fallback: keep cached/local state
    }
  }, [slug, initialLikes]);

  // Sync state if slug changes or if storage changes in another component or tab
  useEffect(() => {
    if (!slug) return;

    try {
      const storedCount = localStorage.getItem(`portfolio_likes_count_${slug}`);
      if (storedCount !== null) {
        const parsed = parseInt(storedCount, 10);
        if (!isNaN(parsed)) setLikes(parsed);
      } else {
        setLikes(initialLikes);
      }

      const liked = localStorage.getItem(`portfolio_liked_${slug}`) === 'true';
      setIsLiked(liked);
    } catch (e) {
      // ignore
    }

    // Fetch latest global count on mount
    fetchCloudLikes();

    const handleSync = (e) => {
      const eventSlug =
        e.detail?.slug ||
        (e.key ? e.key.replace(/^portfolio_(liked|likes_count)_/, '') : null);

      if (eventSlug && eventSlug === slug) {
        try {
          const updatedCount = localStorage.getItem(`portfolio_likes_count_${slug}`);
          if (updatedCount !== null) {
            const parsed = parseInt(updatedCount, 10);
            if (!isNaN(parsed)) setLikes(parsed);
          }
          setIsLiked(localStorage.getItem(`portfolio_liked_${slug}`) === 'true');
        } catch (err) {
          // ignore
        }
      }
    };

    // Re-fetch when user returns to the page tab to get latest likes from others
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCloudLikes();
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('portfolio_like_change', handleSync);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('portfolio_like_change', handleSync);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [slug, initialLikes, fetchCloudLikes]);

  const toggleLike = useCallback(() => {
    if (!slug) return;

    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    const nextLiked = !isLiked;

    // Check if this visitor has ALREADY contributed a like to the cloud API
    const hasContributed =
      localStorage.getItem(`portfolio_has_contributed_${slug}`) === 'true' ||
      inMemoryContributedLikes.has(slug);

    // Stored cloud hits from previous fetch
    let currentCloudHits = 0;
    try {
      const storedHits = localStorage.getItem(`portfolio_cloud_hits_${slug}`);
      if (storedHits !== null) {
        currentCloudHits = parseInt(storedHits, 10) || 0;
      }
    } catch (e) {}

    // CRITICAL ANTI-HACK PROTECTION:
    // Only send a /hit request to the cloud counter ONCE per visitor!
    const shouldSendCloudHit = nextLiked && !hasContributed;

    if (shouldSendCloudHit) {
      inMemoryContributedLikes.add(slug);
      try {
        localStorage.setItem(`portfolio_has_contributed_${slug}`, 'true');
      } catch (e) {}
    }

    const effectiveCloudHits = shouldSendCloudHit ? currentCloudHits + 1 : currentCloudHits;
    const nextLikes = computeLikes(
      initialLikes,
      effectiveCloudHits,
      nextLiked,
      hasContributed || shouldSendCloudHit
    );

    setIsLiked(nextLiked);
    setLikes(nextLikes);

    try {
      localStorage.setItem(`portfolio_liked_${slug}`, nextLiked ? 'true' : 'false');
      localStorage.setItem(`portfolio_likes_count_${slug}`, nextLikes.toString());
      if (shouldSendCloudHit) {
        localStorage.setItem(`portfolio_cloud_hits_${slug}`, effectiveCloudHits.toString());
      }

      // Broadcast to other components in the same window (e.g. top & bottom buttons)
      window.dispatchEvent(
        new CustomEvent('portfolio_like_change', {
          detail: { slug, likes: nextLikes, isLiked: nextLiked },
        })
      );
    } catch (err) {
      console.warn('Failed to save like state to localStorage:', err);
    }

    // Fire cloud hit ONCE if this is the visitor's first time liking
    if (shouldSendCloudHit) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      fetch(`${COUNTER_API_BASE}/hit/${COUNTER_LIKES_NAMESPACE}/${slug}`, {
        signal: controller.signal,
      })
        .then((res) => {
          clearTimeout(timeoutId);
          if (res.ok) return res.json();
          throw new Error('Hit request failed');
        })
        .then((data) => {
          if (data && typeof data.value === 'number') {
            const syncedCloudHits = data.value;
            try {
              localStorage.setItem(`portfolio_cloud_hits_${slug}`, syncedCloudHits.toString());
            } catch (e) {}
            const syncedTotal = computeLikes(initialLikes, syncedCloudHits, true, true);
            setLikes(syncedTotal);
            try {
              localStorage.setItem(`portfolio_likes_count_${slug}`, syncedTotal.toString());
              window.dispatchEvent(
                new CustomEvent('portfolio_like_change', {
                  detail: { slug, likes: syncedTotal, isLiked: true },
                })
              );
            } catch (e) {}
          }
        })
        .catch(() => {
          // Graceful fallback: local optimistic update remains valid
        });
    }

    return nextLiked;
  }, [slug, isLiked, initialLikes]);

  return {
    likes,
    isLiked,
    toggleLike,
    animating,
  };
}

/**
 * Hook to manage views for a blog post with:
 * 1. Global cloud counter API tracking (starting from 0, session-deduplicated hits)
 * 2. Caching in localStorage for instant rendering
 *
 * @param {string} slug - The blog post unique slug identifier.
 * @param {number} initialViews - Baseline view count (defaults to 0).
 */
export function usePostViews(slug, initialViews = 0) {
  const [views, setViews] = useState(() => {
    if (!slug) return initialViews;
    try {
      const stored = localStorage.getItem(`portfolio_views_count_${slug}`);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        return !isNaN(parsed) ? parsed : initialViews;
      }
    } catch (e) {}
    return initialViews;
  });

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    const sessionKey = `portfolio_viewed_session_${slug}`;
    let alreadyViewed = false;

    try {
      alreadyViewed =
        sessionStorage.getItem(sessionKey) === 'true' || inFlightViewHits.has(slug);
      if (!alreadyViewed) {
        // Synchronously claim session lock BEFORE network fetch to prevent double hit in React StrictMode
        sessionStorage.setItem(sessionKey, 'true');
        inFlightViewHits.add(slug);
      }
    } catch (e) {
      alreadyViewed = inFlightViewHits.has(slug);
      inFlightViewHits.add(slug);
    }

    // If not yet counted in this browser session, trigger hit (increment), else just get
    const endpoint = alreadyViewed
      ? `${COUNTER_API_BASE}/get/${COUNTER_VIEWS_NAMESPACE}/${slug}`
      : `${COUNTER_API_BASE}/hit/${COUNTER_VIEWS_NAMESPACE}/${slug}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    fetch(endpoint, { signal: controller.signal })
      .then(async (res) => {
        clearTimeout(timeoutId);
        if (res.ok) return res.json();
        // 404 on Abacus means key does not exist yet -> true 0 count
        if (res.status === 404) return { value: 0 };
        throw new Error('Views request failed');
      })
      .then((data) => {
        if (!isMounted) return;
        if (data && typeof data.value === 'number') {
          const totalViews = (initialViews || 0) + data.value;
          setViews(totalViews);
          try {
            localStorage.setItem(`portfolio_views_count_${slug}`, totalViews.toString());
          } catch (e) {}
        }
      })
      .catch(() => {
        // Fallback: if offline, track session view locally once
        if (!alreadyViewed) {
          setViews((prev) => {
            const next = prev + 1;
            try {
              localStorage.setItem(`portfolio_views_count_${slug}`, next.toString());
            } catch (e) {}
            return next;
          });
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [slug, initialViews]);

  return { views };
}

/**
 * Utility function to get the current stored like count for a post.
 */
export function getStoredLikes(slug, initialLikes = 0) {
  if (!slug) return initialLikes;
  try {
    const stored = localStorage.getItem(`portfolio_likes_count_${slug}`);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (err) {
    // ignore
  }
  return initialLikes;
}

/**
 * Utility function to get the current stored views count for a post.
 */
export function getStoredViews(slug, initialViews = 0) {
  if (!slug) return initialViews;
  try {
    const stored = localStorage.getItem(`portfolio_views_count_${slug}`);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (err) {
    // ignore
  }
  return initialViews;
}

/**
 * Hook to retrieve and live-sync likes and views stats for all posts on the blog index page.
 */
export function useBlogListStats(posts) {
  const [stats, setStats] = useState(() => {
    const map = {};
    if (Array.isArray(posts)) {
      posts.forEach((p) => {
        map[p.slug] = {
          likes: getStoredLikes(p.slug, 0),
          views: getStoredViews(p.slug, 0),
        };
      });
    }
    return map;
  });

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!Array.isArray(posts) || posts.length === 0) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let isMounted = true;

    Promise.all(
      posts.map(async (post) => {
        const slug = post.slug;
        if (!slug) return null;

        let cloudLikes = 0;
        let cloudViews = 0;

        try {
          const lRes = await fetch(`${COUNTER_API_BASE}/get/${COUNTER_LIKES_NAMESPACE}/${slug}`);
          if (lRes.ok) {
            const data = await lRes.json();
            if (typeof data.value === 'number') cloudLikes = data.value;
          }
        } catch (e) {}

        try {
          const vRes = await fetch(`${COUNTER_API_BASE}/get/${COUNTER_VIEWS_NAMESPACE}/${slug}`);
          if (vRes.ok) {
            const data = await vRes.json();
            if (typeof data.value === 'number') cloudViews = data.value;
          }
        } catch (e) {}

        const userLikedLocally = localStorage.getItem(`portfolio_liked_${slug}`) === 'true';
        const hasContributedLocally =
          localStorage.getItem(`portfolio_has_contributed_${slug}`) === 'true' ||
          inMemoryContributedLikes.has(slug);
        const totalLikes = computeLikes(0, cloudLikes, userLikedLocally, hasContributedLocally);

        try {
          localStorage.setItem(`portfolio_likes_count_${slug}`, totalLikes.toString());
          localStorage.setItem(`portfolio_views_count_${slug}`, cloudViews.toString());
        } catch (e) {}

        return { slug, likes: totalLikes, views: cloudViews };
      })
    ).then((results) => {
      if (!isMounted) return;
      const nextMap = {};
      results.forEach((item) => {
        if (item) {
          nextMap[item.slug] = { likes: item.likes, views: item.views };
        }
      });
      setStats((prev) => ({ ...prev, ...nextMap }));
    });

    const handleSync = (e) => {
      const eventSlug = e.detail?.slug;
      if (eventSlug && e.detail?.likes !== undefined) {
        setStats((prev) => ({
          ...prev,
          [eventSlug]: {
            views: prev[eventSlug]?.views ?? getStoredViews(eventSlug, 0),
            likes: e.detail.likes,
          },
        }));
      }
    };

    window.addEventListener('portfolio_like_change', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('portfolio_like_change', handleSync);
    };
  }, [posts]);

  return stats;
}

