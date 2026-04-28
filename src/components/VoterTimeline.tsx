import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, MapPin, FileText, Vote } from 'lucide-react';

const TIMELINE_STEPS = [
  {
    id: 1,
    title: "Eligibility Check",
    icon: <CheckCircle2 size={24} aria-hidden="true" />,
    description: "Verify your eligibility to vote. Generally, you must be a citizen, 18 years or older, and a resident of your constituency.",
    action: "Check Requirements",
    details: "Requirements can vary slightly by region. Ensure you have valid ID."
  },
  {
    id: 2,
    title: "Voter Registration",
    icon: <FileText size={24} aria-hidden="true" />,
    description: "Enroll in the electoral roll. If you've moved, you must update your address.",
    action: "Register Online",
    details: "Deadlines apply! Registration usually closes weeks before election day."
  },
  {
    id: 3,
    title: "Find Your Polling Station",
    icon: <MapPin size={24} aria-hidden="true" />,
    description: "Locate where you need to go on election day. Polling stations are assigned based on your registered address.",
    action: "Locate Station",
    details: "Your voter slip or local election website will have this information."
  },
  {
    id: 4,
    title: "Election Day",
    icon: <Vote size={24} aria-hidden="true" />,
    description: "Cast your ballot! Bring your required identification and know your polling hours.",
    action: "View Guidelines",
    details: "If you are in line before the polls close, you have the right to vote."
  }
];

/**
 * VoterTimeline component displays an interactive, step-by-step guide
 * through the voting process. Each step can be expanded for details
 * and triggers the AI assistant for more information.
 */
export const VoterTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleStepChange = (stepId: number) => {
    setActiveStep(stepId);
  };

  const handleAskAssistant = (stepTitle: string) => {
    window.dispatchEvent(new CustomEvent('ask-assistant', { 
      detail: `Can you explain the requirements and details for ${stepTitle}?` 
    }));
  };

  return (
    <div 
      role="list" 
      aria-label="Voter journey timeline with 4 steps"
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
