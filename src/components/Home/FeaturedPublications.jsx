import React from 'react';
import { Link } from 'react-router-dom';
import publicationsData from '../../data/publications.json';
import PublicationEntry from '../Shared/PublicationEntry';

export default function FeaturedPublications() {
  const featured = publicationsData.filter((p) => p.featured);

  return (
    <section className="section">
      <div className="container">
        <header className="section-head">
          <div className="section-head-row">
            <div>
              <h2>Recent Publications</h2>
              <p className="section-lede">Selected peer-reviewed papers and conference contributions.</p>
            </div>
            <Link to="/research" className="text-link">
              All Publications
            </Link>
          </div>
        </header>

        <div>
          <div>
            {featured.map((pub) => (
              <PublicationEntry key={pub.id} pub={pub} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
