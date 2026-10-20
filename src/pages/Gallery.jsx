import React from 'react';
import { Link } from 'react-router-dom';
import { FiImage, FiArrowLeft, FiClock } from 'react-icons/fi';

export default function Gallery() {
  return (
    <div
      className="container"
      style={{
        paddingTop: 'calc(var(--navbar-height) + var(--space-8))',
        paddingBottom: 'var(--space-20)',
      }}
    >
      {/* Back Link */}
      <Link to="/" className="back-link">
        <FiArrowLeft />
        <span>Back to Home</span>
      </Link>

      {/* Page Header */}
      <div className="page-header" style={{ paddingTop: 'var(--space-2)' }}>
        <span className="section-label">Visual Journal</span>
        <h1>Gallery</h1>
        <p className="page-subtitle">
          Curated photos and visual highlights from academia, competitions, and life.
        </p>
      </div>

      {/* Main Work In Progress Card */}
      <div
        className="card"
        style={{
          padding: 'var(--space-16) var(--space-8)',
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg-secondary) 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, var(--accent-alpha) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--primary-alpha)',
            color: 'var(--primary)',
            fontSize: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-6)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <FiImage />
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <span
            className="tag"
            style={{
              background: 'var(--tag-orange-bg)',
              color: 'var(--tag-orange-text)',
              fontSize: 'var(--fs-sm)',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FiClock />
            <span>Work in Progress</span>
          </span>
        </div>

        <h2 style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
          Will be implemented soon!
        </h2>

        <p
          style={{
            fontSize: 'var(--fs-md)',
            lineHeight: 'var(--lh-relaxed)',
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            margin: '0 auto var(--space-8)',
          }}
        >
          This gallery space is currently under construction and will be updated soon with photo highlights from research conferences, campus moments, and projects. Stay tuned!
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-sm">
            <span>Back to Home</span>
          </Link>
          <Link to="/research" className="btn btn-outline btn-sm">
            <span>Explore Research</span>
          </Link>
          <Link to="/projects" className="btn btn-ghost btn-sm">
            <span>View Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
