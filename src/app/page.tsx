"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import styles from "./page.module.css";

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState<"monthly" | "annually">("monthly");
  const [currentLang, setCurrentLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languagesList = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'yo', label: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', label: 'Igbo', flag: '🇳🇬' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const trans = getCookie('googtrans');
    if (trans) {
      const code = trans.split('/').pop();
      if (code) setCurrentLang(code);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=` + window.location.hostname;
    }
    window.location.reload();
  };
  const [activeFeatureTab, setActiveFeatureTab] = useState<"channels" | "knowledge" | "automation">("channels");
  const [liveTranscript, setLiveTranscript] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);
  const [currentCallStatus, setCurrentCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const [vapiCallActive, setVapiCallActive] = useState(false);
  const [vapiLoading, setVapiLoading] = useState(false);
  const [crmLeads, setCrmLeads] = useState<Array<{ name: string; phone: string; status: string; date: string }>>([
    { name: "John Doe", phone: "+1 (555) 019-2834", status: "Qualified", date: "Just now" },
    { name: "Sarah Jenkins", phone: "+1 (555) 048-1290", status: "Booked Call", date: "2 mins ago" },
    { name: "Marcus Kincaid", phone: "+44 20 7946 0958", status: "Replied", date: "15 mins ago" },
  ]);

  // Handle mock live caller simulation
  useEffect(() => {
    if (currentCallStatus === "calling") {
      const timer = setTimeout(() => {
        setCurrentCallStatus("connected");
        setLiveTranscript([{ sender: "ai", text: "Thank you for calling Amira support. How can I help you scale today?" }]);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentCallStatus === "connected") {
      const dialogue = [
        { delay: 3000, sender: "user", text: "Hi, I need to know if Amira integrates with Salesforce and Hubspot CRM." },
        { delay: 6000, sender: "ai", text: "Yes! Amira has direct native integrations with Salesforce, HubSpot, and 1,000+ other apps via Zapier. It logs transcripts and details instantly." },
        { delay: 9500, sender: "user", text: "That is perfect. Can I set up a free trial to test the voice response latency?" },
        { delay: 12500, sender: "ai", text: "Absolutely. I've just sent a trial link to your mobile number. You can be live in under 5 minutes!" },
        { delay: 15500, sender: "user", text: "Awesome, thank you!" },
        { delay: 17500, sender: "ai", text: "You're welcome! Have a great day." }
      ];

      const timers = dialogue.map((line) => {
        return setTimeout(() => {
          setLiveTranscript((prev) => [...prev, { sender: line.sender as "user" | "ai", text: line.text }]);
          if (line.text.includes("trial link")) {
            // Auto add to CRM
            setCrmLeads((prev) => [
              { name: "New Visitor", phone: "+1 (555) 012-7890", status: "Qualified", date: "Just now" },
              ...prev
            ]);
          }
        }, line.delay);
      });

      const endTimer = setTimeout(() => {
        setCurrentCallStatus("ended");
      }, 20000);

      return () => {
        timers.forEach((t) => clearTimeout(t));
        clearTimeout(endTimer);
      };
    }
  }, [currentCallStatus]);

  const startDemoCall = () => {
    setLiveTranscript([]);
    setCurrentCallStatus("calling");
  };

  const handleTalkToAmira = () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';

    if (!publicKey || !assistantId) {
      alert('Live demo is being set up. In the meantime, try the interactive simulation below!');
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (vapiCallActive) {
      const vapi = (window as any).vapi;
      if (vapi) vapi.stop();
      setVapiCallActive(false);
      return;
    }

    setVapiLoading(true);
    const vapi = (window as any).vapi;
    if (!vapi) {
      alert('Please wait a moment and try again.');
      setVapiLoading(false);
      return;
    }

    vapi.start(assistantId);
    vapi.on('call-start', () => { setVapiCallActive(true); setVapiLoading(false); });
    vapi.on('call-end', () => { setVapiCallActive(false); setVapiLoading(false); });
    vapi.on('error', () => { setVapiCallActive(false); setVapiLoading(false); });
  };

  return (
    <div className={styles.container}>
      {/* BACKGROUND GRAPHICS */}
      <div className={styles.gridBg} />
      <div className={styles.glowTop} />

      {/* NAV BAR */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <a href="#" className={styles.navLogo}>
            <img 
              src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
              alt="Amira Logo" 
              className={styles.navLogoImg} 
            />
            
          </a>
          
          <ul className={styles.navLinks}>
            <li><a href="#features" className={styles.navLink}>Features</a></li>
            <li><a href="#agents" className={styles.navLink}>Agent Library</a></li>
            <li><a href="#how-it-works" className={styles.navLink}>How It Works</a></li>
            <li><a href="#pricing" className={styles.navLink}>Pricing</a></li>
            <li><a href="#demo" className={styles.navLink}>Live Demo</a></li>
          </ul>

          <div className={styles.navActions}>
            {/* Custom Language Switcher */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  padding: '8px 14px', 
                  borderRadius: '30px', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                  color: '#ffffff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <span style={{ fontSize: '15px' }}>
                  {languagesList.find(l => l.code === currentLang)?.flag || '🇺🇸'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {languagesList.find(l => l.code === currentLang)?.label || 'English'}
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>▼</span>
              </button>
              
              {showLangMenu && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  marginTop: '8px', 
                  backgroundColor: '#061b31', // Premium dark navy to match landing page
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  borderRadius: '10px', 
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', 
                  zIndex: 9999, 
                  minWidth: '155px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '6px',
                  backdropFilter: 'blur(12px)'
                }}>
                  {languagesList.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '8px 12px',
                        width: '100%',
                        border: 'none',
                        background: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.85)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: currentLang === lang.code ? 600 : 400,
                        backgroundColor: currentLang === lang.code ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = currentLang === lang.code ? 'rgba(255, 255, 255, 0.08)' : 'transparent';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="/dashboard" className={styles.navSignIn}>Login</a>
            <a href="#demo" className={styles.navSecondaryBtn}>Talk to Sales</a>
            <a href="/dashboard" className={styles.navCta}>Start Free Trial</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeHighlight}>AI Voice Employees</span>
            <span className={styles.heroBadgeText}>For Sales, Support &amp; Scheduling — 24/7</span>
          </div>

          <h1 className={styles.heroTitle}>
            Hire an AI that<br />
            <span className={styles.textAccent}>answers every call.</span><br />
            Close every deal.
          </h1>

          <p className={styles.heroSubtitle}>
            Amira is the AI receptionist, sales rep, and support agent that never sleeps.
            Connect your phone lines, qualify leads automatically, and close more — without hiring.
          </p>

          {/* VAPI Web SDK — loads once, initialises global vapi instance */}
          <Script
            src="https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/vapi.umd.js"
            strategy="afterInteractive"
            onLoad={() => {
              const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
              if (publicKey && (window as any).Vapi) {
                (window as any).vapi = new (window as any).Vapi(publicKey);
              }
            }}
          />

          <div className={styles.vapiWidgetContainer}>
            <div className={styles.vapiWidgetInner}>
              <button
                className={styles.vapiButton}
                onClick={handleTalkToAmira}
                disabled={vapiLoading}
                style={{ opacity: vapiLoading ? 0.7 : 1, cursor: vapiLoading ? 'wait' : 'pointer' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.vapiIcon}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {vapiLoading ? 'Connecting...' : vapiCallActive ? '⏹ End Call' : 'Talk to Amira'}
              </button>
            </div>
            <div className={styles.vapiMeta}>
              <span className={styles.vapiMetaText}>
                {vapiCallActive ? '🟢 Live call active — speak now' : 'Mic permissions needed • No credit card required'}
              </span>
            </div>
          </div>

          {/* INTERACTIVE DASHBOARD DEMO CONTAINER */}
          <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
              <div className={styles.headerDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <div className={styles.headerTitle}>Amira Agent Dashboard v2.1</div>
              <div className={styles.headerStatus}>
                <span className={styles.pulseIndicator} />
                System Active
              </div>
            </div>

            <div className={styles.dashboardBody}>
              {/* Sidebar */}
              <div className={styles.dashSidebar}>
                <div className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}>
                  <span className={styles.sidebarIcon}>📞</span> Inbound Voice Lines
                </div>
                <div className={styles.sidebarItem}>
                  <span className={styles.sidebarIcon}>🤖</span> Voice AI Profiles
                </div>
                <div className={styles.sidebarItem}>
                  <span className={styles.sidebarIcon}>📈</span> Campaign Dialer
                </div>
                <div className={styles.sidebarItem}>
                  <span className={styles.sidebarIcon}>🗂️</span> CRM Integrations
                </div>
                <div className={styles.sidebarItem}>
                  <span className={styles.sidebarIcon}>⚙️</span> Settings
                </div>
              </div>

              {/* Main Content Area */}
              <div className={styles.dashMain}>
                <div className={styles.dashGrid}>
                  {/* Left Column - Live Caller Console */}
                  <div className={styles.consoleCard}>
                    <div className={styles.cardHeader}>
                      <h3>Live Calling Console</h3>
                      {currentCallStatus === "connected" && (
                        <span className={styles.badgeLive}>Connected</span>
                      )}
                      {currentCallStatus === "calling" && (
                        <span className={styles.badgeCalling}>Dialing...</span>
                      )}
                      {currentCallStatus === "ended" && (
                        <span className={styles.badgeEnded}>Call Ended</span>
                      )}
                      {currentCallStatus === "idle" && (
                        <span className={styles.badgeIdle}>Ready</span>
                      )}
                    </div>
                    
                    <div className={styles.transcriptBox}>
                      {currentCallStatus === "idle" && (
                        <div className={styles.emptyTranscript}>
                          <span className={styles.emptyIcon}>🎙️</span>
                          <p>Click below to simulate a real customer call with Amira</p>
                          <button onClick={startDemoCall} className={styles.simulateBtn}>
                            Simulate Call
                          </button>
                        </div>
                      )}

                      {currentCallStatus !== "idle" && (
                        <div className={styles.transcriptLines}>
                          {liveTranscript.map((line, index) => (
                            <div 
                              key={index} 
                              className={`${styles.transcriptBubble} ${
                                line.sender === "ai" ? styles.bubbleAi : styles.bubbleUser
                              }`}
                            >
                              <div className={styles.bubbleSender}>
                                {line.sender === "ai" ? "Amira (AI Agent)" : "Customer"}
                              </div>
                              <div className={styles.bubbleText}>{line.text}</div>
                            </div>
                          ))}
                          {currentCallStatus === "calling" && (
                            <div className={styles.dialingState}>
                              <span className={styles.spinner} /> Calling demo interface...
                            </div>
                          )}
                          {currentCallStatus === "connected" && liveTranscript.length % 2 === 1 && (
                            <div className={styles.typingState}>
                              <span></span><span></span><span></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {currentCallStatus !== "idle" && (
                      <div className={styles.consoleFooter}>
                        <button 
                          onClick={() => setCurrentCallStatus("idle")} 
                          className={styles.resetBtn}
                        >
                          Reset Simulation
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Live CRM Leads feed */}
                  <div className={styles.crmCard}>
                    <div className={styles.cardHeader}>
                      <h3>Automated CRM Feeds</h3>
                      <span className={styles.crmSyncBadge}>Synced</span>
                    </div>

                    <div className={styles.leadsList}>
                      {crmLeads.map((lead, index) => (
                        <div key={index} className={styles.leadItem}>
                          <div className={styles.leadInfo}>
                            <div className={styles.leadName}>{lead.name}</div>
                            <div className={styles.leadPhone}>{lead.phone}</div>
                          </div>
                          <div className={styles.leadMeta}>
                            <span className={`${styles.leadStatus} ${
                              lead.status === "Qualified" ? styles.statusQual : styles.statusBook
                            }`}>
                              {lead.status}
                            </span>
                            <div className={styles.leadTime}>{lead.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* INTEGRATIONS TICKER */}
      <section className={styles.trusted}>
        <div className={styles.trustedContainer}>
          <p className={styles.trustedLabel}>Integrates with your tools and takes action in real time</p>
          <div style={{ overflow: 'hidden', position: 'relative', width: '100%', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', animation: 'amiraTicker 30s linear infinite', width: 'max-content' }}>
              {['HubSpot', 'Salesforce', 'Slack', 'Gmail', 'Stripe', 'Google Calendar', 'GoHighLevel', 'Notion', 'Airtable', 'Shopify', 'Calendly', 'Zendesk', 'Twilio', 'WhatsApp Business', 'Monday.com', 'Pipedrive', 'Zoho CRM', 'QuickBooks', 'DocuSign', 'Mailchimp', '1,000+ More', 'HubSpot', 'Salesforce', 'Slack', 'Gmail', 'Stripe', 'Google Calendar', 'GoHighLevel', 'Notion', 'Airtable', 'Shopify', 'Calendly', 'Zendesk', 'Twilio', 'WhatsApp Business', 'Monday.com', 'Pipedrive', 'Zoho CRM', 'QuickBooks', 'DocuSign', 'Mailchimp', '1,000+ More'].map((tool, i) => (
                <span key={i} style={{ whiteSpace: 'nowrap', padding: '7px 18px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '13px', fontWeight: tool === '1,000+ More' ? 700 : 500, color: tool === '1,000+ More' ? '#818cf8' : 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', letterSpacing: '0.01em' }}>{tool}</span>
              ))}
            </div>
          </div>
          <style>{`@keyframes amiraTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        </div>
      </section>

      {/* GO LIVE IN 5 MINUTES */}
      <section className={styles.featureBlock}>
        <div className={styles.innerBlockCentered}>
          <span className={styles.sectionTag}>Instant Deployment</span>
          <h2 className={styles.sectionTitle}>Go Live in Under 5 Minutes.</h2>
          <p className={styles.sectionSubtitle}>
            No code. No tech team. No waiting. Sign up, connect your number, and your AI is live today.
          </p>
        </div>
      </section>

      {/* SPLIT SCREEN FEATURES (MIRRORING JOHA) */}
      <section className={styles.splitFeatures} id="features">
        <div className={styles.splitContainer}>
          
          {/* BLOCK 1: Connect channels */}
          <div className={styles.splitRow}>
            <div className={styles.splitTextCol}>
              <span className={styles.rowTag}>Step 1</span>
              <h3 className={styles.rowTitle}>Connect every phone line in 60 seconds. Zero IT.</h3>
              <p className={styles.rowSubtitle}>
                Inbound support lines. Outbound dialing. Web call widgets. All in one dashboard.
              </p>
              <ul className={styles.rowList}>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Local &amp; international numbers in 40+ countries
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Web voice call widget, ready with one line of code
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  All channels active simultaneously from day one
                </li>
              </ul>
            </div>
            <div className={styles.splitGraphicCol}>
              <div className={styles.graphicBox}>
                <div className={styles.channelWidget}>
                  <div className={styles.channelItem}>
                    <div className={styles.channelIconBg}>📞</div>
                    <div>
                      <div className={styles.channelName}>Twilio Integration</div>
                      <div className={styles.channelStatus}>Connected</div>
                    </div>
                  </div>
                  <div className={styles.channelItem}>
                    <div className={styles.channelIconBg}>🌐</div>
                    <div>
                      <div className={styles.channelName}>Web Widget</div>
                      <div className={styles.channelStatus}>Connected</div>
                    </div>
                  </div>
                  <div className={styles.channelItem}>
                    <div className={styles.channelIconBg}>🧬</div>
                    <div>
                      <div className={styles.channelName}>Telnyx Trunking</div>
                      <div className={styles.channelStatus}>Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 2: Teach business */}
          <div className={`${styles.splitRow} ${styles.rowInverse}`}>
            <div className={styles.splitTextCol}>
              <span className={styles.rowTag}>Step 2</span>
              <h3 className={styles.rowTitle}>Train your AI on your business — in minutes.</h3>
              <p className={styles.rowSubtitle}>
                Your knowledge. Your voice. Fully automated.
              </p>
              <ul className={styles.rowList}>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Upload FAQs, PDFs, and sales scripts in any format
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Set custom brand voice, vocabulary, and escalation rules
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Test your AI's voice responses in real time before going live
                </li>
              </ul>
            </div>
            <div className={styles.splitGraphicCol}>
              <div className={styles.graphicBox}>
                <div className={styles.knowledgeWidget}>
                  <div className={styles.knowledgeHeader}>
                    <span>Knowledge Source</span>
                    <button className={styles.uploadBtn}>+ Upload</button>
                  </div>
                  <div className={styles.fileItem}>
                    <span>📄 Product_Catalog_2026.pdf</span>
                    <span className={styles.fileStatus}>Trained</span>
                  </div>
                  <div className={styles.fileItem}>
                    <span>📄 Support_FAQ_Sheet.txt</span>
                    <span className={styles.fileStatus}>Trained</span>
                  </div>
                  <div className={styles.fileItem}>
                    <span>📄 Outbound_Script.md</span>
                    <span className={styles.fileStatus}>Trained</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 3: Go live / Autopilot */}
          <div className={styles.splitRow}>
            <div className={styles.splitTextCol}>
              <span className={styles.rowTag}>Step 3</span>
              <h3 className={styles.rowTitle}>Go live. Let your AI run voice operations on autopilot.</h3>
              <p className={styles.rowSubtitle}>
                Every call answered. Every lead qualified. Every customer served.
              </p>
              <ul className={styles.rowList}>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Instant voice responses with ultra-low latency (under 500ms)
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Every call auto-captured as a structured CRM contact
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  One-click live handoff to your human team when it matters
                </li>
              </ul>
            </div>
            <div className={styles.splitGraphicCol}>
              <div className={styles.graphicBox}>
                <div className={styles.autopilotWidget}>
                  <div className={styles.autopilotTitle}>Active Calls Processing</div>
                  <div className={styles.activeCallList}>
                    <div className={styles.activeCallItem}>
                      <div className={styles.avatarMini}>AM</div>
                      <div className={styles.activeCallDetails}>
                        <div className={styles.activeCallNumber}>+1 (555) 492-2034</div>
                        <div className={styles.activeCallProgress}>Solving Billing issue • 1m 45s</div>
                      </div>
                      <div className={styles.liveBadgeMini}>Live</div>
                    </div>
                    <div className={styles.activeCallItem}>
                      <div className={styles.avatarMini}>AM</div>
                      <div className={styles.activeCallDetails}>
                        <div className={styles.activeCallNumber}>+1 (555) 782-9012</div>
                        <div className={styles.activeCallProgress}>Booking Appointment • 42s</div>
                      </div>
                      <div className={styles.liveBadgeMini}>Live</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 4: Dynamic Tool Integrations & Actions */}
          <div className={`${styles.splitRow} ${styles.rowInverse}`}>
            <div className={styles.splitTextCol}>
              <span className={styles.rowTag}>Step 4</span>
              <h3 className={styles.rowTitle}>Connect your stack. Trigger actions on every call.</h3>
              <p className={styles.rowSubtitle}>
                Allow your AI voice agent to read, write, and execute tasks across 1,000+ business applications in real time during a call.
              </p>
              <ul className={styles.rowList}>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Sync CRM pipelines instantly (Salesforce, HubSpot, GoHighLevel)
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Trigger instant notifications and updates (Gmail, Slack, Twilio)
                </li>
                <li>
                  <span className={styles.listCheck}>✓</span>
                  Process secure payments, top-ups, and transactions (Stripe)
                </li>
              </ul>
            </div>
            <div className={styles.splitGraphicCol}>
              <div className={styles.graphicBox}>
                <div className={styles.integrationsWidget}>
                  <div className={styles.integrationsHeader}>
                    <span>App Integrations Status</span>
                    <span className={styles.liveBadgeMini}>Live Sync</span>
                  </div>
                  <div className={styles.integrationsList}>
                    <div className={styles.integrationItem}>
                      <span className={styles.integrationLogo}>🟠</span>
                      <div className={styles.integrationDetails}>
                        <div className={styles.integrationName}>HubSpot CRM</div>
                        <div className={styles.integrationAction}>Updating deal stage...</div>
                      </div>
                      <span className={styles.integrationState}>Active</span>
                    </div>
                    <div className={styles.integrationItem}>
                      <span className={styles.integrationLogo}>💬</span>
                      <div className={styles.integrationDetails}>
                        <div className={styles.integrationName}>Slack Channel</div>
                        <div className={styles.integrationAction}>Sending call logs...</div>
                      </div>
                      <span className={styles.integrationState}>Active</span>
                    </div>
                    <div className={styles.integrationItem}>
                      <span className={styles.integrationLogo}>💳</span>
                      <div className={styles.integrationDetails}>
                        <div className={styles.integrationName}>Stripe Payments</div>
                        <div className={styles.integrationAction}>Awaiting charge...</div>
                      </div>
                      <span className={styles.integrationState}>Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE CAPABILITIES GRID (MIRRORING JOHA) */}
      <section className={styles.capabilities} id="how-it-works">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Key Advantages</span>
          <h2 className={styles.sectionTitle}>Build once. Let it handle every call.</h2>
          <p className={styles.sectionSubtitle}>
            24/7 availability. Human-quality voice. Zero overhead.
          </p>
        </div>

        <div className={styles.capabilitiesGrid}>
          {/* CARD 1 */}
          <div className={styles.capabilityCard}>
            <div className={styles.capIcon}>🎙️</div>
            <h4 className={styles.capTitle}>One setup. Handles every call, every time.</h4>
            <p className={styles.capDesc}>
              Amira works across all your local lines, toll-free numbers, and website widgets.
              Train on your PDF catalogs, txt instructions, or pricing files.
            </p>
          </div>

          {/* CARD 2 */}
          <div className={styles.capabilityCard}>
            <div className={styles.capIcon}>📊</div>
            <h4 className={styles.capTitle}>Every call becomes a lead. Automatically.</h4>
            <p className={styles.capDesc}>
              Your CRM fills itself while you sleep. Auto-capture names, phone numbers,
              deal stages, and sentiment analytics directly into your unified dashboard.
            </p>
          </div>

          {/* CARD 3 */}
          <div className={styles.capabilityCard}>
            <div className={styles.capIcon}>🚀</div>
            <h4 className={styles.capTitle}>Reach thousands of leads in one click.</h4>
            <p className={styles.capDesc}>
              Import lead lists and fire automated outbound call sequences. Amira rings
              them up, pitches your offers, answers objections, and captures results.
            </p>
          </div>

          {/* CARD 4 */}
          <div className={styles.capabilityCard}>
            <div className={styles.capIcon}>🤝</div>
            <h4 className={styles.capTitle}>Your whole team, one dashboard.</h4>
            <p className={styles.capDesc}>
              Review transcripts, listen to voice recordings, assign call actions, and leave internal notes.
              Connect Zapier, Salesforce, Hubspot, and GoHighLevel in seconds.
            </p>
          </div>

          {/* CARD 5 */}
          <div className={styles.capabilityCard}>
            <div className={styles.capIcon}>📅</div>
            <h4 className={styles.capTitle}>Talk to them. Book them. In the same place.</h4>
            <p className={styles.capDesc}>
              Sync your Google Calendar or Cal.com. Amira answers available slot times,
              books appointments, and sends confirmations without you lifting a finger.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CALLING PLAYGROUND */}
      <section className={styles.demoPlayground} id="demo">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Live Playground</span>
          <h2 className={styles.sectionTitle}>Hear Amira in Action</h2>
          <p className={styles.sectionSubtitle}>
            Every word, every pause, every response — indistinguishable from a human. Hear it yourself.
          </p>
        </div>
        
        <div className={styles.demoFrame}>
          <iframe 
            src="https://amira-call-demo.vercel.app/" 
            title="Amira Interactive Call Demo"
            allow="microphone"
            className={styles.demoIframe}
          />
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className={styles.pricing} id="pricing">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Pricing Plans</span>
          <h2 className={styles.sectionTitle}>Scale at Your Own Pace</h2>
          <p className={styles.sectionSubtitle}>
            Transparent, flexible billing based on call volume. Upgrade or cancel anytime.
          </p>

          <div className={styles.toggleContainer}>
            <button 
              className={`${styles.toggleBtn} ${activePlan === "monthly" ? styles.toggleActive : ""}`}
              onClick={() => setActivePlan("monthly")}
            >
              Billed Monthly
            </button>
            <button 
              className={`${styles.toggleBtn} ${activePlan === "annually" ? styles.toggleActive : ""}`}
              onClick={() => setActivePlan("annually")}
            >
              Billed Annually <span className={styles.discountBadge}>Save 20%</span>
            </button>
          </div>
        </div>

        <div className={styles.pricingGrid}>
          {/* STARTER */}
          <div className={styles.pricingCard}>
            <h4 className={styles.planName}>Starter</h4>
            <p className={styles.planDesc}>Perfect for solo operators and small projects testing out AI voice support.</p>
            <div className={styles.planPrice}>
              ${activePlan === "monthly" ? "49" : "39"}<span>/mo</span>
            </div>
            <p className={styles.planPeriod}>Billed {activePlan}</p>
            
            <ul className={styles.planFeatures}>
              <li>500 call minutes included</li>
              <li>1 custom AI phone line</li>
              <li>Knowledge base training (up to 5MB)</li>
              <li>Basic dashboard logs &amp; analytics</li>
              <li>Webhooks &amp; email support</li>
            </ul>

            <a href="#" className={`${styles.btnPlan} ${styles.btnPlanOutline}`}>Start Free Trial</a>
          </div>

          {/* PROFESSIONAL */}
          <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
            <div className={styles.popularBadge}>Most Popular</div>
            <h4 className={styles.planName}>Professional</h4>
            <p className={styles.planDesc}>Ideal for growing teams automating medium to high voice support volume.</p>
            <div className={styles.planPrice}>
              ${activePlan === "monthly" ? "199" : "159"}<span>/mo</span>
            </div>
            <p className={styles.planPeriod}>Billed {activePlan}</p>
            
            <ul className={styles.planFeatures}>
              <li>3,000 call minutes included</li>
              <li>5 custom AI phone lines</li>
              <li>Unlimited document training space</li>
              <li>Smart human handoff &amp; escalation</li>
              <li>Advanced dashboard analytics &amp; CRM</li>
              <li>Priority customer support</li>
            </ul>

            <a href="#" className={`${styles.btnPlan} ${styles.btnPlanFilled}`}>Go Professional</a>
          </div>

          {/* ENTERPRISE */}
          <div className={styles.pricingCard}>
            <h4 className={styles.planName}>Enterprise</h4>
            <p className={styles.planDesc}>Built for high-scale call centers requiring advanced reliability and security.</p>
            <div className={styles.planPrice}>
              Custom
            </div>
            <p className={styles.planPeriod}>Tailored options available</p>
            
            <ul className={styles.planFeatures}>
              <li>Unlimited custom call minutes</li>
              <li>Dedicated infrastructure (SLA guaranteed)</li>
              <li>Custom voice model fine-tuning</li>
              <li>Advanced API gateways &amp; webhooks</li>
              <li>HIPAA &amp; enterprise compliance</li>
              <li>Dedicated account manager &amp; 24/7 support</li>
            </ul>

            <a href="#" className={`${styles.btnPlan} ${styles.btnPlanOutline}`}>Contact Sales</a>
          </div>
        </div>
      </section>

      {/* AGENT LIBRARY */}
      <section style={{ padding: '5rem 1.5rem', background: 'transparent' }} id="agents">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className={styles.sectionTag}>Agent Library</span>
            <h2 className={styles.sectionTitle} style={{ marginTop: '0.75rem' }}>Deploy a ready-made AI Agent in seconds</h2>
            <p className={styles.sectionSubtitle}>Pick a pre-built voice agent for your industry. Customise the script, train it on your docs, and go live immediately.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '🏠', name: 'Real Estate Agent', tag: 'Sales', desc: 'Books property viewings, qualifies buyer intent, and follows up on listings automatically.', stat: '3.2× more bookings' },
              { icon: '🏥', name: 'Medical Receptionist', tag: 'Healthcare', desc: 'Books appointments, handles patient inquiries, and reduces front desk call volume by 60%.', stat: '60% fewer missed calls' },
              { icon: '🚗', name: 'Auto Dealership Agent', tag: 'Automotive', desc: 'Qualifies trade-in leads, books test drives, and handles finance inquiries 24/7.', stat: '4× lead response rate' },
              { icon: '⚖️', name: 'Legal Intake Agent', tag: 'Legal', desc: 'Screens new case inquiries, captures contact details, and books attorney consultations automatically.', stat: 'Zero missed intakes' },
              { icon: '📦', name: 'E-commerce Support', tag: 'Retail', desc: 'Handles order status, returns, and product questions over voice — without a support team.', stat: '80% query deflection' },
              { icon: '🏋️', name: 'Gym & Wellness Agent', tag: 'Fitness', desc: 'Books trial classes, handles membership queries, and recovers churned members with outbound calls.', stat: '2× membership signups' },
            ].map((agent, i) => (
              <a
                key={i}
                href="/login?redirect=/dashboard/ai-agent"
                style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.22s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{agent.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>{agent.name}</h4>
                  <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{agent.tag}</span>
                </div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{agent.desc}</p>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6ee7b7' }}>📈 {agent.stat}</div>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Deploy →</div>
              </a>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.5)', color: '#a5b4fc', fontSize: '14px', fontWeight: 600, textDecoration: 'none', background: 'rgba(99,102,241,0.1)', transition: 'all 0.2s' }}>Browse All Agents →</a>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Client Stories</span>
          <h2 className={styles.sectionTitle}>What Happens When You Stop Missing Calls</h2>
          <p className={styles.sectionSubtitle}>
            Real results from real businesses. No cherry-picked demos. Just numbers.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.testimonialText}>
              "Our AI chatbot handled over 800 conversations in the first month. We closed 23 new clients without a single manual sales call. Amira built something I genuinely didn't think was possible at this scale or price point."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.avatar}>SJ</div>
              <div>
                <p className={styles.authorName}>Sarah Jenkins</p>
                <p className={styles.authorRole}>Operations Lead, ScaleFlow</p>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.testimonialText}>
              "The AI voice agent answers our inbound calls 24/7 and books property viewings automatically. We went from missing 60% of after-hours leads to capturing every single one. Revenue is up 40% quarter-on-quarter."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.avatar}>MK</div>
              <div>
                <p className={styles.authorName}>Marcus Kincaid</p>
                <p className={styles.authorRole}>VP of Sales, Zenith Inc.</p>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.testimonialText}>
              "Within 6 weeks of launching our AI voice agents, our team's outbound call productivity jumped from 1.8× to 4.2×. The voice response is indistinguishable from real operators. Our competitors have no idea how we're doing it."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.avatar}>DR</div>
              <div>
                <p className={styles.authorName}>Daniel Ryan</p>
                <p className={styles.authorRole}>Co-Founder, Apex Group</p>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.guaranteeText}>
          🔒 <strong>No lock-in:</strong> Cancel anytime. If your call response rate and lead capture don't improve in 30 days, we work with you until they do, or refund you in full.
        </p>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className={styles.footerCtaBanner}>
        <div className={styles.footerCtaContainer}>
          <div className={styles.footerCtaLeft}>
            <h2 className={styles.footerCtaTitle}>Ready to stop missing calls?</h2>
            <p className={styles.footerCtaDesc}>
              Join hundreds of businesses already using Amira to answer every call, qualify every lead, and close more deals — automatically.
            </p>
          </div>
          <div className={styles.footerCtaRight}>
            {/* Abstract radiating burst of thick angled stripes in our electric blue/indigo theme */}
            <div className={styles.stripesBurst}>
              <div className={styles.stripeBar} style={{ transform: 'rotate(12deg) translate(80px, -20px)', width: '130px', height: '24px', backgroundColor: 'rgba(83, 58, 253, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(38deg) translate(90px, 10px)', width: '150px', height: '28px', backgroundColor: 'rgba(0, 101, 255, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(72deg) translate(100px, 30px)', width: '115px', height: '22px', backgroundColor: 'rgba(83, 58, 253, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(108deg) translate(95px, 20px)', width: '140px', height: '26px', backgroundColor: 'rgba(0, 101, 255, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(148deg) translate(80px, 0px)', width: '120px', height: '24px', backgroundColor: 'rgba(83, 58, 253, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(185deg) translate(95px, -15px)', width: '160px', height: '28px', backgroundColor: 'rgba(0, 101, 255, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(232deg) translate(90px, 10px)', width: '110px', height: '22px', backgroundColor: 'rgba(83, 58, 253, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(268deg) translate(100px, -5px)', width: '130px', height: '26px', backgroundColor: 'rgba(0, 101, 255, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(308deg) translate(85px, -20px)', width: '140px', height: '24px', backgroundColor: 'rgba(83, 58, 253, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(342deg) translate(90px, -10px)', width: '150px', height: '28px', backgroundColor: 'rgba(0, 101, 255, 0.9)' }}></div>
            </div>
            
            {/* Slanted Beveled Octagon button in white */}
            <a href="/dashboard" className={styles.beveledCtaBtn}>
              Start Free — No Card Needed
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerBrandName}>
              <img 
                src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
                alt="Amira Logo" 
                className={styles.footerLogoImg} 
              />
            </div>
            <p className={styles.footerBrandDesc}>
              The AI call center platform that helps businesses respond faster, qualify leads, and close more sales.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#demo">Live Demo</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Contact Support</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Contact Us</h4>
            <ul>
              <li><a href="mailto:support@amirapro.com">Email: support@amirapro.com</a></li>
              <li><a href="https://wa.me/2349032449461">WhatsApp: +234 903 244 9461</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.footerCopy}>&copy; 2026 Amira Technologies Inc. All rights reserved.</span>
          <div className={styles.footerSocials}>
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
