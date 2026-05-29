'use client';

import { useState, useEffect } from 'react';
import { Joyride, Step, CallBackProps, STATUS } from 'react-joyride';

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if the user has seen the tour before
    const hasSeenTour = localStorage.getItem('amira_tour_completed');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: '#tour-overview',
      content: 'Welcome to Amira! These metrics give you a bird\'s eye view of how your AI agent is performing today.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '#tour-leads',
      content: 'Here you will find all the leads captured by your A.I agent across all channels. You can export them at any time.',
      placement: 'right',
    },
    {
      target: '#tour-chat',
      content: 'This is your Omnichannel Inbox. Monitor conversations happening on Web, WhatsApp, and Social Media live!',
      placement: 'right',
    },
    {
      target: '#tour-setup',
      content: 'Ready to deploy? Head over to the Setup tab to configure your Webchat Widget and connect your integrations.',
      placement: 'right',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('amira_tour_completed', 'true');
    }
  };

  // Only render on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#7c3aed',
          textColor: '#0a1128',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        buttonClose: {
          display: 'none',
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: '14px',
        },
        buttonNext: {
          backgroundColor: '#7c3aed',
          borderRadius: '4px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#7c3aed',
        },
        tooltip: {
          borderRadius: '8px',
          fontFamily: 'inherit',
          padding: '20px',
        },
      }}
    />
  );
}
