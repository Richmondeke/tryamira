'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('amira_onboarding_completed');
    if (!hasSeenOnboarding) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem('amira_onboarding_completed', 'true');
  };

  const steps = [
    { id: 1, icon: '📝', title: 'Name Agent', description: 'Give your new AI agent a name so customers know who they are talking to.' },
    { id: 2, icon: '🔌', title: 'Connect Channel', description: 'Connect WhatsApp, Messenger, or Instagram so your agent can start receiving messages.' },
    { id: 3, icon: '🧠', title: 'Train AI', description: 'Upload your FAQs and business details so your agent knows how to answer.' },
    { id: 4, icon: '🎯', title: 'Free Trial', description: 'Start your 14-day free trial to unlock all premium capabilities without limits.' },
    { id: 5, icon: '🎉', title: "You're Ready!", description: 'Your agent is fully set up and ready to automate your customer support and lead generation.' }
  ];

  const activeStep = steps.find(s => s.id === currentStep) || steps[0];

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} title="">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--stripe-navy)', margin: 0, letterSpacing: '-0.4px' }}>
          Welcome to Amira 👋
        </h2>
        <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: 'var(--stripe-muted)', fontSize: '12px', cursor: 'pointer' }}>
          Skip setup
        </button>
      </div>

      <style>{`
        .onboarding-step-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
        }
        .onboarding-step-icon {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .onboarding-step-title {
          font-size: 11px;
          text-align: center;
        }
        @media (max-width: 500px) {
          .onboarding-step-icon {
            width: 32px !important;
            height: 32px !important;
            font-size: 14px !important;
          }
          .onboarding-step-title {
            display: none;
          }
          .onboarding-progress-line {
            top: 16px !important;
          }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
        {/* Progress Line */}
        <div className="onboarding-progress-line" style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', backgroundColor: '#e3e8ee', zIndex: 0 }}></div>
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div key={step.id} className="onboarding-step-wrapper">
              <div 
                className="onboarding-step-icon"
                style={{ 
                  width: '48px', height: '48px', 
                  backgroundColor: isCompleted ? '#15be53' : (isActive ? '#f6f9fc' : '#ffffff'),
                  border: isActive ? '2px solid var(--stripe-purple)' : (isCompleted ? 'none' : '1px solid var(--stripe-border)'),
                  boxShadow: isActive ? '0 0 0 4px rgba(99,91,255,0.1)' : 'none',
                  color: isCompleted ? '#fff' : 'inherit',
                  fontSize: '20px'
                }}
              >
                {isCompleted ? (
                  <svg width="18" height="14" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span 
                className="onboarding-step-title"
                style={{ 
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--stripe-purple)' : (isCompleted ? '#15be53' : 'var(--stripe-muted)'),
                }}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--stripe-navy)', marginBottom: '0.5rem' }}>
          {activeStep.title}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--stripe-body)', margin: 0, lineHeight: 1.5 }}>
          {activeStep.description}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => {
            if (currentStep < 5) {
              setCurrentStep(currentStep + 1);
            } else {
              handleSkip();
            }
          }}
          style={{ 
            width: '100%', padding: '0.75rem', 
            backgroundColor: 'var(--stripe-purple)', color: '#ffffff', 
            border: 'none', borderRadius: '4px', fontSize: '13px', 
            fontWeight: 500, cursor: 'pointer',
            boxShadow: 'var(--stripe-shadow-action)'
          }}
        >
          {currentStep === 5 ? "Finish Setup" : activeStep.title}
        </button>
        <span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>
          Step {currentStep} of 5
        </span>
      </div>
    </Modal>
  );
}
