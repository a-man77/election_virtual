import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Clock, Accessibility } from 'lucide-react';

const PollingPlaceFinder: React.FC = () => {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    // Simulate search results
    setResults([
      { id: 1, name: 'Central Community Center', address: '123 Main St, Springfield', distance: '0.8 miles', hours: '7 AM - 8 PM', accessible: true },
      { id: 2, name: 'Northside High School', address: '456 Education Way, Springfield', distance: '1.5 miles', hours: '7 AM - 8 PM', accessible: true },
    ]);
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Find Your <span className="gradient-text">Polling Place</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Enter your address to locate the nearest polling stations, check hours, and find accessibility information.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Search and Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your street address..."
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>
              <button onClick={handleSearch} className="btn-primary">Search</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.length > 0 ? results.map((place) => (
              <motion.div 
                key={place.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass" 
                style={{ padding: '1.5rem', cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{place.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{place.address}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)', background: 'rgba(6, 182, 212, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                    {place.distance}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} /> {place.hours}
                  </div>
                  {place.accessible && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Accessibility size={16} /> Accessible
                    </div>
                  )}
                </div>

                <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Navigation size={16} /> Get Directions
                </button>
              </motion.div>
            )) : (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                <MapPin size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p>Enter your address to find stations near you.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Visualization Placeholder */}
        <div className="glass" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.4)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem', boxShadow: '0 0 30px var(--primary)' }}>
              <MapPin size={32} color="white" />
            </div>
            <h3>Interactive Map</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '250px' }}>In the production version, this will load the Google Maps API with live polling station data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollingPlaceFinder;
