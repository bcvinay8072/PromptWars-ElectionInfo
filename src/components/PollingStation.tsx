import React, { useState } from 'react';
import { Map, Search, MapPin, ExternalLink, Phone, Smartphone, Globe } from 'lucide-react';

// India-specific election resources
const ECI_RESOURCES = [
  {
    name: "National Voters' Service Portal (NVSP)",
    url: "https://www.nvsp.in/",
    description: "Register to vote, check electoral roll, track applications",
    icon: <Globe size={16} aria-hidden="true" />
  },
  {
    name: "Voter Helpline App",
    url: "https://play.google.com/store/apps/details?id=com.eci.citizen",
    description: "Official ECI app for booth search, voter ID, and complaints",
    icon: <Smartphone size={16} aria-hidden="true" />
  },
  {
    name: "Election Commission of India",
    url: "https://www.eci.gov.in/",
    description: "Official ECI website for election schedules and results",
    icon: <Globe size={16} aria-hidden="true" />
  },
  {
    name: "Voter Helpline: 1950",
    url: "tel:1950",
    description: "Call or SMS your EPIC number to 1950 for booth details",
    icon: <Phone size={16} aria-hidden="true" />
  }
];

// Indian state CEO (Chief Electoral Officer) websites
const STATE_CEO_MAP: Record<string, { name: string; url: string }> = {
  "andhra pradesh": { name: "CEO Andhra Pradesh", url: "https://ceoandhra.nic.in/" },
  "arunachal pradesh": { name: "CEO Arunachal Pradesh", url: "https://ceoarunachal.nic.in/" },
  "assam": { name: "CEO Assam", url: "https://ceoassam.nic.in/" },
  "bihar": { name: "CEO Bihar", url: "https://ceobihar.nic.in/" },
  "chhattisgarh": { name: "CEO Chhattisgarh", url: "https://ceochhattisgarh.nic.in/" },
  "delhi": { name: "CEO Delhi", url: "https://ceodelhi.gov.in/" },
  "goa": { name: "CEO Goa", url: "https://ceogoa.nic.in/" },
  "gujarat": { name: "CEO Gujarat", url: "https://ceo.gujarat.gov.in/" },
  "haryana": { name: "CEO Haryana", url: "https://ceoharyana.gov.in/" },
  "himachal pradesh": { name: "CEO Himachal Pradesh", url: "https://ceohimachal.nic.in/" },
  "jharkhand": { name: "CEO Jharkhand", url: "https://ceojharkhand.nic.in/" },
  "karnataka": { name: "CEO Karnataka", url: "https://ceokarnataka.kar.nic.in/" },
  "kerala": { name: "CEO Kerala", url: "https://ceo.kerala.gov.in/" },
  "madhya pradesh": { name: "CEO Madhya Pradesh", url: "https://ceomadhyapradesh.nic.in/" },
  "maharashtra": { name: "CEO Maharashtra", url: "https://ceo.maharashtra.gov.in/" },
  "manipur": { name: "CEO Manipur", url: "https://ceomanipur.nic.in/" },
  "meghalaya": { name: "CEO Meghalaya", url: "https://ceomeghalaya.nic.in/" },
  "mizoram": { name: "CEO Mizoram", url: "https://ceomizoram.nic.in/" },
  "nagaland": { name: "CEO Nagaland", url: "https://ceonagaland.nic.in/" },
  "odisha": { name: "CEO Odisha", url: "https://ceoodisha.nic.in/" },
  "punjab": { name: "CEO Punjab", url: "https://ceopunjab.nic.in/" },
  "rajasthan": { name: "CEO Rajasthan", url: "https://ceorajasthan.nic.in/" },
  "sikkim": { name: "CEO Sikkim", url: "https://ceosikkim.nic.in/" },
  "tamil nadu": { name: "CEO Tamil Nadu", url: "https://www.elections.tn.gov.in/" },
  "telangana": { name: "CEO Telangana", url: "https://ceotelangana.nic.in/" },
  "tripura": { name: "CEO Tripura", url: "https://ceotripura.nic.in/" },
  "uttar pradesh": { name: "CEO Uttar Pradesh", url: "https://ceouttarpradesh.nic.in/" },
  "uttarakhand": { name: "CEO Uttarakhand", url: "https://ceouttarakhand.nic.in/" },
  "west bengal": { name: "CEO West Bengal", url: "https://ceowestbengal.nic.in/" },
};

/**
 * PollingStationVisualizer component provides India-specific polling booth 
 * search functionality using ECI resources and state CEO website links.
 */
export const PollingStationVisualizer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [matchedState, setMatchedState] = useState<{ name: string; url: string } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setIsSearched(true);

    // Try to match with a state
    const found = Object.entries(STATE_CEO_MAP).find(([key]) => 
      query.includes(key) || key.includes(query)
    );
    setMatchedState(found ? found[1] : null);
  };

  return (
    <div 
      className="glass-panel" 
      style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-2xl)' }}
      role="region"
      aria-label="Polling booth finder"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
        <Map color="var(--color-primary)" size={28} aria-hidden="true" />
        <h3 id="polling-heading" style={{ fontSize: 'var(--text-2xl)' }}>Find Your Polling Booth</h3>
      </div>
      
      <p id="polling-description" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
        Enter your state or city name to find your Chief Electoral Officer (CEO) website and polling booth details. You can also use the official Voter Helpline App or call 1950.
      </p>

      {/* ECI Quick Links */}
      <div 
        role="region"
        aria-label="Official ECI Resources"
        style={{ 
          marginBottom: 'var(--spacing-lg)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-sm)'
        }}
      >
        {ECI_RESOURCES.map((resource, idx) => (
          <a
            key={idx}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${resource.name} - ${resource.description} (opens in new tab)`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              transition: 'var(--transition-fast)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
            }}
          >
            {resource.icon}
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{resource.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>{resource.description}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Search Form */}
      <form 
        onSubmit={handleSearch} 
        role="search"
        aria-label="Search for your state CEO website"
        style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}
      >
        <label htmlFor="state-input" className="sr-only">Enter your state or city name</label>
        <input 
          id="state-input"
          type="text" 
          placeholder="e.g. Karnataka, Delhi, Maharashtra, Tamil Nadu..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Enter your state or city to find polling booth"
          aria-describedby="polling-description"
          autoComplete="off"
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
          aria-label="Search for state election office"
          disabled={!searchQuery.trim()}
          style={{ 
            padding: 'var(--spacing-sm) var(--spacing-lg)', 
            background: searchQuery.trim() ? 'var(--color-primary)' : 'var(--color-surface-hover)', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)', 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            color: 'white', 
            cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            transition: 'var(--transition-fast)'
          }}
        >
          <Search size={18} aria-hidden="true" /> Search
        </button>
      </form>

      {/* Results */}
      <div 
        role="region"
        aria-label="Search results"
        aria-live="polite"
        style={{ 
          width: '100%', 
          minHeight: '250px', 
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

        {isSearched ? (
          <div style={{ zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '500px' }}>
            <MapPin size={48} color="var(--color-primary)" style={{ margin: '0 auto var(--spacing-sm)' }} />
            <h4 style={{ fontSize: 'var(--text-lg)', color: 'white', marginBottom: 'var(--spacing-md)' }}>
              Results for: {searchQuery}
            </h4>
            
            {matchedState ? (
              <div style={{ 
                textAlign: 'left', 
                background: 'rgba(15, 23, 42, 0.9)', 
                padding: 'var(--spacing-lg)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-glow)',
              }}>
                <h5 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                  🏛️ {matchedState.name}
                </h5>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-md)' }}>
                  Visit your state's Chief Electoral Officer website to:
                </p>
                <ul style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', paddingLeft: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <li>Search your name in the electoral roll</li>
                  <li>Find your assigned polling booth</li>
                  <li>Download your voter slip</li>
                  <li>Check election schedule</li>
                </ul>
                <a
                  href={matchedState.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${matchedState.name} official website (opens in new tab)`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    borderRadius: 'var(--radius-full)',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600
                  }}
                >
                  <ExternalLink size={14} aria-hidden="true" /> Visit Official Website
                </a>
              </div>
            ) : (
              <div style={{ 
                background: 'rgba(15, 23, 42, 0.9)', 
                padding: 'var(--spacing-lg)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-md)' }}>
                  We couldn't find a specific match for "{searchQuery}". Try entering your full state name (e.g., "Karnataka", "Tamil Nadu").
                </p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  You can also use these national resources:
                </p>
                <div style={{ marginTop: 'var(--spacing-sm)', display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                  <a href="https://www.nvsp.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ExternalLink size={12} aria-hidden="true" /> NVSP Portal
                  </a>
                  <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ExternalLink size={12} aria-hidden="true" /> Electoral Search
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ zIndex: 1, textAlign: 'center' }}>
            <Map size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.5 }} aria-hidden="true" />
            <p style={{ color: 'var(--color-text-muted)' }}>Enter your state name to find your election office.</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: 'var(--spacing-sm)', textAlign: 'center' }}>
        <small style={{ color: 'var(--color-text-muted)' }}>
          Data sourced from Election Commission of India (ECI) • Voter Helpline: 1950
        </small>
      </div>
    </div>
  );
};
