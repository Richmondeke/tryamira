import React from 'react';
import styles from './Tabs.module.css';

export function TabsList({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`${styles.tabsList} ${className}`}>{children}</div>;
}

export function TabTrigger({ children, active, onClick, className = '' }: { children: React.ReactNode, active?: boolean, onClick?: () => void, className?: string }) {
  return (
    <button 
      className={`${styles.tabTrigger} ${className}`} 
      data-state={active ? 'active' : 'inactive'}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
