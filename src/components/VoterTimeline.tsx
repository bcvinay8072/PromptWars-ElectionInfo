import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, MapPin, FileText, Vote, UserCheck } from 'lucide-react';
import { trackJourneyStep } from '../lib/firebase';

const TIMELINE_STEPS = [
  {
    id: 1,
    title: "Eligibility Check",
    icon: <UserCheck size={24} aria-hidden="true" />,
    description: "Verify your eligibility to vote in Indian elections. You must be an Indian citizen, at least 18 years of age on the qualifying date (1st January of the year of revision), and a resident of the constituency where you wish to vote.",
    action: "Check Eligibility",
    details: "You need to be an ordinary resident of a constituency. NRIs can also register under Section 20A of the RP Act, 1950."
  },
  {
    id: 2,
    title: "Voter Registration (Form 6)",
    icon: <FileText size={24} aria-hidden="true" />,
    description: "Register as a voter through the NVSP portal (nvsp.in) by filling Form 6 online. You can also visit your nearest Electoral Registration Office (ERO) with supporting documents.",
    action: "How to Register",
    details: "Required documents: Age proof (Aadhaar, Birth Certificate, or Marksheet), Address proof (Aadhaar, Passport, Utility Bill), and a passport-size photo. Track your application at nvsp.in."
  },
  {
    id: 3,
    title: "Find Your Polling Booth",
    icon: <MapPin size={24} aria-hidden="true" />,
    description: "Locate your assigned polling booth using the Voter Helpline App by ECI, the National Voters' Service Portal (nvsp.in), or your state's CEO (Chief Electoral Officer) website.",
    action: "Locate Booth",
    details: "You can also call the Voter Helpline at 1950 or send an SMS 'EPIC <Voter ID No>' to 1950 to find your polling booth details."
  },
  {
    id: 4,
    title: "Election Day Voting",
    icon: <Vote size={24} aria-hidden="true" />,
    description: "Visit your assigned polling booth with a valid photo ID (EPIC card, Aadhaar, Passport, DL, PAN, etc.). Cast your vote using the EVM (Electronic Voting Machine) and verify it on the VVPAT slip.",
    action: "Voting Guide",
    details: "Polling hours are typically 7 AM to 6 PM. You also have the option to select NOTA (None of the Above) if you don't wish to vote for any candidate. Indelible ink is applied on the left index finger."
  }
];

/**
 * VoterTimeline component displays an interactive, step-by-step guide
 * through India's voting process. Each step can be expanded for details
 * and triggers the AI assistant for more information.
 */
export const VoterTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleStepChange = useCallback((stepId: number) => {
    setActiveStep(stepId);
    const step = TIMELINE_STEPS.find(s => s.id === stepId);
    if (step) {
      trackJourneyStep(stepId, step.title);
    }
  }, []);

  const handleAskAssistant = useCallback((stepTitle: string) => {
    window.dispatchEvent(new CustomEvent('ask-assistant', { 
      detail: `Can you explain the requirements and details for ${stepTitle} in the Indian election process?` 
    }));
  }, []);

  return (
    <div 
      role="list" 
      aria-label="Indian voter journey timeline with 4 steps"
      style={{ position: 'relative', paddingLeft: 'var(--spacing-md)' }}
    >
      {/* Vertical Progress Line */}
      <div 
        aria-hidden="true"
        style={{ 
          position: 'absolute', 
          left: '32px', 
          top: '20px', 
          bottom: '20px', 
          width: '2px', 
          background: 'var(--color-surface-hover)',
          zIndex: 0
        }} 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', position: 'relative', zIndex: 1 }}>
        {TIMELINE_STEPS.map((step) => {
          const isActive = step.id === activeStep;
          const isPast = step.id < activeStep;

          return (
            <div 
              key={step.id} 
              role="listitem"
              aria-current={isActive ? 'step' : undefined}
              style={{ display: 'flex', gap: 'var(--spacing-lg)', opacity: isPast ? 0.7 : 1 }}
            >
              {/* Step Node Button */}
              <button 
                onClick={() => handleStepChange(step.id)}
                aria-label={`Step ${step.id}: ${step.title}${isPast ? ' (completed)' : isActive ? ' (current)' : ' (upcoming)'}`}
                aria-expanded={isActive}
                aria-controls={`step-content-${step.id}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--color-primary)' : isPast ? 'var(--color-surface-hover)' : 'var(--color-bg-base)',
                  border: `2px solid ${isActive || isPast ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: isActive ? 'white' : isPast ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 0 15px var(--color-border-glow)' : 'none'
                }}
              >
                {isPast ? <CheckCircle2 size={20} aria-hidden="true" /> : step.icon}
              </button>

              {/* Step Content */}
              <div 
                id={`step-content-${step.id}`}
                role="region"
                aria-label={`Details for step ${step.id}: ${step.title}`}
                style={{ 
                  flex: 1, 
                  background: isActive ? 'rgba(30, 41, 59, 0.9)' : 'transparent',
                  padding: isActive ? 'var(--spacing-md)' : 'var(--spacing-sm) 0',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <h4 
                  style={{ 
                    fontSize: 'var(--text-lg)', 
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleStepChange(step.id)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isActive}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleStepChange(step.id);
                    }
                  }}
                >
                  Step {step.id}: {step.title}
                </h4>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        {step.description}
                      </p>
                      <div 
                        role="note"
                        style={{ 
                          background: 'var(--color-bg-base)', 
                          padding: 'var(--spacing-sm)', 
                          borderRadius: 'var(--radius-sm)', 
                          borderLeft: '3px solid var(--color-accent)', 
                          marginBottom: 'var(--spacing-md)' 
                        }}
                      >
                        <small style={{ color: 'var(--color-text-muted)' }}>{step.details}</small>
                      </div>
                      
                      <button 
                        aria-label={`Ask CivicSync Assistant about ${step.title}`}
                        style={{ 
                          background: 'transparent', 
                          border: '1px solid var(--color-primary)', 
                          color: 'var(--color-primary)', 
                          padding: 'var(--spacing-sm) var(--spacing-md)', 
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-sm)',
                          transition: 'var(--transition-fast)'
                        }}
                        onClick={() => handleAskAssistant(step.title)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'var(--color-primary)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.background = 'var(--color-primary)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                      >
                        {step.action} <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
