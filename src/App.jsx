import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';

import Home from './pages/Home';
import Research from './pages/Research';
import Projects from './pages/Projects';
import WorkExperience from './pages/WorkExperience';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Connect from './pages/Connect';
import AllNews from './pages/AllNews';
import Gallery from './pages/Gallery';

// Auto-scroll to top when route changes
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollReset />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/work" element={<WorkExperience />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/news" element={<AllNews />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/more/gallery" element={<Gallery />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
