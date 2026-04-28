import React, { useState, useEffect } from 'react';
import { Map, Search, MapPin, AlertCircle, ExternalLink, Calendar } from 'lucide-react';
import { fetchElections, fetchVoterInfo, ElectionInfo } from '../lib/civicApi';

/**
 * PollingStationVisualizer component integrates with the Google Civic Information API
 * to display real election data and voter information based on user address input.
 */
export const PollingStationVisualizer: React.FC = () => {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [elections, setElections] = useState<ElectionInfo[]>([]);
  const [voterInfo, setVoterInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch upcoming elections on mount using Google Civic API
  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchElections();
        if (data && data.length > 0) {
          setElections(data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load elections:', err);
      }
    };
    loadElections();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    if (!trimmedAddress) return;

    setIsSearching(true);
    setError(null);
    setIsSearched(true);

    try {
      const info = await fetchVoterInfo(trimmedAddress);
      setVoterInfo(info);
    } catch (err) {
      setError('Unable to fetch voter information. Please try a valid US address.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div 
      className="glass-panel" 
      style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-2xl)' }}
      role="region"
      aria-label="Polling station finder"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
        <Map color="var(--color-primary)" size={28} aria-hidden="true" />
        <h3 id="polling-heading" style={{ fontSize: 'var(--text-2xl)' }}>Find Your Polling Station</h3>
      </div>
      
      <p id="polling-description" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
        Enter your address to find official voting centers and election information using the Google Civic Information API.
      </p>

      {/* Upcoming Elections from Google Civic API */}
      {elections.length > 0 && (
        <div 
          role="region" 
          aria-label="Upcoming elections"
          style={{ 
            marginBottom: 'var(--spacing-lg)', 
            padding: 'var(--spacing-md)', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}
        >
          <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <Calendar size={16} aria-hidden="true" /> Upcoming Elections (via Google Civic API)
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {elections.map((election) => (
              <li 
                key={election.id}
                style={{ 
                  padding: 'var(--spacing-xs) 0', 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>{election.name}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{election.electionDay}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form 
        onSubmit={handleSearch} 
        role="search"
        aria-label="Search for polling station by address"
        style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}
      >
        <label htmlFor="address-input" className="sr-only">Enter your address</label>
        <input 
          id="address-input"
          type="text" 
          placeholder="e.g. 1600 Pennsylvania Ave, Washington DC" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          aria-label="Enter your address to find polling locations"
          aria-describedby="polling-description"
          autoComplete="street-address"
          required
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
          aria-label="Search for polling stations"
          disabled={isSearching || !address.trim()}
          style={{ 
            padding: 'var(--spacing-sm) var(--spacing-lg)', 
            background: address.trim() ? 'var(--color-primary)' : 'var(--color-surface-hover)', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)', 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            color: 'white', 
            cursor: address.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            transition: 'var(--transition-fast)'
          }}
        >
          <Search size={18} aria-hidden="true" /> {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results Container */}
      <div 
        role="region"
        aria-label="Search results"
        aria-live="polite"
        style={{ 
          width: '100%', 
          minHeight: '300px', 
          borderRadius: 'var(--radius-md)', 
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          background: 'rgba(30, 41, 59, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 'var(--spacing-lg)'
        }}
      >
        {/* Grid Background */}
        <div 
          aria-hidden="true"
          style={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
            backgroundSize: '20px 20px', opacity: 0.5
          }} 
        />

        {error && (
          <div 
            role="alert" 
            style={{ 
              zIndex: 1, textAlign: 'center', 
              background: 'rgba(239, 68, 68, 0.1)', 
              padding: 'var(--spacing-lg)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid rgba(239, 68, 68, 0.3)' 
            }}
          >
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto var(--spacing-sm)' }} />
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        )}

        {isSearching && (
          <div role="status" aria-label="Loading results" style={{ zIndex: 1, textAlign: 'center' }}>
            <div style={{ 
              width: '48px', height: '48px', 
              border: '3px solid var(--color-surface-hover)', 
              borderTop: '3px solid var(--color-primary)',
              borderRadius: '50%', animation: 'spin 1s linear infinite',
              margin: '0 auto var(--spacing-sm)'
            }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Searching Google Civic API...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!error && !isSearching && isSearched && (
          <div style={{ zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '500px' }}>
            <MapPin size={48} color="var(--color-primary)" style={{ margin: '0 auto var(--spacing-sm)' }} />
            <h4 style={{ fontSize: 'var(--text-lg)', color: 'white', marginBottom: 'var(--spacing-md)' }}>
              Results for: {address}
            </h4>
            
            {voterInfo?.state?.[0]?.electionAdministrationBody && (
              <div style={{ 
                textAlign: 'left', 
                background: 'rgba(15, 23, 42, 0.9)', 
                padding: 'var(--spacing-md)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <h5 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-sm)' }}>
                  Election Administration
                </h5>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {voterInfo.state[0].electionAdministrationBody.name}
                </p>
                {voterInfo.state[0].electionAdministrationBody.electionInfoUrl && (
                  <a 
                    href={voterInfo.state[0].electionAdministrationBody.electionInfoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit official election information website (opens in new tab)"
                    style={{ 
                      color: 'var(--color-primary)', 
                      fontSize: 'var(--text-sm)', 
                      display: 'flex', alignItems: 'center', gap: '4px',
                      marginTop: 'var(--spacing-xs)'
                    }}
                  >
                    <ExternalLink size={14} aria-hidden="true" /> Official Election Info
                  </a>
                )}
              </div>
            )}

            {!voterInfo && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                No specific election data found for this address. Try a valid US address with city and state.
              </p>
            )}
          </div>
        )}

        {!isSearched && !isSearching && (
          <div style={{ zIndex: 1, textAlign: 'center' }}>
            <Map size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.5 }} aria-hidden="true" />
            <p style={{ color: 'var(--color-text-muted)' }}>Enter an address to search for polling stations.</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: 'var(--spacing-sm)', textAlign: 'center' }}>
        <small style={{ color: 'var(--color-text-muted)' }}>
          Powered by Google Civic Information API &amp; Google Gemini AI
        </small>
      </div>
    </div>
  );
};
