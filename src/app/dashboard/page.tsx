import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export default function OverviewPage() {
  return (
    <div className={styles.container}>
      <div className={styles.onboardingSection} style={{ marginBottom: '1rem', background: 'transparent', padding: '1rem 0', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Welcome back, Ashley</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Here's what's happening with your AI agent today.</p>
          </div>
          <img 
            src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
            alt="Amira Logo" 
            style={{ height: '40px', width: 'auto' }} 
          />
        </div>
      </div>

      <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Conversations</div>
            <div className={styles.statValue}>1,248</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>AI Resolutions</div>
            <div className={styles.statValue}>984</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>New Leads</div>
            <div className={styles.statValue}>142</div>
          </div>
        </div>

        <section className={styles.onboardingSection}>
          <div className={styles.onboardingHeader}>
            <div>
              <h2 className={styles.onboardingTitle}>TryAmira configuration</h2>
              <p className={styles.onboardingSubtitle}>Complete these steps to fully unlock your AI agent's potential.</p>
            </div>
            <div className={styles.progressWrapper}>
              <div className={styles.progressText}>1 / 4 Completed</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
            </div>
          </div>

          <div className={styles.tasksGrid}>
            <div className={styles.taskCard}>
              <div className={styles.taskIcon}>✓</div>
              <div className={styles.taskContent}>
                <h3 className={styles.taskTitle}>Connect WhatsApp</h3>
                <p className={styles.taskDesc}>Your primary channel is connected successfully.</p>
                <Button variant="secondary" size="sm">Manage Connection</Button>
              </div>
            </div>
            <div className={styles.taskCard}>
              <div className={styles.taskIcon}>2</div>
              <div className={styles.taskContent}>
                <h3 className={styles.taskTitle}>Upload Knowledgebase</h3>
                <p className={styles.taskDesc}>Train your AI agent with your business documents and FAQs.</p>
                <Button size="sm">Upload Data</Button>
              </div>
            </div>
            <div className={styles.taskCard}>
              <div className={styles.taskIcon}>3</div>
              <div className={styles.taskContent}>
                <h3 className={styles.taskTitle}>Customize Webchat</h3>
                <p className={styles.taskDesc}>Match the widget to your website's branding and colors.</p>
                <Button size="sm">Customize</Button>
              </div>
            </div>
            <div className={styles.taskCard}>
              <div className={styles.taskIcon}>4</div>
              <div className={styles.taskContent}>
                <h3 className={styles.taskTitle}>Deploy AI Agent</h3>
                <p className={styles.taskDesc}>Enable the AI agent to start answering customer queries automatically.</p>
                <Button size="sm">Deploy</Button>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
