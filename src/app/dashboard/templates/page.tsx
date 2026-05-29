import styles from '../page.module.css';

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.onboardingSection} style={{ marginBottom: '2rem' }}>
        <div className={styles.onboardingHeader} style={{ marginBottom: '1rem' }}>
          <div>
            <h2 className={styles.onboardingTitle}>Message Templates</h2>
            <p className={styles.onboardingSubtitle}>Manage pre-approved WhatsApp message templates.</p>
          </div>
          <div className={styles.progressWrapper} style={{ textAlign: 'right' }}>
            <img 
              src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
              alt="Amira Logo" 
              style={{ height: '32px', width: 'auto', display: 'inline-block' }} 
            />
          </div>
        </div>
      </div>

      <div className={styles.statCard} style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', borderStyle: 'dashed' }}>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Message Templates Dashboard</h3>
          <p>Template list...</p>
        </div>
      </div>
    </div>
  );
}
