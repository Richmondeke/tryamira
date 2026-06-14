"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import { useLocalPricing } from "@/hooks/useLocalPricing";

function LocalPrice({ basePriceUsd }: { basePriceUsd: number }) {
  const { price, isLoading } = useLocalPricing(basePriceUsd);
  if (isLoading) return <>{`$${basePriceUsd}`}</>;
  return <>{price}</>;
}

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState<"monthly" | "annually">("monthly");
  const [currentLang, setCurrentLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Call simulation states
  const [demoScenario, setDemoScenario] = useState<"isp" | "fintech">("isp");
  const [isPlayingCall, setIsPlayingCall] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [transcriptIndex, setTranscriptIndex] = useState(-1);
  const [vapiCallActive, setVapiCallActive] = useState(false);
  const [vapiLoading, setVapiLoading] = useState(false);

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

  const ispDialogue = [
    { time: 2, sender: "user", text: "Hey, my internet has been offline for the last hour. I tried restarting the router but nothing happened." },
    { time: 7, sender: "ai", text: "I'm sorry to hear that. Let me look up your account details using your registered phone number. One moment..." },
    { time: 13, sender: "ai", text: "Okay, I see your account under John Doe. I'm querying your optical terminal status right now." },
    { time: 19, sender: "system", text: "[System Check] Sending ping request to port ONT-559-X..." },
    { time: 22, sender: "ai", text: "I see a signal loss at your line port. I've initiated a remote port reset on our end. Can you check if the broadband light on your router is blinking now?" },
    { time: 29, sender: "user", text: "Oh wait... the light just turned solid green! The WiFi is back up. Wow, that was fast." },
    { time: 34, sender: "ai", text: "Fantastic! I've updated your ticket status in Zendesk to resolved. Is there anything else I can assist you with?" },
    { time: 39, sender: "user", text: "No, that's all. Thank you so much." },
    { time: 42, sender: "ai", text: "You're very welcome! Have a great day." }
  ];

  const fintechDialogue = [
    { time: 2, sender: "user", text: "Hi, I sent a transfer of 50,000 Naira to my mom's account two hours ago, but she hasn't received it yet. Can you check it?" },
    { time: 8, sender: "ai", text: "I understand your concern. Let me check our transaction logs for you. Can you confirm the transaction reference code or your registered email address?" },
    { time: 15, sender: "user", text: "Yes, the reference code is TXN-8902-LK." },
    { time: 20, sender: "ai", text: "Thank you. Checking ledger logs... One moment." },
    { time: 23, sender: "system", text: "[System Check] Querying billing API for reference TXN-8902-LK..." },
    { time: 26, sender: "ai", text: "I see the transaction has been approved by our system, but it is currently held up at the destination bank's clearinghouse. I've just pinged their API to expedite the confirmation." },
    { time: 34, sender: "ai", text: "You should receive a delivery confirmation notification on your mom's end within the next 3 to 5 minutes. I've also logged a tracking ticket." },
    { time: 41, sender: "user", text: "Ah, ok, that makes sense. Thank you for checking that so quickly!" },
    { time: 45, sender: "ai", text: "You're very welcome! Let me know if you need help with anything else." }
  ];

  const dialogue = demoScenario === "isp" ? ispDialogue : fintechDialogue;
  const maxCallTime = dialogue[dialogue.length - 1].time + 3;

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

  // Playback timer loop for custom audio simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingCall) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= maxCallTime) {
            setIsPlayingCall(false);
            return 0;
          }
          const nextTime = prev + 1;
          // Find matching dialogue index
          const nextIndex = dialogue.findIndex((d) => d.time > nextTime);
          const currentIndex = nextIndex === -1 ? dialogue.length - 1 : nextIndex - 1;
          setTranscriptIndex(currentIndex);
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingCall, dialogue, maxCallTime]);

  const handleTogglePlay = () => {
    if (isPlayingCall) {
      setIsPlayingCall(false);
    } else {
      setIsPlayingCall(true);
    }
  };

  const handleResetCall = () => {
    setIsPlayingCall(false);
    setPlaybackTime(0);
    setTranscriptIndex(-1);
  };

  const handleSelectScenario = (scenario: "isp" | "fintech") => {
    setIsPlayingCall(false);
    setDemoScenario(scenario);
    setPlaybackTime(0);
    setTranscriptIndex(-1);
  };

  const handleTalkToAmira = () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';

    if (!publicKey || !assistantId) {
      // Scroll to custom simulator if Vapi is not active
      document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
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
            <li><a href="#problem" className={styles.navLink}>Repetitive Calls</a></li>
            <li><a href="#workflow" className={styles.navLink}>How Amira Works</a></li>
            <li><a href="#integrations" className={styles.navLink}>Integrations</a></li>
            <li><a href="#interactive-demo" className={styles.navLink}>Listen to Call</a></li>
            <li><a href="#pricing" className={styles.navLink}>Pricing</a></li>
          </ul>

          <div className={styles.navActions}>
            {/* Language Switcher */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={styles.langBtn}
              >
                <span style={{ fontSize: '15px' }}>
                  {languagesList.find(l => l.code === currentLang)?.flag || '🇺🇸'}
                </span>
                <span>
                  {languagesList.find(l => l.code === currentLang)?.label || 'English'}
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>▼</span>
              </button>
              
              {showLangMenu && (
                <div className={styles.langMenu}>
                  {languagesList.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`${styles.langMenuItem} ${currentLang === lang.code ? styles.langMenuItemActive : ""}`}
                    >
                      <span style={{ fontSize: '14px' }}>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="/dashboard" className={styles.navSignIn}>Login</a>
            <a href="#interactive-demo" className={styles.navSecondaryBtn}>Talk to Sales</a>
            <a href="/dashboard" className={styles.navCta}>Start Free Trial</a>
          </div>

          <button 
            className={styles.mobileMenuToggle} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#problem" onClick={() => setMobileMenuOpen(false)}>Repetitive Calls</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>How Amira Works</a>
            <a href="#integrations" onClick={() => setMobileMenuOpen(false)}>Integrations</a>
            <a href="#interactive-demo" onClick={() => setMobileMenuOpen(false)}>Listen to Call</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <hr />
            <a href="/dashboard">Login</a>
            <a href="#interactive-demo" onClick={() => setMobileMenuOpen(false)}>Talk to Sales</a>
            <a href="/dashboard" className={styles.mobileMenuCta}>Start Free Trial</a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeHighlight}>Customer Support Operations</span>
            <span className={styles.heroBadgeText}>Resolve Repetitive Calls 24/7</span>
          </div>

          <h1 className={styles.heroTitle}>
            Stop Drowning Your Support Team in Repetitive Customer Calls
          </h1>

          <p className={styles.heroSubtitle}>
            Amira resolves customer inquiries, creates tickets, updates systems, and escalates only the issues that need a human agent.
          </p>

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

          <div className={styles.heroCtas}>
            <button 
              onClick={handleTalkToAmira} 
              disabled={vapiLoading}
              className={styles.heroCtaPrimary}
            >
              {vapiLoading ? 'Connecting...' : vapiCallActive ? '⏹ End Live Call' : 'Book a Demo'}
            </button>
            <a href="#interactive-demo" className={styles.heroCtaSecondary}>
              Listen to a Live Call
            </a>
          </div>

          <div className={styles.heroTrust}>
            Built for ISPs and Fintechs handling thousands of customer inquiries every month.
          </div>

          {/* VISUAL WORKFLOW CONTAINER */}
          <div className={styles.workflowContainer} id="workflow">
            <div className={styles.workflowHeader}>
              <div className={styles.headerDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <div className={styles.headerTitle}>Customer Call Resolution Flow</div>
              <div className={styles.headerStatus}>
                <span className={styles.pulseIndicator} />
                Active Workflow
              </div>
            </div>

            <div className={styles.workflowSteps}>
              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepTitle}>Customer Calls</div>
                <p className={styles.stepText}>Customer rings your support line with a routine outage or transfer issue.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepTitle}>Amira Answers</div>
                <p className={styles.stepText}>Answers in under 500ms using a premium, warm, conversational voice.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepTitle}>Queries Systems</div>
                <p className={styles.stepText}>Checks router signals, transaction logs, or billing data in real-time.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepTitle}>Resolves &amp; Logs</div>
                <p className={styles.stepText}>Resets port, confirms transfer, updates CRM and logs Zendesk ticket.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>5</div>
                <div className={styles.stepTitle}>Warm Escalation</div>
                <p className={styles.stepText}>Only complex cases route to humans, complete with full logs and details.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PROBLEM SECTION */}
      <section className={styles.problemSection} id="problem">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>The Pain Point</span>
          <h2 className={styles.sectionTitle}>Your Team Is Answering The Same Questions Every Day</h2>
          <p className={styles.sectionSubtitle}>
            Routine support calls trap your human agents in repetitive answers, driving support costs up and making frustrated customers wait in queue.
          </p>
        </div>

        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <div className={styles.problemCardHeader}>
              <span className={styles.industryTag}>Internet Service Providers (ISPs)</span>
            </div>
            <ul className={styles.problemList}>
              <li>
                <span className={styles.bulletX}>✖</span>
                <div>
                  <strong>"My internet is down."</strong>
                  <p>Requires checking signal strength and resetting line ports.</p>
                </div>
              </li>
              <li>
                <span className={styles.bulletX}>✖</span>
                <div>
                  <strong>"How do I reset my router?"</strong>
                  <p>Guiding router restarts and checking billing status.</p>
                </div>
              </li>
              <li>
                <span className={styles.bulletX}>✖</span>
                <div>
                  <strong>"When is my next billing payment due?"</strong>
                  <p>Lookup account statements and update details.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.problemCard}>
            <div className={styles.problemCardHeader}>
              <span className={styles.industryTag}>Fintechs &amp; Payments</span>
            </div>
            <ul className={styles.problemList}>
              <li>
                <span className={styles.bulletX}>✖</span>
                <div>
                  <strong>"I haven't received my transfer."</strong>
                  <p>Requires querying transaction ledger logs and bank APIs.</p>
                </div>
              </li>
              <li>
                <span className={styles.bulletX}>✖</span>
                <div>
                  <strong>"Why was my debit card declined?"</strong>
                  <p>Verifying card locks, balances, and security holds.</p>
                </div>
              </li>
              <li>
                <span className={styles.bulletX}>✖</span>
                <div>
                  <strong>"How do I update my KYC documentation?"</strong>
                  <p>Verifying identification limits and screening records.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>$3.50+</div>
            <div className={styles.metricTitle}>Cost Per Routine Call</div>
            <p className={styles.metricDesc}>Every password reset, signal check, or payment status check drains cash flow.</p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>72%</div>
            <div className={styles.metricTitle}>Customer Churn Risk</div>
            <p className={styles.metricDesc}>Customers hang up or switch brands if hold times exceed 5 minutes.</p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>85%</div>
            <div className={styles.metricTitle}>Human Agent Burnout</div>
            <p className={styles.metricDesc}>Answering the same ten questions repeatedly leads to high agent turnover.</p>
          </div>
        </div>
      </section>

      {/* SOLUTION / SYSTEM INTEGRATIONS */}
      <section className={styles.integrationsSection} id="integrations">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Operations Automation</span>
          <h2 className={styles.sectionTitle}>Amira Resolves Issues. She Doesn't Just Answer Them.</h2>
          <p className={styles.sectionSubtitle}>
            Instead of giving generic answers, Amira integrates with your database, billing APIs, and CRM platforms to look up info and trigger actions.
          </p>
        </div>

        <div className={styles.trusted}>
          <div className={styles.trustedContainer}>
            <p className={styles.trustedLabel}>Integrates with your stack to check systems and update logs</p>
            <div style={{ overflow: 'hidden', position: 'relative', width: '100%', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', animation: 'amiraTicker 30s linear infinite', width: 'max-content' }}>
                {['Zendesk', 'Salesforce', 'HubSpot', 'Stripe', 'Twilio', 'Telnyx', 'Slack', 'Gmail', 'Monday.com', 'Zoho CRM', 'Intercom', 'Freshdesk', 'Zendesk', 'Salesforce', 'HubSpot', 'Stripe', 'Twilio', 'Telnyx', 'Slack', 'Gmail', 'Monday.com', 'Zoho CRM', 'Intercom', 'Freshdesk'].map((tool, i) => (
                  <span key={i} className={styles.tickerItem}>{tool}</span>
                ))}
              </div>
            </div>
            <style>{`@keyframes amiraTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CALL PLAYER / SCENARIO SANDBOX */}
      <section className={styles.demoPlayground} id="interactive-demo">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Live Interaction</span>
          <h2 className={styles.sectionTitle}>Listen to Amira Resolve a Call</h2>
          <p className={styles.sectionSubtitle}>
            Choose a scenario below to hear how Amira interfaces with backend systems to solve real inquiries.
          </p>
        </div>

        <div className={styles.playerWrapper}>
          <div className={styles.scenarioSelector}>
            <button 
              className={`${styles.scenarioTab} ${demoScenario === "isp" ? styles.scenarioTabActive : ""}`}
              onClick={() => handleSelectScenario("isp")}
            >
              🌐 ISP Connection Check
            </button>
            <button 
              className={`${styles.scenarioTab} ${demoScenario === "fintech" ? styles.scenarioTabActive : ""}`}
              onClick={() => handleSelectScenario("fintech")}
            >
              💳 Fintech Ledger Inquiry
            </button>
          </div>

          <div className={styles.audioPlayer}>
            <div className={styles.playerControls}>
              <button className={styles.playBtn} onClick={handleTogglePlay}>
                {isPlayingCall ? "⏸ Pause Call" : "▶ Play Call"}
              </button>
              <button className={styles.resetBtn} onClick={handleResetCall}>
                ↺ Reset
              </button>
              <div className={styles.timeDisplay}>
                0:{playbackTime.toString().padStart(2, "0")} / 0:{maxCallTime.toString().padStart(2, "0")}
              </div>
            </div>

            {/* Moving wave animation when playing */}
            <div className={styles.waveVisualizer}>
              <div className={`${styles.waveBar} ${isPlayingCall ? styles.waveBarPlay : ""}`} style={{ animationDelay: "0.1s" }} />
              <div className={`${styles.waveBar} ${isPlayingCall ? styles.waveBarPlay : ""}`} style={{ animationDelay: "0.4s" }} />
              <div className={`${styles.waveBar} ${isPlayingCall ? styles.waveBarPlay : ""}`} style={{ animationDelay: "0.2s" }} />
              <div className={`${styles.waveBar} ${isPlayingCall ? styles.waveBarPlay : ""}`} style={{ animationDelay: "0.6s" }} />
              <div className={`${styles.waveBar} ${isPlayingCall ? styles.waveBarPlay : ""}`} style={{ animationDelay: "0.3s" }} />
              <div className={`${styles.waveBar} ${isPlayingCall ? styles.waveBarPlay : ""}`} style={{ animationDelay: "0.8s" }} />
              <div className={`${styles.waveBar} ${isPlayingCall ? styles.waveBarPlay : ""}`} style={{ animationDelay: "0.5s" }} />
            </div>

            {/* Scrollable conversation transcript */}
            <div className={styles.transcriptView}>
              {transcriptIndex === -1 ? (
                <div className={styles.transcriptPlaceholder}>
                  Click Play Call to hear the simulated conversation.
                </div>
              ) : (
                <div className={styles.transcriptBubbles}>
                  {dialogue.slice(0, transcriptIndex + 1).map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`${styles.bubble} ${
                        item.sender === "ai" ? styles.bubbleAi : item.sender === "system" ? styles.bubbleSys : styles.bubbleUser
                      }`}
                    >
                      <div className={styles.bubbleSender}>
                        {item.sender === "ai" ? "Amira (AI Agent)" : item.sender === "system" ? "Backend System" : "Customer"}
                      </div>
                      <div className={styles.bubbleText}>{item.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
              <LocalPrice basePriceUsd={activePlan === "monthly" ? 49 : 39} /><span>/mo</span>
            </div>
            <p className={styles.planPeriod}>Billed {activePlan}</p>
            
            <ul className={styles.planFeatures}>
              <li>500 call minutes included</li>
              <li>1 custom AI phone line</li>
              <li>Knowledge base training (up to 5MB)</li>
              <li>Basic dashboard logs &amp; analytics</li>
              <li>Webhooks &amp; email support</li>
            </ul>

            <a href="/dashboard" className={`${styles.btnPlan} ${styles.btnPlanOutline}`}>Start Free Trial</a>
          </div>

          {/* PROFESSIONAL */}
          <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
            <div className={styles.popularBadge}>Most Popular</div>
            <h4 className={styles.planName}>Professional</h4>
            <p className={styles.planDesc}>Ideal for growing teams automating medium to high voice support volume.</p>
            <div className={styles.planPrice}>
              <LocalPrice basePriceUsd={activePlan === "monthly" ? 199 : 159} /><span>/mo</span>
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

            <a href="/dashboard" className={`${styles.btnPlan} ${styles.btnPlanFilled}`}>Go Professional</a>
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

            <a href="/dashboard" className={`${styles.btnPlan} ${styles.btnPlanOutline}`}>Contact Sales</a>
          </div>
        </div>
      </section>

      {/* READY-DEPLOMED AGENT GALLERY */}
      <section style={{ padding: '5rem 1.5rem', background: 'transparent' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className={styles.sectionTag}>Operations Templates</span>
            <h2 className={styles.sectionTitle} style={{ marginTop: '0.75rem' }}>Deploy a Pre-Trained Support Agent in Seconds</h2>
            <p className={styles.sectionSubtitle}>Select a layout pre-configured with the database queries and escalation rules for your exact operations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '🌐', name: 'ISP Outage Diagnostic', tag: 'ISP Support', desc: 'Checks line signal status, runs terminal port resets, and logs local Zendesk tickets.', stat: '65% query deflection' },
              { icon: '💳', name: 'Ledger Audit Rep', tag: 'Fintech Support', desc: 'Queries transfer logs, resolves network clearing delays, and logs tracking IDs.', stat: '2.5 min avg resolution' },
              { icon: '🔒', name: 'KYC Document Agent', tag: 'Compliance', desc: 'Validates identification limits, screens credentials, and guides details update.', stat: 'Zero missed screenings' },
              { icon: '📈', name: 'Account & Billing rep', tag: 'Billing', desc: 'Checks statement balances, processes plan renewals, and prints invoices.', stat: '90% cost reduction' },
              { icon: '📦', name: 'Delivery Status Check', tag: 'Logistics', desc: 'Queries shipment tracks, prints shipping labels, and updates dispatch status.', stat: '80% deflection rate' },
              { icon: '📞', name: 'General Support Router', tag: 'Operations', desc: 'Qualifies customer issues and handles warm transfers to human agents.', stat: 'Under 500ms voice latency' },
            ].map((agent, i) => (
              <a
                key={i}
                href="/login?redirect=/dashboard/ai-agent"
                style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.22s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(76,175,80,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(76,175,80,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{agent.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>{agent.name}</h4>
                  <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: 'rgba(76,175,80,0.25)', color: '#a5b4fc', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{agent.tag}</span>
                </div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{agent.desc}</p>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6ee7b7' }}>📈 {agent.stat}</div>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Deploy →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE & CALLOUT */}
      <section className={styles.testimonials}>
        <p className={styles.guaranteeText}>
          🔒 <strong>No Lock-in:</strong> Cancel anytime. If Amira doesn't reduce your repeat call volume and average hold time in 30 days, we'll refund you in full.
        </p>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className={styles.footerCtaBanner}>
        <div className={styles.footerCtaContainer}>
          <div className={styles.footerCtaLeft}>
            <h2 className={styles.footerCtaTitle}>Ready to stop drowning in support calls?</h2>
            <p className={styles.footerCtaDesc}>
              Join hundreds of operations managers using Amira to resolve repetitive inquiries, lower hold times, and free up agents for complex problems.
            </p>
          </div>
          <div className={styles.footerCtaRight}>
            <div className={styles.stripesBurst}>
              <div className={styles.stripeBar} style={{ transform: 'rotate(12deg) translate(80px, -20px)', width: '130px', height: '24px', backgroundColor: 'rgba(76, 175, 80, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(38deg) translate(90px, 10px)', width: '150px', height: '28px', backgroundColor: 'rgba(0, 101, 255, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(72deg) translate(100px, 30px)', width: '115px', height: '22px', backgroundColor: 'rgba(76, 175, 80, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(108deg) translate(95px, 20px)', width: '140px', height: '26px', backgroundColor: 'rgba(0, 101, 255, 0.9)' }}></div>
              <div className={styles.stripeBar} style={{ transform: 'rotate(148deg) translate(80px, 0px)', width: '120px', height: '24px', backgroundColor: 'rgba(76, 175, 80, 0.9)' }}></div>
            </div>
            
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
              The operations automation call center platform that resolves repetitive questions, clears agent backlogs, and integrates with your support desk.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Product</h4>
            <ul>
              <li><a href="#problem">Repetitive Calls</a></li>
              <li><a href="#workflow">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#interactive-demo">Listen to Call</a></li>
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
