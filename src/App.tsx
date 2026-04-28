import React from 'react';
import './index.css';
import { ChatAssistant } from './components/ChatAssistant';
import { VoterTimeline } from './components/VoterTimeline';
import { PollingStationVisualizer } from './components/PollingStation';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
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
        <nav aria-label="Main navigation">
          <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none' }}>
            <li>
              <a 
                href="#journey" 
                style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} 
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'} 
                onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onFocus={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onBlur={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              >
                Voter Journey
              </a>
            </li>
            <li>
              <a 
                href="#polling" 
                style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} 
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'} 
                onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onFocus={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onBlur={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              >
                Find Polling Booth
              </a>
            </li>
            <li>
              <a 
                href="#assistant" 
                style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} 
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'} 
                onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onFocus={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onBlur={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              >
                AI Assistant
              </a>
            </li>
          </ul>
        </nav>
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
              <VoterTimeline />
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
                <ChatAssistant />
              </div>
            </section>
          </ErrorBoundary>
        </div>

        {/* Polling Station Section */}
        <ErrorBoundary fallbackMessage="The polling station finder encountered an error. Please refresh.">
          <section id="polling" aria-labelledby="polling-heading">
            <PollingStationVisualizer />
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
          CivicSync © {new Date().getFullYear()} — Built with Google Gemini AI for India's Electoral Education
        </p>
        <p style={{ marginTop: 'var(--spacing-xs)' }}>
          This application is for educational purposes only. Always verify information with the Election Commission of India (eci.gov.in).
        </p>
      </footer>
    </div>
  );
}

export default App;
