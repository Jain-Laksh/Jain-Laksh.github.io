/**
 * Blog likes & views, backed by the free Abacus counter API (https://abacus.jasoncameron.dev).
 *
 * Abacus counters can only go up without an admin key (which must never ship in a public
 * site), so likes use two counters per post: `likes` and `unlikes`. The number shown is
 * likes − unlikes. Each browser remembers what it wants (liked or not) and what the server
 * already reflects for it, and only sends a hit when those differ — so toggling any number
 * of times nets out correctly for every visitor.
 *
 * Real-world cases handled:
 * - Unlike is visible to everyone (not just the person who unliked).
 * - A like made while offline / blocked / rate-limited is kept and retried later
 *   (on reconnect, on the next visit, or when the tab is closed via keepalive).
 * - Rapid like/unlike clicks are merged into one request.
 * - Two open tabs can't double-count (Web Locks + storage events keep them in sync).
 * - Abacus allows 30 requests / 10 s per visitor: requests are queued under that budget,
 *   429s pause the queue, and the Posts page only loads counts for rows on screen.
 * - Views count once per browser per post per 24 h, only for real posts, only once the
 *   tab is actually visible, and never for bots/headless browsers.
 * - Nothing is written from localhost or dev builds, so local testing never changes the
 *   live numbers.
 * - Failed requests never overwrite known counts with 0; storage can be unavailable
 *   (private mode) without breaking anything.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const API = 'https://abacus.jasoncameron.dev';
const PREFIX = import.meta.env.VITE_STATS_NAMESPACE || 'lakshjain-blog';
const NS = {
  likes: `${PREFIX}-likes`,
  unlikes: `${PREFIX}-unlikes`,
  views: `${PREFIX}-views`,
};
const FIELDS = ['likes', 'unlikes', 'views'];

const VIEW_WINDOW_MS = 24 * 60 * 60 * 1000;
const STATS_TTL_MS = 60 * 1000;
const REQUEST_TIMEOUT_MS = 6000;
const RATE_WINDOW_MS = 10 * 1000;
const RATE_BUDGET = 24; // Abacus allows 30 per 10 s; keep headroom
const MAX_CONCURRENT = 4;

const hasWindow = typeof window !== 'undefined';
const host = hasWindow ? window.location.hostname : '';
const IS_LOCAL =
  !host ||
  host === 'localhost' ||
  host === '127.0.0.1' ||
  host === '[::1]' ||
  host.endsWith('.local') ||
  /^(10|192\.168|172\.(1[6-9]|2\d|3[01]))\./.test(host);
const IS_BOT =
  hasWindow &&
  (navigator.webdriver ||
    /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|lighthouse|headless|prerender|preview/i.test(
      navigator.userAgent || ''
    ));

/** Whether this page load may change the live counters. */
export const STATS_WRITABLE =
  import.meta.env.VITE_STATS_FORCE_WRITES === 'true' || (import.meta.env.PROD && !IS_LOCAL && !IS_BOT);

/* ---------------------------------------------------------------- storage */

const memory = new Map();
const storage = {
  get(key) {
    if (memory.has(key)) return memory.get(key);
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    memory.set(key, value);
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* private mode / quota: memory copy still works for this visit */
    }
  },
  /** Re-read a key from localStorage (another tab may have changed it); keeps memory if unavailable. */
  refresh(key) {
    try {
      const value = window.localStorage.getItem(key);
      if (value === null) memory.delete(key);
      else memory.set(key, value);
    } catch {
      /* storage unavailable: memory is the only copy */
    }
  },
  keys() {
    try {
      return Object.keys(window.localStorage);
    } catch {
      return [...memory.keys()];
    }
  },
};

function readJSON(key) {
  const raw = storage.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const statsKey = (slug) => `pstats:${slug}`;
const likeKey = (slug) => `plike:${slug}`;
const viewKey = (slug) => `pview:${slug}`;

/* ---------------------------------------------------------------- store */

const listeners = new Set();
let version = 0;
function emit() {
  version += 1;
  listeners.forEach((l) => l());
}
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
const getVersion = () => version;

const statsCache = new Map(); // slug -> { likes, unlikes, views, at }
const likeCache = new Map(); // slug -> { want, synced }

function getStats(slug) {
  if (!statsCache.has(slug)) {
    const cached = readJSON(statsKey(slug));
    statsCache.set(slug, {
      likes: typeof cached?.likes === 'number' ? cached.likes : null,
      unlikes: typeof cached?.unlikes === 'number' ? cached.unlikes : null,
      views: typeof cached?.views === 'number' ? cached.views : null,
      at: typeof cached?.at === 'number' ? cached.at : 0,
    });
  }
  return statsCache.get(slug);
}

function setStats(slug, patch) {
  const next = { ...getStats(slug), ...patch };
  statsCache.set(slug, next);
  storage.set(statsKey(slug), JSON.stringify(next));
  emit();
}

function getLikeState(slug) {
  if (!likeCache.has(slug)) {
    let state = readJSON(likeKey(slug));
    if (!state) {
      // Migrate from the previous implementation's keys
      const liked = storage.get(`portfolio_liked_${slug}`) === 'true';
      const contributed = storage.get(`portfolio_has_contributed_${slug}`) === 'true';
      state = { want: liked, synced: contributed };
    }
    // `sending` is set just before a request goes out. If it is still set when read back
    // (the tab closed mid-request, or a keepalive request on close), the request most
    // likely reached the server — assume it did, so it is never sent twice.
    const synced = typeof state.sending === 'boolean' ? state.sending : Boolean(state.synced);
    likeCache.set(slug, { want: Boolean(state.want), synced, sending: null });
  }
  return likeCache.get(slug);
}

function setLikeState(slug, state) {
  likeCache.set(slug, state);
  storage.set(likeKey(slug), JSON.stringify(state));
  emit();
}

/** Counters only ever increase, so a fresh cache never needs to go down. */
function mergeCount(current, incoming, cacheIsFresh) {
  if (typeof incoming !== 'number') return current;
  if (cacheIsFresh && typeof current === 'number') return Math.max(current, incoming);
  return incoming;
}

/* ---------------------------------------------------------------- request queue */

const queue = [];
const sentAt = [];
let active = 0;
let pausedUntil = 0;
let pumpTimer = null;

function pump() {
  if (pumpTimer) return;
  while (active < MAX_CONCURRENT && queue.length) {
    const now = Date.now();
    while (sentAt.length && now - sentAt[0] > RATE_WINDOW_MS) sentAt.shift();
    const wait = Math.max(
      pausedUntil - now,
      sentAt.length >= RATE_BUDGET ? sentAt[0] + RATE_WINDOW_MS - now : 0
    );
    if (wait > 0) {
      pumpTimer = setTimeout(() => {
        pumpTimer = null;
        pump();
      }, wait + 25);
      return;
    }
    const item = queue.shift();
    active += 1;
    sentAt.push(now);
    item
      .run()
      .then(item.resolve, item.reject)
      .finally(() => {
        active -= 1;
        pump();
      });
  }
}

function enqueue(run, { priority = false } = {}) {
  return new Promise((resolve, reject) => {
    const item = { run, resolve, reject };
    if (priority) queue.unshift(item);
    else queue.push(item);
    pump();
  });
}

/** Abacus keys: 3–64 chars of [A-Za-z0-9_-]. */
function counterKey(slug) {
  let key = String(slug).replace(/[^A-Za-z0-9_-]/g, '-');
  if (key.length > 64) {
    let h = 5381;
    for (let i = 0; i < slug.length; i++) h = ((h << 5) + h + slug.charCodeAt(i)) >>> 0;
    key = `${key.slice(0, 55)}-${h.toString(36)}`.slice(0, 64);
  }
  return key.padEnd(3, '-');
}

/**
 * `notCounted: true` means the server certainly did not count the request (rejected,
 * or never reached). `false` means it may have (e.g. timed out after sending).
 */
function counterError(message, notCounted) {
  const err = new Error(message);
  err.notCounted = notCounted;
  return err;
}

async function callCounter(op, field, slug, { keepalive = false } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${API}/${op}/${NS[field]}/${counterKey(slug)}`, {
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
      keepalive,
    });
  } catch (err) {
    throw err?.name === 'AbortError'
      ? counterError('timed out', false)
      : counterError('network error', true); // offline, DNS, blocked by an extension
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 404 && op === 'get') return 0; // counter not created yet
  if (res.status === 429) {
    const retryAfter = parseFloat(res.headers.get('Retry-After'));
    pausedUntil = Date.now() + (Number.isFinite(retryAfter) ? retryAfter * 1000 : RATE_WINDOW_MS);
    throw counterError('rate limited', true);
  }
  if (!res.ok) throw counterError(`HTTP ${res.status}`, true);
  const data = await res.json().catch(() => null);
  if (typeof data?.value !== 'number') throw counterError('unexpected response', false);
  return data.value;
}

/* ---------------------------------------------------------------- loading */

const loading = new Map();

export function loadStats(slug, { force = false, priority = false } = {}) {
  if (!slug || !hasWindow) return Promise.resolve();
  const cached = getStats(slug);
  if (!force && Date.now() - cached.at < STATS_TTL_MS) return Promise.resolve();
  if (loading.has(slug)) return loading.get(slug);

  const promise = Promise.allSettled(
    FIELDS.map((field) => enqueue(() => callCounter('get', field, slug), { priority }))
  )
    .then((results) => {
      const current = getStats(slug);
      const fresh = Date.now() - current.at < 10 * STATS_TTL_MS;
      const patch = {};
      let ok = false;
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          ok = true;
          patch[FIELDS[i]] = mergeCount(current[FIELDS[i]], r.value, fresh);
        }
      });
      if (ok) setStats(slug, { ...patch, at: Date.now() });
    })
    .finally(() => loading.delete(slug));

  loading.set(slug, promise);
  return promise;
}

/* ---------------------------------------------------------------- likes */

export function selectLikes(slug) {
  const s = getStats(slug);
  const { want, synced } = getLikeState(slug);
  if (s.likes === null) {
    // Server count unknown (never loaded, or offline on first visit)
    return want ? 1 : null;
  }
  const net = s.likes - (s.unlikes ?? 0);
  return Math.max(0, net - (synced ? 1 : 0) + (want ? 1 : 0));
}

const syncTimers = new Map();
const retryTimers = new Map();
const syncing = new Set();

const LOCK_BUSY = Symbol('lock-busy');

function withLock(name, fn) {
  if (hasWindow && navigator.locks?.request) {
    return navigator.locks.request(name, { ifAvailable: true }, (lock) => (lock ? fn() : LOCK_BUSY));
  }
  return fn();
}

async function syncLike(slug, { keepalive = false, attempt = 0 } = {}) {
  if (!STATS_WRITABLE || syncing.has(slug)) return;
  syncing.add(slug);
  let succeeded = false;
  let busy = false;
  try {
    const result = await withLock(`portfolio-like-${slug}`, async () => {
      // Re-read: another tab may already have synced this post
      storage.refresh(likeKey(slug));
      likeCache.delete(slug);
      const state = getLikeState(slug);
      if (state.want === state.synced) {
        succeeded = true;
        return;
      }
      const target = state.want;
      const field = target ? 'likes' : 'unlikes';
      let value;
      try {
        value = await enqueue(
          () => {
            // Persist "sending" right before the request leaves (not while queued)
            setLikeState(slug, { ...getLikeState(slug), sending: target });
            return callCounter('hit', field, slug, { keepalive });
          },
          { priority: true }
        );
      } catch (err) {
        if (err?.notCounted) {
          setLikeState(slug, { ...getLikeState(slug), sending: null });
          throw err;
        }
        // Outcome unknown (timed out): assume it counted rather than risk counting twice
        setLikeState(slug, { ...getLikeState(slug), synced: target, sending: null });
        loadStats(slug, { force: true });
        succeeded = true;
        return;
      }
      setStats(slug, { [field]: Math.max(value, getStats(slug)[field] ?? 0) });
      setLikeState(slug, { ...getLikeState(slug), synced: target, sending: null });
      succeeded = true;
    });
    busy = result === LOCK_BUSY;
  } catch {
    // Kept as pending; retried with backoff, on reconnect, or on the next visit
    const delay = Math.min(5 * 60 * 1000, 15000 * 2 ** attempt);
    clearTimeout(retryTimers.get(slug));
    retryTimers.set(slug, setTimeout(() => syncLike(slug, { attempt: attempt + 1 }), delay));
  } finally {
    syncing.delete(slug);
  }
  // Another tab is syncing this post right now: check again once it is done
  if (busy) scheduleSync(slug, 2000);
  // The visitor may have toggled again while the request was in flight
  const latest = getLikeState(slug);
  if (succeeded && latest.want !== latest.synced) scheduleSync(slug, 0);
}

function scheduleSync(slug, delay = 800) {
  if (!STATS_WRITABLE) return;
  clearTimeout(syncTimers.get(slug));
  syncTimers.set(
    slug,
    setTimeout(() => {
      syncTimers.delete(slug);
      syncLike(slug);
    }, delay)
  );
}

function pendingLikeSlugs() {
  return storage
    .keys()
    .filter((k) => k.startsWith('plike:'))
    .map((k) => k.slice('plike:'.length))
    .filter((slug) => {
      const s = getLikeState(slug);
      return s.want !== s.synced;
    });
}

export function toggleLike(slug) {
  const state = getLikeState(slug);
  const next = { ...state, want: !state.want };
  setLikeState(slug, next);
  scheduleSync(slug);
  return next.want;
}

/* ---------------------------------------------------------------- views */

const viewsInFlight = new Set();

function recordView(slug) {
  if (!STATS_WRITABLE) {
    loadStats(slug, { priority: true });
    return undefined;
  }
  const lastCounted = () => {
    storage.refresh(viewKey(slug)); // another tab may have counted it
    return Number(storage.get(viewKey(slug))) || 0;
  };
  const alreadyCounted = () => Date.now() - lastCounted() < VIEW_WINDOW_MS || viewsInFlight.has(slug);

  if (alreadyCounted()) {
    loadStats(slug, { priority: true });
    return undefined;
  }

  const count = () => {
    // Checked again here: a background tab may become visible after another tab counted
    if (alreadyCounted()) {
      loadStats(slug, { priority: true });
      return;
    }
    const previous = lastCounted();
    viewsInFlight.add(slug);
    storage.set(viewKey(slug), String(Date.now())); // claim before the request (other tabs, re-renders)
    enqueue(() => callCounter('hit', 'views', slug), { priority: true })
      .then((value) => setStats(slug, { views: Math.max(value, getStats(slug).views ?? 0) }))
      .catch((err) => {
        // Release the claim only if the view certainly wasn't counted, so a later visit can count it
        if (err?.notCounted) storage.set(viewKey(slug), String(previous));
      })
      .finally(() => viewsInFlight.delete(slug));
    loadStats(slug, { priority: true });
  };

  if (document.visibilityState === 'visible') {
    count();
    return undefined;
  }
  // Opened in a background tab: count it once the visitor actually looks at it
  loadStats(slug);
  const onVisible = () => {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', onVisible);
    count();
  };
  document.addEventListener('visibilitychange', onVisible);
  return () => document.removeEventListener('visibilitychange', onVisible);
}

/* ---------------------------------------------------------------- global wiring */

if (hasWindow) {
  // Other tabs changed something: drop our copy so the next read sees theirs
  window.addEventListener('storage', (e) => {
    if (!e.key) return;
    const match = e.key.match(/^(pstats|plike):(.+)$/);
    if (!match) return;
    storage.refresh(e.key);
    (match[1] === 'pstats' ? statsCache : likeCache).delete(match[2]);
    emit();
  });

  if (STATS_WRITABLE) {
    const resume = () => pendingLikeSlugs().forEach((slug) => scheduleSync(slug, 0));
    window.addEventListener('online', resume);
    // Flush unsent likes when the page is being closed or hidden
    window.addEventListener('pagehide', () => {
      pendingLikeSlugs().forEach((slug) => {
        clearTimeout(syncTimers.get(slug));
        syncLike(slug, { keepalive: true });
      });
    });
    setTimeout(resume, 1500);
  }
}

/* ---------------------------------------------------------------- hooks */

function useStatsStore() {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}

/** Likes for one post: { likes (number|null), isLiked, toggleLike, animating }. */
export function usePostLikes(slug) {
  useStatsStore();
  const [animating, setAnimating] = useState(false);
  const animTimer = useRef(null);

  useEffect(() => {
    if (!slug) return;
    loadStats(slug, { priority: true });
    // e.g. a like state carried over from the old implementation, or one that never sent
    const state = getLikeState(slug);
    if (state.want !== state.synced) scheduleSync(slug, 0);
  }, [slug]);

  useEffect(() => () => clearTimeout(animTimer.current), []);

  const toggle = useCallback(() => {
    if (!slug) return false;
    setAnimating(true);
    clearTimeout(animTimer.current);
    animTimer.current = setTimeout(() => setAnimating(false), 600);
    return toggleLike(slug);
  }, [slug]);

  return {
    likes: slug ? selectLikes(slug) : null,
    isLiked: slug ? getLikeState(slug).want : false,
    toggleLike: toggle,
    animating,
  };
}

/** Views for one post. Pass a slug only for a post that exists; it is counted once per day. */
export function usePostViews(slug) {
  useStatsStore();
  useEffect(() => {
    if (!slug) return undefined;
    return recordView(slug);
  }, [slug]);
  return { views: slug ? getStats(slug).views : null };
}

/**
 * Likes & views for a row on the Posts page. Counts load when the row scrolls near
 * the viewport, so long lists stay inside the API's rate limit.
 */
export function usePostRowStats(slug) {
  useStatsStore();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!slug || !el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      loadStats(slug);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadStats(slug);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);

  return { ref, likes: selectLikes(slug), views: getStats(slug).views };
}
