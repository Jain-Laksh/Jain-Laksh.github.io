import React, { useState } from 'react';
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
    <section className="quote">
      <div className="container">
        <div className="quote-inner">
          <blockquote className={`quote-text ${rotating ? 'is-fading' : ''}`} aria-live="polite">
            "{currentQuote}"
          </blockquote>
          <button
            type="button"
            onClick={nextQuote}
            className="btn btn-quiet btn-sm quote-btn"
            title="Get another quote"
          >
            <FiRefreshCw className={rotating ? 'spin' : ''} />
            <span>Another thought</span>
          </button>
        </div>
      </div>
    </section>
  );
}
