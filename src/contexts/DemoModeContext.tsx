'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (val: boolean) => void;
  isAdmin: boolean;
}

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoMode: false,
  toggleDemoMode: () => {},
  setDemoMode: () => {},
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
  // Default Demo Mode to FALSE so signed-in users see LIVE data immediately
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_MODE_KEY);
      // If user explicitly chose demo mode in current session, respect it; otherwise always default to Live Mode (false)
      if (stored === 'true') {
        setIsDemoMode(true);
      } else {
        setIsDemoMode(false);
        localStorage.setItem(DEMO_MODE_KEY, 'false');
      }
      setMounted(true);
    }
  }, []);

  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_MODE_KEY, String(next));
      }
      return next;
    });
  };

  const setDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_MODE_KEY, String(val));
    }
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, setDemoMode, isAdmin: isAdminUser }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export const useDemoMode = () => useContext(DemoModeContext);
