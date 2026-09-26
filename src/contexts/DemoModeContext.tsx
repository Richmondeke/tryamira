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
  // Permanently set to false — Demo Mode is removed for live production
  const isDemoMode = false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_MODE_KEY, 'false');
    }
  }, []);

  const toggleDemoMode = () => {};
  const setDemoMode = (_val: boolean) => {};

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, setDemoMode, isAdmin: isAdminUser }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export const useDemoMode = () => useContext(DemoModeContext);
