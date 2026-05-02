import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';
import heroImage from '../../assets/hero.png';

import { useUserStore } from '../../store/useStore';
import { getVoterInfo } from '../../services/civic';
import { Search, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const { address, setAddress, setElectionData } = useUserStore();
  const [inputAddress, setInputAddress] = React.useState(address);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!inputAddress.trim()) return;
    setIsLoading(true);
    try {
      setAddress(inputAddress);
      const data = await getVoterInfo(inputAddress);
      setElectionData(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="container" style={{ padding: '6rem 0', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: '1 1 500px' }}
        >
          <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '2rem' }}>
            Empowering Every <span className="gradient-text">Voter's Voice</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px' }}>
            The ultimate AI-powered companion for your electoral journey. Get personalized guidance, find your polling station, and stay informed with Gemini-driven insights.
          </p>
          
          <div className="glass" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', marginBottom: '2rem', maxWidth: '500px' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter address for personalized guide..."
                style={{ 
                  width: '100%', 
                  background: 'transparent', 
                  border: 'none', 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  color: 'white', 
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="btn-primary" 
              style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Get Guide'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/qa" className="glass" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--primary)" /> Ask Gemini
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}
        >
          <div className="glass" style={{ padding: '1rem', borderRadius: '24px', position: 'relative' }}>
            <img 
              src={heroImage} 
              alt="Election Assistant" 
              style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }} 
            />
            <div className="glass" style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: 'var(--secondary)', padding: '0.75rem', borderRadius: '12px' }}>
                <ShieldCheck color="white" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Secure & Verified</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Official Civic Data</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Use <span className="gradient-text">CivicGuide?</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Everything you need for a seamless voting experience.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { icon: <Zap color="var(--primary)" />, title: 'Real-time Updates', desc: 'Get instant alerts on deadlines and polling changes.' },
            { icon: <Globe color="var(--secondary)" />, title: 'Multilingual Support', desc: 'Available in over 100 languages via Cloud Translation.' },
            { icon: <Users color="var(--accent)" />, title: 'Community Focused', desc: 'Resources designed for first-time and seasoned voters alike.' },
            { icon: <ShieldCheck color="var(--primary)" />, title: 'Non-partisan Info', desc: 'Fact-based guidance with no political bias.' },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ translateY: -10 }}
              className="glass" 
              style={{ padding: '2.5rem', textAlign: 'left' }}
            >
              <div style={{ marginBottom: '1.5rem' }}>{feat.icon}</div>
              <h3 style={{ marginBottom: '1rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
