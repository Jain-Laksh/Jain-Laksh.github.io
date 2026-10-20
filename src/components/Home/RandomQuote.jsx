import React, { useState } from 'react';
import { FaQuoteLeft } from 'react-icons/fa6';
import { FiRefreshCw } from 'react-icons/fi';
import quotesData from '../../data/quotes.json';

export default function RandomQuote() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotesData.length));
  const [rotating, setRotating] = useState(false);

  const nextQuote = () => {
    setRotating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % quotesData.length);
      setRotating(false);
    }, 200);
  };

  const currentQuote = quotesData[index] || '';

  return (
    <section className="quote-section">
      <div className="container">
        <div className="quote-icon">
          <FaQuoteLeft />
        </div>
        <p className={`quote-text ${rotating ? 'fade-out' : ''}`}>
          "{currentQuote}"
        </p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <button
            onClick={nextQuote}
            className="btn btn-ghost btn-sm"
            title="Get another quote"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FiRefreshCw className={rotating ? 'spin' : ''} />
            <span>Another thought</span>
          </button>
        </div>
      </div>
    </section>
  );
}
