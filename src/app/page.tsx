"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState<"monthly" | "annually">("monthly");
  const [activeFeatureTab, setActiveFeatureTab] = useState<"channels" | "knowledge" | "automation">("channels");
  const [liveTranscript, setLiveTranscript] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);
  const [currentCallStatus, setCurrentCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle");
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
            <li><a href="#how-it-works" className={styles.navLink}>How It Works</a></li>
            <li><a href="#pricing" className={styles.navLink}>Pricing</a></li>
            <li><a href="#demo" className={styles.navLink}>Interactive Demo</a></li>
          </ul>

          <div className={styles.navActions}>
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
            <span className={styles.heroBadgeHighlight}>Official Integrations</span>
            <span className={styles.heroBadgeText}>Meta Business, Twilio &amp; Telnyx</span>
          </div>

          <h1 className={styles.heroTitle}>
            Your customers call.<br />
            <span className={styles.textAccent}>Your AI answers.</span><br />
            You get paid.
          </h1>

          <p className={styles.heroSubtitle}>
            Connect your phone lines, web call widget, and CRM to one AI Voice Agent.
            Amira handles inbound support, qualifies outbound campaigns, and answers 24/7.
          </p>

          <div className={styles.vapiWidgetContainer}>
            <div className={styles.vapiWidgetInner}>
              <select className={styles.vapiSelect} defaultValue="support">
                <option value="support">Customer Support</option>
                <option value="lead">Lead Qualification</option>
                <option value="sales">Outbound Sales</option>
              </select>
              <button className={styles.vapiButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.vapiIcon}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Talk to Amira
              </button>
            </div>
            <div className={styles.vapiMeta}>
              <span className={styles.vapiMetaText}>Mic permissions needed • No credit card required</span>
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

      {/* TRUSTED BY LOGOS */}
      <section className={styles.trusted}>
        <div className={styles.trustedContainer}>
          <p className={styles.trustedLabel}>Trusted by innovative brands worldwide</p>
          <div className={styles.trustedLogos}>
            <span className={styles.trustedLogo}>TechStars</span>
            <span className={styles.trustedLogo}>Y-Combinator</span>
            <span className={styles.trustedLogo}>Zenith Inc.</span>
            <span className={styles.trustedLogo}>Apex Group</span>
            <span className={styles.trustedLogo}>ScaleFlow</span>
          </div>
        </div>
      </section>

      {/* LIVE IN 5 MINUTES */}
      <section className={styles.featureBlock}>
        <div className={styles.innerBlockCentered}>
          <span className={styles.sectionTag}>Instant Deployment</span>
          <h2 className={styles.sectionTitle}>Live in Under 5 Minutes.</h2>
          <p className={styles.sectionSubtitle}>
            No code. No tech team. No waiting. Sign up and your Voice AI is running today.
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
              <h3 className={styles.rowTitle}>Connect every phone line in 60 seconds.</h3>
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
              <h3 className={styles.rowTitle}>Teach your AI everything about your business.</h3>
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
              <h3 className={styles.rowTitle}>Your AI is live. Your voice operations run on autopilot.</h3>
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

        </div>
      </section>

      {/* CORE CAPABILITIES GRID (MIRRORING JOHA) */}
      <section className={styles.capabilities} id="how-it-works">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Key Advantages</span>
          <h2 className={styles.sectionTitle}>Train once. Let it handle every call.</h2>
          <p className={styles.sectionSubtitle}>
            Always on. Always accurate. Zero extra staff.
          </p>
        </div>

        <div className={styles.capabilitiesGrid}>
          {/* CARD 1 */}
          <div className={styles.capabilityCard}>
            <div className={styles.capIcon}>🎙️</div>
            <h4 className={styles.capTitle}>Train once. Let it handle every call.</h4>
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
          <h2 className={styles.sectionTitle}>Talk to Amira Right Now</h2>
          <p className={styles.sectionSubtitle}>
            Experience firsthand the industry-leading speed, voice quality, and responsiveness of Amira.
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

      {/* CLIENT TESTIMONIALS (JOHA ALIGNED) */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>Client Stories</span>
          <h2 className={styles.sectionTitle}>Businesses That Made the Switch</h2>
          <p className={styles.sectionSubtitle}>
            Hear directly from founders and operators who chose to stop competing manually and let AI handle the phones.
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
        <div className={styles.footerCtaGlow} />
        <div className={styles.footerCtaContent}>
          <h2 className={styles.footerCtaTitle}>Your customers are calling right now.<br />Who's replying?</h2>
          <p className={styles.footerCtaDesc}>
            Every unanswered call is a lead walking out the door. Set up your Voice AI Agent today.
          </p>
          <a href="#" className={styles.btnCtaMain}>Start Free Trial</a>
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
