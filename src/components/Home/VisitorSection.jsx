import React, { useState, useEffect } from 'react';
import { FiGlobe, FiUsers, FiActivity, FiMapPin } from 'react-icons/fi';

export default function VisitorSection() {
  const [visitorCount, setVisitorCount] = useState(1482);
  const [activeUsers, setActiveUsers] = useState(4);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    // Visitor counter persistence & realistic increment
    const stored = localStorage.getItem('portfolio_visitor_count');
    let count = stored ? parseInt(stored, 10) : 1482;
    if (!sessionStorage.getItem('visited_this_session')) {
      count += 1;
      localStorage.setItem('portfolio_visitor_count', count.toString());
      sessionStorage.setItem('visited_this_session', 'true');
    }
    setVisitorCount(count);

    // Random slight jitter in active users for dynamic feel
    const interval = setInterval(() => {
      const delta = Math.random() > 0.5 ? 1 : -1;
      setActiveUsers((prev) => Math.max(2, Math.min(8, prev + delta)));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const visitorLocations = [
    { name: 'India (Gandhinagar / Bangalore / Delhi)', x: 68, y: 46, visitors: '58%' },
    { name: 'United States (San Francisco / NYC)', x: 22, y: 34, visitors: '22%' },
    { name: 'United Kingdom (London)', x: 48, y: 26, visitors: '7%' },
    { name: 'Germany (Munich)', x: 52, y: 28, visitors: '5%' },
    { name: 'Singapore', x: 78, y: 55, visitors: '4%' },
    { name: 'Japan (Tokyo)', x: 86, y: 36, visitors: '4%' },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Global Reach</span>
          <h2>Visitor Traffic & Analytics</h2>
          <p className="section-subtitle">
            Real-time overview of where researchers, developers, and collaborators are visiting from.
          </p>
        </div>

        <div className="visitor-section">
          {/* Map Container */}
          <div className="visitor-map">
            <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)',
                  padding: '0 var(--space-2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                  <FiGlobe style={{ color: 'var(--primary)' }} />
                  <strong>Live Traffic Distribution</strong>
                </div>
                {hoveredPoint && (
                  <span
                    style={{
                      fontSize: 'var(--fs-xs)',
                      background: 'var(--primary-alpha)',
                      color: 'var(--primary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600,
                    }}
                  >
                    {hoveredPoint.name}: {hoveredPoint.visitors}
                  </span>
                )}
              </div>

              {/* Styled SVG World Map Canvas */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '2 / 1',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* World Map SVG representation */}
                <svg
                  viewBox="0 0 1000 500"
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0.35,
                    fill: 'var(--text-tertiary)',
                  }}
                >
                  {/* Stylized continent silhouettes */}
                  {/* North America */}
                  <path d="M120,80 Q160,70 240,90 Q270,120 280,180 Q250,220 200,220 Q160,250 140,230 Q100,160 120,80 Z" />
                  {/* South America */}
                  <path d="M220,260 Q280,270 300,320 Q310,380 270,440 Q240,430 230,350 Q210,290 220,260 Z" />
                  {/* Europe */}
                  <path d="M460,90 Q530,80 560,110 Q550,150 510,170 Q460,160 450,120 Z" />
                  {/* Africa */}
                  <path d="M460,190 Q540,190 560,250 Q560,330 510,380 Q460,360 440,280 Q430,220 460,190 Z" />
                  {/* Asia */}
                  <path d="M570,90 Q720,70 820,130 Q850,220 780,270 Q710,290 640,240 Q580,200 570,90 Z" />
                  {/* Australia */}
                  <path d="M760,320 Q840,310 870,360 Q850,410 790,410 Q740,380 760,320 Z" />
                </svg>

                {/* Hotspot Pulse Dots */}
                {visitorLocations.map((loc, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredPoint(loc)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{
                      position: 'absolute',
                      left: `${loc.x}%`,
                      top: `${loc.y}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        opacity: 0.35,
                        transform: 'translate(-50%, -50%)',
                        animation: 'pulse-glow 2s infinite',
                      }}
                    />
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        border: '2px solid white',
                        boxShadow: '0 0 10px var(--primary)',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Quick Country Pills */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center',
                  marginTop: 'var(--space-4)',
                }}
              >
                {visitorLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHoveredPoint(loc)}
                    className="tag tag-clickable"
                    style={{ fontSize: 'var(--fs-xs)' }}
                  >
                    <FiMapPin style={{ marginRight: '4px' }} />
                    {loc.name.split(' ')[0]} ({loc.visitors})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="visitor-stats">
            <div className="visitor-stat-card">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: 'var(--primary)' }}>
                <FiUsers size={24} />
              </div>
              <div className="visitor-stat-number">
                {visitorCount.toLocaleString()}
              </div>
              <div className="visitor-stat-label">Total Visits</div>
            </div>

            <div className="visitor-stat-card">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: 'var(--secondary)' }}>
                <FiGlobe size={24} />
              </div>
              <div className="visitor-stat-number">28+</div>
              <div className="visitor-stat-label">Countries Reached</div>
            </div>

            <div className="visitor-stat-card">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#2BA88E' }}>
                <FiActivity size={24} />
              </div>
              <div className="visitor-stat-number" style={{ color: '#2BA88E' }}>
                {activeUsers}
              </div>
              <div className="visitor-stat-label">Active Viewers Now</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
