import React from 'react';
import './index.css';
import { ChatAssistant } from './components/ChatAssistant';
import { VoterTimeline } from './components/VoterTimeline';
import { PollingStationVisualizer } from './components/PollingStation';

function App() {
  return (
    <div className="app-container">
      <header className="glass-panel" style={{ margin: 'var(--spacing-md)', padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: 'var(--text-2xl)' }}>CivicSync</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>The Intelligent Election Guide</p>
        </div>
        <nav>
          <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none' }}>
            <li><a href="#journey" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}>Voter Journey</a></li>
            <li><a href="#polling" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}>Find Polling Station</a></li>
            <li><a href="#assistant" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}>AI Assistant</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section id="hero" style={{ textAlign: 'center', margin: 'var(--spacing-2xl) 0' }}>
          <h2 style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--spacing-md)' }}>Navigate Democracy with Confidence</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xl)', maxWidth: '600px', margin: '0 auto' }}>
            Interactive guides, timeline trackers, and a smart assistant to help you understand every step of the election process.
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-2xl)' }}>
          {/* Main Content Area (Timeline) */}
          <section id="journey" className="glass-panel" style={{ padding: 'var(--spacing-xl)' }}>
            <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-lg)' }}>Your Electoral Journey</h3>
            <VoterTimeline />
          </section>

          {/* Sidebar Area (AI Assistant) */}
          <section id="assistant" className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden' }}>
             <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)' }}>
               <h3 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <span style={{ color: 'var(--color-primary)' }}>✦</span> Civic Assistant
              </h3>
             </div>
             <div style={{ flex: 1, overflow: 'hidden' }}>
                <ChatAssistant />
             </div>
          </section>
        </div>

        <section id="polling">
          <PollingStationVisualizer />
        </section>
      </main>
    </div>
  );
}

export default App;
