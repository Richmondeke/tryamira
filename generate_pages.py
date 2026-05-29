import os

pages = [
    ("chat", "Live Chat", "Monitor and respond to live chat sessions in real-time.", "Chat interface goes here..."),
    ("webchat", "WebChat Configuration", "Customize how your AI agent appears on your website.", "WebChat settings..."),
    ("email", "Email Assistance", "Configure AI to draft and reply to customer emails.", "Email settings..."),
    ("analytics", "Analytics & Insights", "View performance metrics for your AI agent and conversations.", "Charts and graphs..."),
    ("leads", "Lead Management", "View and export leads captured by your AI agent.", "Lead table goes here..."),
    ("broadcast", "WhatsApp Broadcasts", "Send bulk messages to your WhatsApp contacts.", "Broadcast campaign manager..."),
    ("drip", "WhatsApp Drip Campaigns", "Create automated WhatsApp follow-up sequences.", "Drip sequence builder..."),
    ("ai-agent", "AI Agent Knowledge Base", "Train your agent with documents, URLs, and custom prompts.", "Knowledge base upload form..."),
    ("forms", "Form Builder", "Create custom data collection forms for the AI to use.", "Form builder interface..."),
    ("tutorials", "Video Tutorials", "Learn how to maximize your Amira platform.", "Video grid..."),
    ("templates", "Message Templates", "Manage pre-approved WhatsApp message templates.", "Template list..."),
    ("channels", "Connected Channels", "Connect WhatsApp, Instagram, Messenger, and more.", "Channel grid..."),
    ("widget", "Chat Widget Customizer", "Design the look and feel of your website widget.", "Widget preview and settings..."),
    ("integrations", "Integrations", "Connect Amira to your CRM, payment gateways, and tools.", "Integration cards..."),
    ("notifications", "Notifications", "Manage your alert preferences and team notifications.", "Notification settings..."),
    ("settings", "Account Settings", "Manage your workspace, billing, and team members.", "Settings form..."),
    ("refer", "Refer & Earn", "Share Amira and earn rewards for every successful referral.", "Referral link and stats..."),
    ("partner", "Partner Program", "Join our partner program to resell Amira.", "Partner resources..."),
    ("plan", "Subscription Plan", "View and manage your current Amira subscription.", "Current plan details..."),
    ("upgrade", "Upgrade Account", "Unlock more features and higher usage limits.", "Pricing tiers...")
]

base_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/dashboard"

page_template = """import styles from '../page.module.css';

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.onboardingSection} style={{ marginBottom: '2rem' }}>
        <div className={styles.onboardingHeader} style={{ marginBottom: '1rem' }}>
          <div>
            <h2 className={styles.onboardingTitle}>{title}</h2>
            <p className={styles.onboardingSubtitle}>{subtitle}</p>
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
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>{title} Dashboard</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
"""

for slug, title, subtitle, desc in pages:
    dir_path = os.path.join(base_dir, slug)
    os.makedirs(dir_path, exist_ok=True)
    
    content = page_template.replace("{title}", title).replace("{subtitle}", subtitle).replace("{description}", desc)
    
    with open(os.path.join(dir_path, "page.tsx"), "w") as f:
        f.write(content)

print(f"Successfully created {len(pages)} dashboard pages.")
