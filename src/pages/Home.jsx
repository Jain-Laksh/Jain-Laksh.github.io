import React from 'react';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import WorkSummary from '../components/Home/WorkSummary';
import RecentNews from '../components/Home/RecentNews';
import FeaturedPublications from '../components/Home/FeaturedPublications';
import FeaturedProjects from '../components/Home/FeaturedProjects';
import Achievements from '../components/Home/Achievements';
import RandomQuote from '../components/Home/RandomQuote';

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <About />
      <RecentNews />
      <WorkSummary />
      <FeaturedPublications />
      <FeaturedProjects />
      <Achievements />
      <RandomQuote />
    </div>
  );
}
