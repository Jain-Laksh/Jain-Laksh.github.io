import React from 'react';
import { FiSearch } from 'react-icons/fi';

export function PageHead({ label, title, children }) {
  return (
    <header className="page-head margin-grid">
      <p className="margin-label">{label}</p>
      <div>
        <h1>{title}</h1>
        {children && <p className="page-lede">{children}</p>}
      </div>
    </header>
  );
}

export function FilterBar({ count, query, onQuery, placeholder, tags, selected, onSelect }) {
  return (
    <div className="filter-bar">
      <p className="filter-count" aria-live="polite">
        {count}
      </p>
      <label className="search">
        <span className="sr-only">{placeholder}</span>
        <FiSearch aria-hidden="true" />
        <input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </label>
      <div className="filter-chips" role="group" aria-label="Filter by tag">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag)}
            className={`chip chip-button ${selected === tag ? 'is-active' : ''}`}
            aria-pressed={selected === tag}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
