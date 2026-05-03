import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, Users, Search, Loader2, ArrowRight, CheckCircle, Info } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import { useUserStore } from '../../store/useStore';
import { getVoterInfo } from '../../services/civic';

const Home: React.FC = () => {
  const { address, setAddress, setElectionData } = useUserStore();
  const [inputAddress, setInputAddress] = useState(address);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!inputAddress.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      setAddress(inputAddress);
      const data = await getVoterInfo(inputAddress);
      setElectionData(data);
      // Navigate to checklist or map after successful search
      navigate('/checklist');
    } catch (err: any) {
      console.error("Search error:", err);
      setError("We couldn't find specific data for this address, but you can still explore the general guide.");
      // Still set the address so it's available in other pages
      setAddress(inputAddress);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '1 1 550px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
              <CheckCircle size={16} /> 2026 Election Guide Available
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 800 }}>
              The Smartest Way to <br />
              <span className="gradient-text">Navigate Democracy</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.7 }}>
              CivicGuide combines Google's AI with official ECI data to give you a personalized, non-partisan roadmap for the upcoming elections.
            </p>
            
            <div className="glass" style={{ padding: '0.6rem', display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', maxWidth: '550px', background: 'rgba(15, 23, 42, 0.9)' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={20} style={{ position: 'absolute', left: '1.25rem', color: 'var(--text-dim)' }} />
                <input 
                  type="text" 
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter your constituency or address..."
                  style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '0.9rem 1rem 0.9rem 3.5rem', 
                    color: 'white', 
                    outline: 'none',
                    fontSize: '1.05rem'
                  }}
                />
              </div>
              <button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="btn-primary" 
                style={{ padding: '0.9rem 2rem', borderRadius: '14px' }}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Get Started <ArrowRight size={18} /></>
                )}
              </button>
            </div>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                <Info size={16} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link to="/timeline" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View Election Timeline <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative' }}
          >
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', position: 'relative', background: 'rgba(30, 41, 59, 0.4)' }}>
              <img 
                src={heroImage} 
                alt="Election Assistant Interface" 
                style={{ width: '100%', height: 'auto', borderRadius: '24px', display: 'block', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
              />
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="glass" 
                style={{ position: 'absolute', top: '15%', right: '-10%', padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(15, 23, 42, 0.9)' }}
              >
                <div style={{ background: 'var(--secondary)', padding: '0.6rem', borderRadius: '10px' }}>
                  <ShieldCheck color="white" size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Verified Source</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official ECI Data</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ padding: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Democracy, <span className="gradient-text">Simplified.</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            We've built tools to help you every step of the way, from registration to the counting day.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
          {[
            { icon: <Zap color="#818cf8" />, title: 'Real-time Timeline', desc: 'Interactive roadmap of the entire election cycle with push notifications for deadlines.' },
            { icon: <Globe color="#22d3ee" />, title: 'Gemini AI Assistant', desc: 'Ask complex civic questions and get grounded, non-partisan answers in seconds.' },
            { icon: <Users color="#f43f5e" />, title: 'Personalized Checklist', desc: 'A step-by-step voter journey tailored to your specific constituency and status.' },
            { icon: <ShieldCheck color="#10b981" />, title: 'Station Locator', desc: 'Visual map integration to find your nearest polling booth with accessibility details.' },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -12, borderColor: 'var(--primary)' }}
              className="glass" 
              style={{ padding: '3rem', textAlign: 'left', transition: 'var(--transition)' }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                {feat.icon}
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
