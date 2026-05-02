import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Clock, Accessibility, Loader2 } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { getVoterInfo } from '../../services/civic';
import { useUserStore } from '../../store/useStore';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '16px'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const PollingPlaceFinder: React.FC = () => {
  const { address, setAddress } = useUserStore();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const handleSearch = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getVoterInfo(address);
      if (data.pollingLocations) {
        const locations = data.pollingLocations.map((loc: any, index: number) => ({
          id: index,
          name: loc.address.locationName || 'Polling Location',
          address: `${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}`,
          hours: loc.pollingHours || '7 AM - 8 PM',
          accessible: true, // Data varies, assuming basic accessibility
          lat: 0, // We'll need to geocode if the API doesn't provide it
          lng: 0,
          raw: loc
        }));
        setResults(locations);
        
        // If we had coordinates, we'd setMapCenter here.
        // For now, we'll rely on the address search to orient the user.
      } else {
        setResults([]);
        setError("No polling locations found for this address.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch polling locations. Please check your address.");
    } finally {
      setLoading(false);
    }
  };

  const onLoad = useCallback(function callback(_map: any) {
  }, []);

  const onUnmount = useCallback(function callback(_map: any) {
  }, []);

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Find Your <span className="gradient-text">Polling Booth</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Enter your constituency or address to locate your nearest polling booth and check booth-level details.
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              <button onClick={handleSearch} disabled={loading} className="btn-primary" style={{ minWidth: '100px' }}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
              </button>
            </div>
            {error && <p style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {results.length > 0 ? results.map((place) => (
              <motion.div 
                key={place.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass" 
                style={{ padding: '1.5rem', cursor: 'pointer', border: selectedPlace?.id === place.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPlace(place)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{place.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{place.address}</p>
                  </div>
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

                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  <Navigation size={16} /> Get Directions
                </a>
              </motion.div>
            )) : (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                <MapPin size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p>{loading ? 'Searching...' : 'Enter your address to find stations near you.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Visualization */}
        <div className="glass" style={{ minHeight: '500px', background: 'rgba(15, 23, 42, 0.4)', overflow: 'hidden', position: 'relative' }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                styles: mapDarkStyle,
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {results.map(place => (
                <Marker 
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => setSelectedPlace(place)}
                />
              ))}
              
              {selectedPlace && selectedPlace.lat !== 0 && (
                <InfoWindow
                  position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div style={{ color: 'black', padding: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>{selectedPlace.name}</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>{selectedPlace.address}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={32} color="var(--primary)" />
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading Maps...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default PollingPlaceFinder;

