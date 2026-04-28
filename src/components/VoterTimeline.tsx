import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, MapPin, FileText, Vote } from 'lucide-react';

const TIMELINE_STEPS = [
  {
    id: 1,
    title: "Eligibility Check",
    icon: <CheckCircle2 size={24} />,
    description: "Verify your eligibility to vote. Generally, you must be a citizen, 18 years or older, and a resident of your constituency.",
    action: "Check Requirements",
    details: "Requirements can vary slightly by region. Ensure you have valid ID."
  },
  {
    id: 2,
    title: "Voter Registration",
    icon: <FileText size={24} />,
    description: "Enroll in the electoral roll. If you've moved, you must update your address.",
    action: "Register Online",
    details: "Deadlines apply! Registration usually closes weeks before election day."
  },
  {
    id: 3,
    title: "Find Your Polling Station",
    icon: <MapPin size={24} />,
    description: "Locate where you need to go on election day. Polling stations are assigned based on your registered address.",
    action: "Locate Station",
    details: "Your voter slip or local election website will have this information."
  },
  {
    id: 4,
    title: "Election Day",
    icon: <Vote size={24} />,
    description: "Cast your ballot! Bring your required identification and know your polling hours.",
    action: "View Guidelines",
    details: "If you are in line before the polls close, you have the right to vote."
  }
];

export const VoterTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div style={{ position: 'relative', paddingLeft: 'var(--spacing-md)' }}>
      {/* Vertical Line */}
      <div style={{ 
        position: 'absolute', 
        left: '32px', 
        top: '20px', 
        bottom: '20px', 
        width: '2px', 
        background: 'var(--color-surface-hover)',
        zIndex: 0
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', position: 'relative', zIndex: 1 }}>
        {TIMELINE_STEPS.map((step, index) => {
          const isActive = step.id === activeStep;
          const isPast = step.id < activeStep;

          return (
            <div 
              key={step.id} 
              style={{ display: 'flex', gap: 'var(--spacing-lg)', opacity: isPast ? 0.7 : 1 }}
            >
              {/* Node Icon */}
              <button 
                onClick={() => setActiveStep(step.id)}
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
                {isPast ? <CheckCircle2 size={20} /> : step.icon}
              </button>

              {/* Content Box */}
              <div 
                style={{ 
                  flex: 1, 
                  background: isActive ? 'rgba(30, 41, 59, 0.9)' : 'transparent',
                  padding: isActive ? 'var(--spacing-md)' : 'var(--spacing-sm) 0',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <h4 style={{ 
                  fontSize: 'var(--text-lg)', 
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveStep(step.id)}
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
                      <div style={{ background: 'var(--color-bg-base)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)', marginBottom: 'var(--spacing-md)' }}>
                        <small style={{ color: 'var(--color-text-muted)' }}>{step.details}</small>
                      </div>
                      
                      <button style={{ 
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
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('ask-assistant', { 
                          detail: `Can you explain the requirements and details for ${step.title}?` 
                        }));
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--color-primary)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-primary)';
                      }}
                      >
                        {step.action} <ArrowRight size={14} />
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
