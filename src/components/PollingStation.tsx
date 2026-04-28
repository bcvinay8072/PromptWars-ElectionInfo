import React, { useState } from 'react';
import { Map, Search, MapPin } from 'lucide-react';

export const PollingStationVisualizer: React.FC = () => {
  const [zipcode, setZipcode] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipcode.trim()) {
      setIsSearched(true);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-2xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
        <Map color="var(--color-primary)" size={28} />
        <h3 style={{ fontSize: 'var(--text-2xl)' }}>Find Your Polling Station</h3>
      </div>
      
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
        Enter your zipcode or city to find official voting centers near you using Google Maps.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
        <input 
          type="text" 
          placeholder="e.g. 10001 or New York" 
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          style={{ 
            flex: 1, 
            padding: 'var(--spacing-sm) var(--spacing-md)', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--color-border)', 
            background: 'var(--color-bg-base)', 
            color: 'white',
            outline: 'none'
          }} 
        />
        <button 
          type="submit"
          style={{ 
            padding: 'var(--spacing-sm) var(--spacing-lg)', 
            background: 'var(--color-primary)', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)', 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            color: 'white', 
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'var(--transition-fast)'
          }}
        >
          <Search size={18} /> Search
        </button>
      </form>

      {/* Mock Map Container */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        borderRadius: 'var(--radius-md)', 
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'rgba(30, 41, 59, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Fake Map Grid Background */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
          backgroundSize: '20px 20px',
          opacity: 0.5
        }} />

        {isSearched ? (
          <div style={{ zIndex: 1, textAlign: 'center', background: 'rgba(15, 23, 42, 0.9)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-glow)' }}>
            <MapPin size={48} color="var(--color-primary)" style={{ margin: '0 auto var(--spacing-sm)' }} />
            <h4 style={{ fontSize: 'var(--text-lg)', color: 'white' }}>Polling Stations Found near {zipcode}</h4>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
              1. Central High School (0.5 miles)<br/>
              2. Community Center (1.2 miles)
            </p>
          </div>
        ) : (
           <div style={{ zIndex: 1, textAlign: 'center' }}>
            <Map size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.5 }} />
            <p style={{ color: 'var(--color-text-muted)' }}>Enter a location to view the map.</p>
          </div>
        )}
      </div>
      <div style={{ marginTop: 'var(--spacing-sm)', textAlign: 'center' }}>
         <small style={{ color: 'var(--color-text-muted)' }}>
          *Demo Mode: A valid Google Maps API Key is required to render the live interactive map in production.
         </small>
      </div>
    </div>
  );
};
