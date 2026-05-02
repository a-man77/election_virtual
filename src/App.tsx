import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Vote, Calendar, CheckSquare, MessageSquare, MapPin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home/Home';
import TimelineExplorer from './pages/Timeline/TimelineExplorer';
import QAAssistant from './pages/QA/QAAssistant';
import VoterChecklist from './pages/Checklist/VoterChecklist';
import PollingPlaceFinder from './pages/Map/PollingPlaceFinder';
import AuthButton from './components/Auth/AuthButton';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Vote size={20} /> },
    { path: '/timeline', label: 'Timeline', icon: <Calendar size={20} /> },
    { path: '/checklist', label: 'Checklist', icon: <CheckSquare size={20} /> },
    { path: '/qa', label: 'Ask Gemini', icon: <MessageSquare size={20} /> },
    { path: '/map', label: 'Polling Booths', icon: <MapPin size={20} /> },
  ];

  return (
    <Router>
      <header className="glass" style={{ margin: '1rem', position: 'sticky', top: '1rem', zIndex: 100, padding: '0.5rem 1rem' }}>
        <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
              <Vote color="white" size={24} />
            </div>
            <span>Civic<span className="gradient-text">Guide</span></span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {link.label}
              </Link>
            ))}
          </div>

          <style>{`
            @media (min-width: 769px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>

          <div className="desktop-nav" style={{ display: 'none', gap: '2rem' }}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="nav-link" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AuthButton />
            <button 
              className="mobile-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              style={{ background: 'transparent', zIndex: 101 }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X color="white" /> : <Menu color="white" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass"
              style={{ 
                margin: '1rem 0 0', 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem',
                overflow: 'hidden'
              }}
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}
                >
                  <div style={{ color: 'var(--primary)' }}>{link.icon}</div>
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<TimelineExplorer />} />
          <Route path="/checklist" element={<VoterChecklist />} />
          <Route path="/qa" element={<QAAssistant />} />
          <Route path="/map" element={<PollingPlaceFinder />} />
        </Routes>
      </main>

      <footer className="glass" style={{ margin: '2rem 1rem 1rem', padding: '2rem' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>© 2026 Election Process Assistant. Powered by Google Services.</p>
        </div>
      </footer>
    </Router>
  );
};

export default App;
