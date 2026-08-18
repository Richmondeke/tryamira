import React from 'react';
import { AmiraLogo } from '../ui/AmiraLogo';
import styles from './AuthLayout.module.css';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <AmiraLogo size={42} style={{ color: '#ffffff' }} />
        </div>

        {/* Flush Bottom & Full-Width Amirascale Illustration with On-Load Entrance */}
        <div className={styles.imageContainer}>
          <img 
            src="/amirascale.png" 
            alt="Amira AI Global Workforce" 
            className={styles.scaleImage}
          />
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.rightPanelContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
