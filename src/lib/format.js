/** Parse a YYYY-MM-DD date as a local calendar date (no timezone shift). */
function toLocalDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** "October 9, 2026" */
export function formatLongDate(iso) {
  return toLocalDate(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** "Oct 9" */
export function formatShortDate(iso) {
  return toLocalDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** 1 → "1 view", 1200 → "1,200 views" */
export function plural(n, word) {
  return `${n.toLocaleString()} ${word}${n === 1 ? '' : 's'}`;
}

/** Remove a leading frontmatter block from a Markdown file. */
export function stripFrontmatter(markdown) {
  return markdown.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '');
}

/** Copy text, falling back to a hidden textarea where the Clipboard API is unavailable. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
