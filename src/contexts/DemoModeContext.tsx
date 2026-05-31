'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  isAdmin: boolean;
}

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoMode: false,
  toggleDemoMode: () => {},
  isAdmin: false,
});

const DEMO_MODE_KEY = 'amira_demo_mode';

export function DemoModeProvider({
  children,
  isAdminUser = false,
}: {
  children: React.ReactNode;
  isAdminUser?: boolean;
}) {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (isAdminUser && typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_MODE_KEY);
      setIsDemoMode(stored === 'true');
    }
  }, [isAdminUser]);

  const toggleDemoMode = () => {
    if (!isAdminUser) return;
    setIsDemoMode(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_MODE_KEY, String(next));
      }
      return next;
    });
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, isAdmin: isAdminUser }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export const useDemoMode = () => useContext(DemoModeContext);
