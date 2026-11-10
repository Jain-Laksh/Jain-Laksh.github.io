import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import { PageHead } from '../components/Shared/PageHead';

export default function Gallery() {
  return (
    <div className="container page">
      {/* Back Link */}
      <Link to="/" className="back-link">
        <FiArrowLeft />
        <span>Back to Home</span>
      </Link>

      <PageHead label="Visual Journal" title="Gallery">
        Curated photos and visual highlights from academia, competitions, and life.
      </PageHead>

      <div className="margin-grid">
        <div aria-hidden="true" />
        <div className="wip-panel">
          <div className="wip-frames" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div>
            <span className="wip-status">
              <FiClock />
              <span>Work in Progress</span>
            </span>

            <h2>Coming soon</h2>

            <p>
              This gallery space is currently under construction and will be updated soon with photo highlights from
              research conferences, campus moments, and projects. Stay tuned!
            </p>

            <div className="wip-actions">
              <Link to="/" className="btn btn-solid btn-sm">
                <span>Back to Home</span>
              </Link>
              <Link to="/research" className="btn btn-line btn-sm">
                <span>Explore Research</span>
              </Link>
              <Link to="/projects" className="btn btn-quiet btn-sm">
                <span>View Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
