import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';
import Home from './pages/Home';
import pages from './data/pages.json';
import profileData from './data/profile.json';

// Every page except Home loads on demand, so the first visit downloads less
const Research = lazy(() => import('./pages/Research'));
const Projects = lazy(() => import('./pages/Projects'));
const WorkExperience = lazy(() => import('./pages/WorkExperience'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Connect = lazy(() => import('./pages/Connect'));
const AllNews = lazy(() => import('./pages/AllNews'));
const Gallery = lazy(() => import('./pages/Gallery'));

// Scroll to top and set the tab title when the route changes
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const path = pathname.replace(/\/+$/, '') || '/';
    const page = pages[path];
    // Post pages set their own title
    if (!path.startsWith('/blog/')) {
      document.title = page && path !== '/' ? `${page.title} | ${profileData.name}` : profileData.name;
    }
  }, [pathname]);
  return null;
}

function PageLoading() {
  return (
    <div className="container page">
      <div className="loading-spinner" role="status" aria-label="Loading page" />
    </div>
  );
}

export default function App() {
  return (
    <div className="app-layout">
      <RouteEffects />
      <Navbar />
      <main className="app-main">
        <Suspense fallback={<PageLoading />}>
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
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
