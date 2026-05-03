import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Vote, Calendar, CheckSquare, MessageSquare, MapPin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home/Home';
import TimelineExplorer from './pages/Timeline/TimelineExplorer';
import QAAssistant from './pages/QA/QAAssistant';
import VoterChecklist from './pages/Checklist/VoterChecklist';
import PollingPlaceFinder from './pages/Map/PollingPlaceFinder';
import AuthButton from './components/Auth/AuthButton';

const NavLink: React.FC<{ to: string; label: string; icon: React.ReactNode }> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`nav-link ${isActive ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        color: isActive ? 'white' : 'var(--text-muted)',
        background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        fontWeight: isActive ? 600 : 500,
        transition: 'var(--transition)'
      }}
    >
      <span style={{ color: isActive ? 'var(--primary)' : 'inherit' }}>{icon}</span>
      <span className="nav-label">{label}</span>
    </Link>
  );
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Vote size={18} /> },
    { path: '/timeline', label: 'Timeline', icon: <Calendar size={18} /> },
    { path: '/checklist', label: 'Checklist', icon: <CheckSquare size={18} /> },
    { path: '/qa', label: 'Ask Gemini', icon: <MessageSquare size={18} /> },
    { path: '/map', label: 'Polling Booths', icon: <MapPin size={18} /> },
  ];

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className="glass" style={{ margin: '1rem', position: 'sticky', top: '1rem', zIndex: 100, padding: '0.75rem 1.5rem' }}>
          <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '12px', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                <Vote color="white" size={20} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em' }}>
                Civic<span className="gradient-text">Guide</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="desktop-nav" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {navLinks.map((link) => (
                <NavLink key={link.path} {...link} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <AuthButton />
              <button 
                className="mobile-toggle" 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                style={{ background: 'var(--bg-input)', padding: '0.6rem', borderRadius: '10px', display: 'none' }}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>

          <style>{`
            @media (max-width: 1024px) {
              .nav-label { display: none; }
            }
            @media (max-width: 768px) {
              .desktop-nav { display: none !important; }
              .mobile-toggle { display: block !important; }
            }
            .nav-link:hover {
              color: white !important;
              background: rgba(255, 255, 255, 0.05) !important;
            }
            .nav-link.active:hover {
              background: rgba(99, 102, 241, 0.15) !important;
            }
          `}</style>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1.5rem' }}>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      onClick={() => setIsMenuOpen(false)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        background: 'var(--bg-input)',
                        fontWeight: 600
                      }}
                    >
                      <div style={{ color: 'var(--primary)' }}>{link.icon}</div>
                      {link.label}
                    </Link>
                  ))}
                </div>
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

        <footer style={{ marginTop: '4rem', padding: '4rem 0 2rem' }}>
          <div className="container">
            <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Vote size={32} className="gradient-text" />
                  <span style={{ fontWeight: 800, fontSize: '1.8rem' }}>CivicGuide</span>
                </Link>
              </div>
              <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                A non-partisan AI initiative to strengthen democracy by empowering citizens with accurate civic information.
              </p>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>© 2026 CivicGuide. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Official ECI Portal</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
