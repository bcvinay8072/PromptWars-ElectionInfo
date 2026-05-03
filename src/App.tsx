import React, { lazy, Suspense, useEffect, useMemo } from 'react';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GoogleSignIn } from './components/GoogleSignIn';
import { trackPageView, getConfigValue } from './lib/firebase';

// Lazy-load heavy components for better initial load performance
const ChatAssistant = lazy(() => import('./components/ChatAssistant').then(m => ({ default: m.ChatAssistant })));
const VoterTimeline = lazy(() => import('./components/VoterTimeline').then(m => ({ default: m.VoterTimeline })));
const PollingStationVisualizer = lazy(() => import('./components/PollingStation').then(m => ({ default: m.PollingStationVisualizer })));

/** Loading fallback component for Suspense boundaries */
const LoadingFallback: React.FC<{ label: string }> = ({ label }) => (
  <div 
    role="status" 
    aria-label={`Loading ${label}`}
    style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      padding: 'var(--spacing-2xl)', color: 'var(--color-text-muted)' 
    }}
  >
    <span>Loading {label}...</span>
  </div>
);

/** Navigation link configuration */
interface NavLink {
  href: string;
  label: string;
}

/** Application navigation links */
const NAV_LINKS: NavLink[] = [
  { href: '#journey', label: 'Voter Journey' },
  { href: '#polling', label: 'Find Polling Booth' },
  { href: '#assistant', label: 'AI Assistant' },
];

function App() {
  // Track page view on mount via Firebase Analytics
  useEffect(() => {
    trackPageView('CivicSync Home');
  }, []);

  // Memoize the current year to prevent unnecessary re-renders
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="app-container" lang="en">
      {/* Skip Navigation Link for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Header / Navigation */}
      <header 
        className="glass-panel" 
        role="banner"
        style={{ margin: 'var(--spacing-md)', padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1 className="text-gradient" style={{ fontSize: 'var(--text-2xl)' }}>CivicSync</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Your AI Guide to India's Electoral Process — Powered by Google Gemini
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          {/* Google Translate Widget Container */}
          <div 
            id="google_translate_element" 
            aria-label="Translate this page"
            style={{ minWidth: '120px' }}
          ></div>
          {/* Firebase Authentication — Google Sign-In */}
          <GoogleSignIn />
          <nav aria-label="Main navigation">
            <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none' }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} 
                    onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'} 
                    onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    onFocus={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onBlur={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" className="main-content" role="main">
        {/* Hero Section */}
        <section id="hero" aria-labelledby="hero-heading" style={{ textAlign: 'center', margin: 'var(--spacing-2xl) 0' }}>
          <h2 id="hero-heading" style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--spacing-md)' }}>
            Navigate India's Democracy with Confidence
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xl)', maxWidth: '600px', margin: '0 auto' }}>
            Interactive guides, timeline trackers, and an AI assistant powered by Google Gemini to help you understand voter registration, EPIC card, EVM voting, and every step of India's election process.
          </p>
        </section>

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-2xl)' }}>
          {/* Timeline Section */}
          <ErrorBoundary fallbackMessage="The voter timeline encountered an error. Please refresh.">
            <section 
              id="journey" 
              className="glass-panel" 
              aria-labelledby="journey-heading"
              style={{ padding: 'var(--spacing-xl)' }}
            >
              <h3 id="journey-heading" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-lg)' }}>
                Your Electoral Journey
              </h3>
              <Suspense fallback={<LoadingFallback label="Voter Journey" />}>
                <VoterTimeline />
              </Suspense>
            </section>
          </ErrorBoundary>

          {/* AI Assistant Section */}
          <ErrorBoundary fallbackMessage="The AI assistant encountered an error. Please refresh.">
            <section 
              id="assistant" 
              className="glass-panel" 
              aria-labelledby="assistant-heading"
              style={{ display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden' }}
            >
              <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)' }}>
                <h3 id="assistant-heading" style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ color: 'var(--color-primary)' }} aria-hidden="true">✦</span> 
                  CivicSync Assistant
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 'auto' }}>
                    Gemini 2.5 Flash
                  </span>
                </h3>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Suspense fallback={<LoadingFallback label="AI Assistant" />}>
                  <ChatAssistant />
                </Suspense>
              </div>
            </section>
          </ErrorBoundary>
        </div>

        {/* Polling Station Section */}
        <ErrorBoundary fallbackMessage="The polling station finder encountered an error. Please refresh.">
          <section id="polling" aria-labelledby="polling-heading">
            <Suspense fallback={<LoadingFallback label="Polling Booth Finder" />}>
              <PollingStationVisualizer />
            </Suspense>
          </section>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer 
        role="contentinfo"
        style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-lg)', 
          color: 'var(--color-text-muted)', 
          fontSize: 'var(--text-xs)',
          borderTop: '1px solid var(--color-border)',
          marginTop: 'var(--spacing-2xl)'
        }}
      >
        <p>
          CivicSync © {currentYear} — Built with Google Gemini AI, Firebase Analytics, and Google Cloud Run for India's Electoral Education
        </p>
        <p style={{ marginTop: 'var(--spacing-xs)' }}>
          This application is for educational purposes only. Always verify information with the Election Commission of India (eci.gov.in).
        </p>
      </footer>
    </div>
  );
}

export default App;
