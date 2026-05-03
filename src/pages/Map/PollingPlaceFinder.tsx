import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, Clock, Accessibility, Loader2, Info } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { getVoterInfo } from '../../services/civic';
import { useUserStore } from '../../store/useStore';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '20px'
};

const defaultCenter = {
  lat: 20.5937, // Center of India
  lng: 78.9629
};

const PollingPlaceFinder: React.FC = () => {
  const { address, setAddress } = useUserStore();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(5);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const geocodeAddress = async (addressStr: string): Promise<{ lat: number, lng: number } | null> => {
    if (!window.google) return null;
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address: addressStr });
      if (response.results[0]) {
        const { lat, lng } = response.results[0].geometry.location;
        return { lat: lat(), lng: lng() };
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
    return null;
  };

  const handleSearch = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    setError(null);
    setSelectedPlace(null);
    
    try {
      // 1. Geocode the search address to center the map
      const searchCoords = await geocodeAddress(address);
      if (searchCoords) {
        setMapCenter(searchCoords);
        setZoom(14);
      }

      // 2. Fetch voter info (polling locations)
      const data = await getVoterInfo(address);
      if (data.pollingLocations && data.pollingLocations.length > 0) {
        const locations = await Promise.all(data.pollingLocations.map(async (loc: any, index: number) => {
          const fullAddress = `${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}`;
          
          // Try to geocode each location for marker placement
          const coords = await geocodeAddress(fullAddress);
          
          return {
            id: index,
            name: loc.address.locationName || 'Polling Location',
            address: fullAddress,
            hours: loc.pollingHours || '7 AM - 6 PM',
            accessible: true,
            lat: coords?.lat || 0,
            lng: coords?.lng || 0,
            raw: loc
          };
        }));
        setResults(locations);
      } else {
        setResults([]);
        setError("No official polling locations found for this address in the Civic API.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch polling locations. Please check your address.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search if address exists from home page
  useEffect(() => {
    if (address && isLoaded && results.length === 0) {
      handleSearch();
    }
  }, [isLoaded]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Polling <span className="gradient-text">Finder</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Locate your assigned polling station and get real-time directions.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', height: '700px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter address..."
                  style={{ width: '100%', paddingLeft: '3rem' }}
                />
              </div>
              <button onClick={handleSearch} disabled={loading} className="btn-primary" style={{ padding: '0.75rem' }}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              </button>
            </div>
            {error && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '10px', color: 'var(--accent)', fontSize: '0.85rem' }}>
                <Info size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            {results.length > 0 ? (
              <AnimatePresence>
                {results.map((place) => (
                  <motion.div 
                    key={place.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass" 
                    style={{ 
                      padding: '1.5rem', 
                      cursor: 'pointer', 
                      borderColor: selectedPlace?.id === place.id ? 'var(--primary)' : 'var(--glass-border)',
                      background: selectedPlace?.id === place.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedPlace(place);
                      if (place.lat !== 0) {
                        setMapCenter({ lat: place.lat, lng: place.lng });
                        setZoom(16);
                      }
                    }}
                  >
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{place.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{place.address}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} /> {place.hours}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Accessibility size={14} /> Accessible
                      </div>
                    </div>

                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary" 
                      style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', fontSize: '0.9rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Navigation size={16} /> Get Directions
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-dim)' }}>
                <MapPin size={48} style={{ marginBottom: '1rem', opacity: 0.1 }} />
                <p>{loading ? 'Finding locations...' : 'Enter your address to see nearby booths.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="glass" style={{ height: '100%', background: '#1e293b' }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                styles: mapDarkStyle,
                disableDefaultUI: true,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {results.map(place => place.lat !== 0 && (
                <Marker 
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => setSelectedPlace(place)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#6366f1',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 8,
                  }}
                />
              ))}
              
              {selectedPlace && selectedPlace.lat !== 0 && (
                <InfoWindow
                  position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div style={{ color: 'black', padding: '0.5rem', maxWidth: '200px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{selectedPlace.name}</h4>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.8rem' }}>{selectedPlace.address}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5' }}>{selectedPlace.hours}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6366f1" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#334155" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
];

export default PollingPlaceFinder;


