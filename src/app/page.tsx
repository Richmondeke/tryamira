"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import GlowIcon from "@/components/GlowIcon";
import ScrollReveal from "@/components/ScrollReveal";

function ArrowRight({ size = 18, color }: { size?: number; color?: string }) {
  return <GlowIcon name="arrow-right-outline" size={size} color={color} />;
}
function Check({ size = 16, color }: { size?: number; color?: string }) {
  return <GlowIcon name="checkmark-outline" size={size} color={color} />;
}
function ChevronRight({ size = 16, color }: { size?: number; color?: string }) {
  return <GlowIcon name="chevron-right-outline" size={size} color={color} />;
}
function X({ size = 20, color }: { size?: number; color?: string }) {
  return <GlowIcon name="xmark-outline" size={size} color={color} />;
}
function Star({ size = 16, color }: { size?: number; color?: string }) {
  return <GlowIcon name="star-outline" size={size} color={color} />;
}
function Shield({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="shield-outline" size={size} color={color} />;
}
function Clock({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="clock-outline" size={size} color={color} />;
}
function Phone({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="phone-outline" size={size} color={color} />;
}
function MessageSquare({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="message-square-outline" size={size} color={color} />;
}
function Mail({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="mail-outline" size={size} color={color} />;
}
function FileText({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="doc-outline" size={size} color={color} />;
}
function BarChart3({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="chartbar-outline" size={size} color={color} />;
}
function Ticket({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="tag-outline" size={size} color={color} />;
}
function Globe({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="compass-outline" size={size} color={color} />;
}
function Layers({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="layers-outline" size={size} color={color} />;
}
function Users({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="users-outline" size={size} color={color} />;
}
function Zap({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="zap-outline" size={size} color={color} />;
}
function Play({ size = 22, color }: { size?: number; color?: string }) {
  return <GlowIcon name="media-play-outline" size={size} color={color} />;
}

// ─── AMIRA SPARKLE ICON ──────────────────────────────────────────────────────
function AmiraIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="#10b981" />
      <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [orbitZoomScale, setOrbitZoomScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOrbitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const dist = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
    const normDist = Math.min(dist / maxDist, 1);

    // At center (normDist = 0), maximum zoom out scale (0.84)
    // As mouse moves towards edges (normDist = 1), scale smoothly expands back to normal 1.0
    const targetScale = 1.0 - (1.0 - normDist) * 0.16;
    setOrbitZoomScale(targetScale);
  };

  const handleOrbitMouseLeave = () => {
    setOrbitZoomScale(1.0);
  };

  const handleTabChange = (index: number) => {
    if (index === carouselIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCarouselIndex(index);
      setIsFading(false);
    }, 160);
  };

  return (
    <div className={styles.page}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <a href="/" className={styles.navLogo}>
            <img src="/amira-logo-dark.svg" alt="Amira AI" style={{ height: '26px', width: 'auto' }} />
          </a>

          <ul className={styles.navLinks}>
            {[
              { label: "Product", href: "#product" },
              { label: "Capabilities", href: "#capabilities" },
              { label: "Multi-Channel", href: "#multichannel" },
              { label: "Integrations", href: "#integrations" },
              { label: "Use Cases", href: "#usecases" },
              { label: "Benefits", href: "#benefits" },
            ].map(l => (
              <li key={l.label}>
                <a href={l.href} className={styles.navLink}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <a href="/login" className={styles.navLogin}>Log in</a>
            <a href="/dashboard/v3/outreach" className={styles.navCta} style={{ backgroundColor: '#10b981' }}>
              Get Started
            </a>
          </div>

          <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </button>
        </div>

        {mobileOpen && (
          <div className={styles.mobileMenu}>
            {["Product","Capabilities","Multi-Channel","Integrations","Use Cases","Benefits"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className={styles.mobileMenuLink} onClick={() => setMobileOpen(false)}>{l}</a>
            ))}
            <hr className={styles.mobileDivider} />
            <a href="/login" className={styles.mobileMenuLink}>Log in</a>
            <a href="/dashboard/v3/outreach" className={styles.mobileMenuCta} style={{ backgroundColor: '#10b981' }}>Get Started</a>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className={styles.hero} id="product">
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBgGlow1} />
          <div className={styles.heroBgGlow2} />
          <div className={styles.heroBgGrid} />
        </div>

        <div className={styles.heroInner}>
          {/* left */}
          <div className={styles.heroLeft}>
            <div style={{ marginBottom: '1.25rem' }}>
              <img src="/amira-head.png" alt="Amira Head Mascot" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </div>

            <h1 className={styles.heroH1}>
              Your Customer Support,<br />
              <span className={styles.heroAccent} style={{ color: '#10b981' }}>On Autopilot.</span>
            </h1>

            <p className={styles.heroSub}>
              Meet the AI customer support workforce that talks to your customers, resolves issues, answers questions, and works across every channel — 24/7.
            </p>

            <div className={styles.heroCtas}>
              <a href="/dashboard/v3/outreach" className={styles.btnPrimary} style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
                Get Started
                <ArrowRight size={16} />
              </a>
              <a href="#capabilities" className={styles.btnSecondary} style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}>
                Watch Demo
              </a>
            </div>

            <p style={{ fontSize: '12.5px', color: '#10b981', fontWeight: 600, margin: '-0.25rem 0 0 0' }}>
              Deploy your first AI support agent in minutes.
            </p>

            <div className={styles.heroTrust}>
              <span className={styles.heroTrustLabel}>Works with 1000+ integrations & tools</span>
              <div className={styles.heroTrustLogos}>
                {[
                  { name: 'Notion', icon: '/images/apps/notion.svg' },
                  { name: 'Slack', icon: '/images/apps/slack.svg' },
                  { name: 'Gmail', icon: '/images/apps/gmail.svg' },
                  { name: 'HubSpot', icon: '/images/apps/hubspot.svg' },
                  { name: 'Salesforce', icon: '/images/apps/salesforce.svg' },
                  { name: 'Linear', icon: '/images/apps/linear.svg' }
                ].map((app) => (
                  <div
                    key={app.name}
                    title={app.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <img src={app.icon} alt={app.name} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                  </div>
                ))}
                <span className={styles.heroTrustMore}>+ 1000 more</span>
              </div>
            </div>
          </div>

          {/* right — hero section image showcase */}
          <div className={styles.heroRight}>
            <ScrollReveal direction="up" distance={70} duration={0.9}>
              <img
                src="/amira-hero-section.png"
                alt="Amira AI Customer Support Workforce"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '560px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── TRUST / VALUE STRIP ────────────────────────────────────────────────── */}
      <section className={styles.section} style={{ background: '#ffffff', paddingTop: '4.5rem', paddingBottom: '3.5rem', overflow: 'hidden' }}>
        <div className={styles.inner} style={{ maxWidth: '1180px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>ONE AI WORKFORCE. EVERY CUSTOMER CONVERSATION.</span>
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '750px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
              Amira AI gives your business intelligent AI agents that handle calls, chats, emails, WhatsApp, documents, and support tickets without the wait times and overhead of traditional support.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {[
              { icon: <Clock size={22} color="#10b981" />, title: "24/7 Availability", desc: "Never leave a customer waiting." },
              { icon: <MessageSquare size={22} color="#1b5a92" />, title: "Voice & Chat", desc: "Talk to customers naturally across channels." },
              { icon: <Globe size={22} color="#10b981" />, title: "100+ Languages", desc: "Support customers wherever they are." },
              { icon: <Layers size={22} color="#1b5a92" />, title: "Your Tools, Connected", desc: "Work with the systems your team already uses." }
            ].map(item => (
              <div key={item.title} className={styles.hoverCard} style={{
                backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.5rem',
                border: '1px solid var(--border-subtle)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', gap: '0.75rem'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 750, color: '#1b5a92', margin: 0 }}>{item.title}</h4>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: '0.35rem 0 0 0', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Amira Laptop Image — Full View with zero cut-off */}
          <div style={{ width: '100%', margin: '0 auto', textAlign: 'center', lineHeight: 0 }}>
            <ScrollReveal direction="up" distance={80} duration={0.9}>
              <img 
                src="/amira-laptop.png" 
                alt="Amira AI Laptop Interface - One AI Workforce" 
                style={{ 
                  width: '100%', 
                  maxWidth: '1040px', 
                  height: 'auto', 
                  display: 'block', 
                  margin: '0 auto',
                  objectFit: 'contain'
                }} 
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 1 — THE PROBLEM / SUPPORT CHALLENGE ──────────────────────── */}
      <section className={styles.section} id="challenge" style={{ background: '#ffffff' }}>
        <div className={styles.inner}>

          {/* Single Merged Container Card with amira-background.png */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            paddingTop: '3.5rem',
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            textAlign: 'center',
            maxWidth: '960px',
            margin: '0 auto',
            overflow: 'hidden',
            color: '#ffffff'
          }}>
            <div style={{ padding: '0 2.5rem' }}>
              <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>THE SUPPORT CHALLENGE</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#ffffff', marginTop: '0.5rem' }}>
                Your customers shouldn't have to wait for help.
              </h2>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#10b981', marginTop: '1rem' }}>
                Long queues. Repetitive questions. Missed calls. Overloaded support teams.
              </p>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginTop: '1rem', maxWidth: '720px', margin: '1rem auto 0 auto' }}>
                As your business grows, customer support becomes harder to scale — and hiring more people isn't always the answer.
              </p>
              <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(255,255,255,0.95)', padding: '0.55rem 1.75rem', borderRadius: '99px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', display: 'inline-block' }}>
                  Amira is.
                </span>
              </div>
            </div>

            {/* Amira Sad Image flush to bottom edges in full view */}
            <div style={{ width: '100%', margin: 0, padding: 0, lineHeight: 0 }}>
              <ScrollReveal direction="up" distance={60} duration={0.9}>
                <img 
                  src="/amirasad.png" 
                  alt="Overloaded Customer Support Queue - Amira Support Challenge" 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </ScrollReveal>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2 — THE SOLUTION (MEET AMIRA) ────────────────────────────── */}
      <section className={styles.section} id="solution" style={{ background: '#ffffff' }}>
        <div className={styles.inner}>

          {/* Single Merged Container with amira-background.png Background */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            paddingTop: '3.5rem',
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            textAlign: 'center',
            maxWidth: '960px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '0 2.5rem' }}>
              <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>THE AMIRA SOLUTION</span>
              <h2 className={styles.sectionTitle} style={{ color: '#ffffff', marginTop: '0.5rem' }}>Meet your AI Customer Support Agent.</h2>
              <p className={styles.sectionSub} style={{ color: 'rgba(255, 255, 255, 0.85)', margin: '0.75rem auto 2rem auto', maxWidth: '720px' }}>
                Amira gives you an AI-powered support agent that can understand your customers, respond naturally, take action, and resolve issues around the clock.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlowIcon name="message-square-outline" size={20} color="#1b5a92" />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 750, color: '#1b5a92', margin: 0, textAlign: 'left' }}>Let AI handle the conversations.</p>
                </div>
                <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#10b98115', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlowIcon name="users-outline" size={20} color="#10b981" />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 750, color: '#047857', margin: 0, textAlign: 'left' }}>Let your team handle what matters.</p>
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <a href="/dashboard/v3/outreach" className={styles.btnPrimary} style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.9rem 2rem', fontSize: '16px' }}>
                  Create Your AI Agent
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* Amira 24:7 Image flush to left, right & bottom edges */}
            <div style={{ width: '100%', margin: 0, padding: 0, lineHeight: 0 }}>
              <ScrollReveal direction="up" distance={90} duration={1.0}>
                <img 
                  src="/amira-247.png" 
                  alt="Meet your AI Customer Support Agent - Amira 24/7 Solution" 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — WHAT AMIRA CAN DO (CORE CAPABILITIES) ──────────────── */}
      <section className={styles.section} id="capabilities" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <div className={styles.inner}>
          
          {/* Single Merged Container with #1b5a92 Background (No Right or Bottom Padding for Image) */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            paddingTop: '3rem',
            paddingLeft: '2.5rem',
            paddingRight: 0,
            paddingBottom: 0,
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            maxWidth: '1280px',
            margin: '0 auto',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            alignItems: 'flex-end'
          }}>
            
            {/* Left Column: Title, Subtitle & 6 Cards Grid */}
            <div style={{ paddingBottom: '3rem', paddingRight: '1rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>CORE CAPABILITIES</span>
                <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginTop: '0.5rem', color: '#ffffff' }}>One AI agent. A whole lot of support.</h2>
                <p className={styles.sectionSub} style={{ textAlign: 'left', margin: '0.5rem 0 0 0', color: 'rgba(255, 255, 255, 0.85)' }}>Everything your business needs to deliver 24/7 intelligent customer care.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {[
                  {
                    icon: "phone-outline",
                    title: "Answer Every Call",
                    subtitle: "Never miss another customer call.",
                    desc: "Amira handles incoming calls, answers questions, collects info, and initiates outbound calls.",
                    tag: "Inbound + Outbound"
                  },
                  {
                    icon: "message-square-outline",
                    title: "Chat With Customers Instantly",
                    subtitle: "Give customers instant answers.",
                    desc: "Engage customers through website, app, and social channels instantly.",
                    tag: "Live AI Chat"
                  },
                  {
                    icon: "mail-outline",
                    title: "Handle Customer Emails",
                    subtitle: "Stop letting inbox overflow.",
                    desc: "Reads, understands, and responds to customer emails automatically.",
                    tag: "AI Email Support"
                  },
                  {
                    icon: "doc-outline",
                    title: "Process Documents",
                    subtitle: "Automate document workflows.",
                    desc: "Processes customer documents for onboarding, verification, and support.",
                    tag: "Document Processing"
                  },
                  {
                    icon: "chartbar-outline",
                    title: "Capture Customer Information",
                    subtitle: "Turn conversations into data.",
                    desc: "Collects key customer info automatically to help your team deliver better service.",
                    tag: "Data Capture"
                  },
                  {
                    icon: "tag-outline",
                    title: "Track Support Tickets",
                    subtitle: "Centralized visibility.",
                    desc: "Track conversations and support tickets from one place with complete clarity.",
                    tag: "Centralized Support"
                  }
                ].map(card => (
                  <div key={card.title} className={styles.hoverCard} style={{
                    backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.35rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GlowIcon name={card.icon} size={22} color="#1b5a92" />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#047857', border: '1px solid #10b98130' }}>
                          {card.tag}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#1b5a92', margin: 0 }}>{card.title}</h3>
                      <p style={{ fontSize: '13px', fontWeight: 650, color: '#10b981', margin: '0.25rem 0 0.35rem 0' }}>{card.subtitle}</p>
                      <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Image Container (Flush against right edge 0 paddingRight and bottom edge 0 paddingBottom) */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', height: '100%', margin: 0, padding: 0, lineHeight: 0 }}>
              <ScrollReveal direction="up" distance={90} duration={1.0}>
                <img
                  src="/amiratea.png"
                  alt="Amira AI Core Capabilities - Amiratea"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '620px',
                    objectFit: 'contain',
                    display: 'block',
                    margin: 0,
                    padding: 0
                  }}
                />
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 4 — MULTI-CHANNEL ─────────────────────────────────────────── */}
      <section className={styles.section} id="multichannel" style={{ background: '#ffffff', padding: '5rem 0 3rem 0' }}>
        <div className={styles.inner} style={{ maxWidth: '1080px', textAlign: 'center' }}>
          <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
            <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>MULTI-CHANNEL COVERAGE</span>
            <h2 className={styles.sectionTitle} style={{ color: '#0f172a', marginTop: '0.5rem' }}>
              Meet your customers wherever they are.
            </h2>
            <p className={styles.sectionSub} style={{ color: '#475569', margin: '0.75rem auto 2rem auto', maxWidth: '720px' }}>
              Your customers don't communicate in just one place. Neither should your support team.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.15rem',
            justifyContent: 'center',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto'
          }}>
            {[
              { label: "Phone", icon: "phone-outline" },
              { label: "Website", icon: "desktop-outline" },
              { label: "WhatsApp", icon: "message-circle-outline" },
              { label: "Email", icon: "mail-outline" },
              { label: "App", icon: "layers-outline" },
              { label: "Social", icon: "users-outline" }
            ].map(ch => (
              <div key={ch.label} className={styles.hoverCard} style={{
                padding: '0.85rem 1.5rem', borderRadius: '12px', backgroundColor: '#ffffff',
                border: '1.5px solid #1b5a9230', boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                fontSize: '15.5px', fontWeight: 750, color: '#1b5a92', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem',
                cursor: 'pointer'
              }}>
                <GlowIcon name={ch.icon} size={18} color="#10b981" />
                <span>{ch.label}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              One AI workforce. <span style={{ color: '#10b981' }}>One customer experience.</span>
            </p>
          </div>

          {/* Amirafans Graphic — No background image or container wrapper */}
          <div style={{ width: '100%', margin: '0 auto', textAlign: 'center' }}>
            <ScrollReveal direction="up" distance={80} duration={0.9}>
              <img 
                src="/amira-fans.png" 
                alt="Meet your customers wherever they are - Amira Fans Omnichannel Support" 
                style={{ width: '100%', maxWidth: '1020px', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '16px' }} 
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — INTEGRATIONS ──────────────────────────────────────────── */}
      <section className={styles.section} id="integrations" style={{ background: "#ffffff", color: "var(--text-primary)", padding: "5rem 1.5rem" }}>
        <div className={styles.inner} style={{ maxWidth: '960px' }}>
          
          {/* Single Merged Container with #1b5a92 Background */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            padding: '3.5rem 2.5rem',
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            <div className={styles.sectionHeader} style={{ marginBottom: '2.5rem' }}>
              <span className={styles.eyebrow} style={{ color: "#10b981", fontWeight: 800 }}>1000+ INTEGRATIONS</span>
              <h2 className={styles.sectionTitle} style={{ color: "#ffffff", marginTop: '0.5rem' }}>
                Your AI agent should work with your business — not around it.
              </h2>
              <p className={styles.sectionSub} style={{ color: "rgba(255, 255, 255, 0.85)", margin: '0.75rem auto 0 auto', maxWidth: '720px' }}>
                Connect Amira to the tools your team already uses. Your AI agent can access the information and systems it needs to provide faster, more accurate support.
              </p>
            </div>

            {/* Interactive Step Cards with Child Hover Animations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                { step: "0", num: "STEP 01", title: "Connect your tools.", desc: "Link CRM, Helpdesk, Slack & Email" },
                { step: "1", num: "STEP 02", title: "Give your AI context.", desc: "Upload docs, APIs & custom rules" },
                { step: "2", num: "STEP 03", title: "Let it take action.", desc: "Auto-resolve tickets 24/7" }
              ].map((st, i) => (
                <div
                  key={st.num}
                  onClick={() => setActiveStep(i)}
                  className={styles.stepCard}
                  style={{
                    backgroundColor: activeStep === i ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.35rem 1.15rem',
                    border: activeStep === i ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: activeStep === i ? '0 10px 30px rgba(16, 185, 129, 0.35)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '11.5px', fontWeight: 850, color: activeStep === i ? '#10b981' : '#a7f3d0', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>{st.num}</span>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '0 0 0.25rem 0' }}>{st.title}</p>
                  <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', display: 'block' }}>{st.desc}</span>
                </div>
              ))}
            </div>

            {/* Amira Integrations Banner Showcase with Mouse Distance-Based Zoom Out Effect */}
            <div
              onMouseMove={handleOrbitMouseMove}
              onMouseLeave={handleOrbitMouseLeave}
              className={styles.orbitContainer}
              style={{
                width: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                backgroundColor: '#0a0c16',
                padding: '1.75rem',
                marginBottom: '2.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                cursor: 'crosshair'
              }}
            >
              <ScrollReveal direction="up" distance={70} duration={0.9}>
                <img 
                  src="/amira-integrations-banner.png" 
                  alt="Amira 1000+ Integrations Ecosystem" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '480px', 
                    objectFit: 'contain', 
                    borderRadius: '14px',
                    display: 'block',
                    transform: `scale(${orbitZoomScale})`,
                    transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
              </ScrollReveal>
            </div>

            <div style={{ textAlign: 'center' }}>
              <a href="/dashboard/v3/integrations" className={`${styles.btnPrimary} ${styles.hoverButton}`} style={{
                backgroundColor: '#10b981', color: '#ffffff', padding: '0.9rem 2rem', fontSize: '15px', fontWeight: 800,
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem'
              }}>
                <span>Explore 1,000+ Integrations</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 6 — HUMAN-LIKE CONVERSATIONS ───────────────────────────── */}
      <section className={styles.section} style={{ background: '#ffffff' }}>
        <div className={styles.inner} style={{ maxWidth: '960px', textAlign: 'center' }}>

          {/* Single Merged Container with #1b5a92 Background (No Left/Right/Bottom Padding for Image) */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            paddingTop: '3.5rem',
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            maxWidth: '960px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '0 2.5rem', marginBottom: '2.5rem' }}>
              <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>CONVERSATIONAL INTELLIGENCE</span>
              <h2 className={styles.sectionTitle} style={{ color: '#ffffff', marginTop: '0.5rem' }}>
                AI that actually feels conversational.
              </h2>
              <p className={styles.sectionSub} style={{ color: 'rgba(255, 255, 255, 0.85)', margin: '0.75rem auto 2.5rem auto', maxWidth: '720px' }}>
                Customers shouldn't feel like they're talking to a machine. Amira is designed to understand conversations, respond naturally, and keep interactions moving toward a resolution.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { icon: "phone-outline", title: "Listen" },
                { icon: "compass-outline", title: "Understand" },
                { icon: "message-circle-outline", title: "Respond" },
                { icon: "checkmark-circle-outline", title: "Resolve" }
              ].map((item, idx) => (
                <div key={item.title} className={styles.hoverCard} style={{
                  backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#10b98115', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlowIcon name={item.icon} size={20} color="#10b981" />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#1b5a92', display: 'block', marginBottom: '0.15rem' }}>PHASE 0{idx + 1}</span>
                    <p style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.title}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* Aira Convo Showcase Image (Flush to left, right & bottom edges) */}
            <div style={{ width: '100%', margin: 0, padding: 0, lineHeight: 0 }}>
              <ScrollReveal direction="up" distance={90} duration={1.0}>
                <img 
                  src="/amira-convo.png" 
                  alt="AI that actually feels conversational - Amira Convo" 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — PRICING TABLE ───────────────────────────────────────── */}
      <section className={styles.section} id="pricing" style={{ background: '#ffffff', padding: '5rem 1.5rem' }}>
        <div className={styles.inner} style={{ maxWidth: '1200px' }}>
          <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>PRICING PLANS</span>
            <h2 className={styles.sectionTitle} style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#0f172a', margin: '0.5rem 0' }}>Start small. Scale without limits.</h2>
            <p className={styles.sectionSub} style={{ fontSize: '16px', color: '#64748b', maxWidth: '680px', margin: '0 auto' }}>
              Simple, transparent pricing tailored for support teams of every size.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
            {[
              {
                title: "For Small Businesses",
                price: "$49",
                period: "/month",
                desc: "Give your customers enterprise-level support without building a massive support team.",
                highlight: "More support. Less overhead.",
                features: [
                  "500 AI Voice & Chat Minutes/mo",
                  "1 Active AI Voice Agent",
                  "Webchat & Phone Channels",
                  "Basic CRM & Email Sync",
                  "Standard 24/7 Support"
                ],
                popular: false,
                buttonText: "Start Free Trial",
                buttonStyle: { backgroundColor: '#1b5a92', color: '#ffffff' },
                href: "/dashboard/v3/billing"
              },
              {
                title: "For Growing Teams",
                price: "$149",
                period: "/month",
                desc: "Automate repetitive conversations while your human agents focus on complex customer needs.",
                highlight: "AI handles the volume. Your team handles the important stuff.",
                features: [
                  "2,500 AI Voice & Chat Minutes/mo",
                  "Up to 5 Active AI Voice Agents",
                  "Voice, WhatsApp, Webchat & Email",
                  "1,000+ Tool Integrations",
                  "Realtime Transcripts & Analytics",
                  "Priority Support"
                ],
                popular: true,
                buttonText: "Get Started with Pro →",
                buttonStyle: { backgroundColor: '#10b981', color: '#ffffff', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' },
                href: "/dashboard/v3/billing"
              },
              {
                title: "For Large Support Teams",
                price: "Custom",
                period: "",
                desc: "Deploy AI agents across your customer support operation and handle more conversations without constantly increasing headcount.",
                highlight: "Scale your support without scaling the workload.",
                features: [
                  "Unlimited AI Voice & Chat Volume",
                  "Unlimited Custom AI Agents",
                  "Custom Knowledge Base & Webhooks",
                  "Dedicated Account Manager & SLA",
                  "Custom CRM & Database Integration"
                ],
                popular: false,
                buttonText: "Contact Sales",
                buttonStyle: { backgroundColor: '#ffffff', color: '#1b5a92', border: '1.5px solid #1b5a92' },
                href: "mailto:sales@heyamira.com?subject=Amira%20Enterprise%20Plan%20Inquiry"
              }
            ].map(tier => (
              <div key={tier.title} className={styles.hoverCard} style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                border: tier.popular ? '2.5px solid #10b981' : '1px solid #e2e8f0',
                boxShadow: tier.popular ? '0 12px 40px rgba(16, 185, 129, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '2rem',
                position: 'relative'
              }}>
                {tier.popular && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 800,
                    padding: '0.25rem 0.85rem', borderRadius: '99px', letterSpacing: '0.05em', textTransform: 'uppercase'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1b5a92', margin: 0, letterSpacing: '-0.01em' }}>
                    {tier.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '1rem 0 0.5rem 0' }}>
                    <span style={{ fontSize: '38px', fontWeight: 850, color: '#0f172a' }}>{tier.price}</span>
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>{tier.period}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {tier.desc}
                  </p>

                  <div style={{
                    margin: '1.25rem 0',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: 750, color: '#047857', margin: 0, lineHeight: 1.4 }}>
                      {tier.highlight}
                    </p>
                  </div>

                  {/* Feature List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                    {tier.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '13.5px', color: '#334155', fontWeight: 500 }}>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={tier.href} className={styles.btnPrimary} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0.85rem 1.5rem', borderRadius: '12px', fontSize: '14.5px', fontWeight: 750,
                  textDecoration: 'none', textAlign: 'center', ...tier.buttonStyle
                }}>
                  {tier.buttonText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8 — 4-SECOND AUTO-TOGGLING CAROUSEL CARD ────────────────── */}
      <section className={styles.section} id="benefits" style={{ background: '#ffffff' }}>
        <div className={styles.inner}>

          {/* Single Merged Container with amira-background.png */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            paddingTop: '3.5rem',
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            maxWidth: '960px',
            margin: '0 auto',
            overflow: 'hidden',
            textAlign: 'center',
            position: 'relative'
          }}>

            {/* Interactive Manual Toggle Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', padding: '0 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(10px)', padding: '5px', borderRadius: '99px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <button
                  onClick={() => handleTabChange(0)}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '99px',
                    border: 'none',
                    backgroundColor: carouselIndex === 0 ? '#10b981' : 'transparent',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: carouselIndex === 0 ? '0 4px 16px rgba(16, 185, 129, 0.45)' : 'none'
                  }}
                >
                  WITH AMIRA
                </button>
                <button
                  onClick={() => handleTabChange(1)}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '99px',
                    border: 'none',
                    backgroundColor: carouselIndex === 1 ? '#ef4444' : 'transparent',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: carouselIndex === 1 ? '0 4px 16px rgba(239, 68, 68, 0.45)' : 'none'
                  }}
                >
                  WITHOUT AMIRA
                </button>
              </div>
            </div>

            {/* Header Content */}
            <div style={{
              padding: '0 2.5rem',
              marginBottom: '2.5rem',
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.25s ease, transform 0.25s ease'
            }}>
              <span className={styles.eyebrow} style={{ color: carouselIndex === 0 ? '#10b981' : '#f59e0b', fontWeight: 800, transition: 'color 0.3s ease' }}>
                {carouselIndex === 0 ? 'MEASURABLE RESULTS' : 'THE TRADITIONAL REALITY'}
              </span>
              <h2 className={styles.sectionTitle} style={{ color: '#ffffff', marginTop: '0.5rem', marginBottom: 0, fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)' }}>
                {carouselIndex === 0 ? 'What happens when your support runs on Amira?' : 'What happens when you support WITHOUT Amira?'}
              </h2>
            </div>

            {/* Centered Cards Grid */}
            <div style={{
              padding: '0 2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              justifyContent: 'center',
              gap: '1.25rem',
              marginBottom: '2.5rem',
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(12px) scale(0.98)' : 'translateY(0) scale(1)',
              transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {(carouselIndex === 0 ? [
                { icon: "clock-outline", stat: "Lower Wait Times", desc: "Customers get answers instantly instead of sitting in queues.", accent: "#10b981" },
                { icon: "emoji-smile-outline", stat: "Higher Satisfaction", desc: "Give customers faster, more consistent support across channels.", accent: "#10b981" },
                { icon: "sun-outline", stat: "24/7 Availability", desc: "Your support doesn't clock out. Instant resolution overnight.", accent: "#10b981" },
                { icon: "rotate-cw-outline", stat: "Less Repetitive Work", desc: "Let AI handle the routine questions your team answers every day.", accent: "#10b981" },
                { icon: "zap-outline", stat: "Boosted Productivity", desc: "Free your human agents to focus on high-value, complex problems.", accent: "#10b981" },
                { icon: "layers-outline", stat: "Limitless Scalability", desc: "Handle more customers without adding support staff at the same rate.", accent: "#10b981" }
              ] : [
                { icon: "phone-missed-outline", stat: "Long Call Queues", desc: "Customers wait 45+ minutes on hold, leading to angry drop-offs.", accent: "#ef4444" },
                { icon: "emoji-sad-outline", stat: "Customer Frustration", desc: "Inconsistent answers and repeated explanations across agents.", accent: "#ef4444" },
                { icon: "moon-outline", stat: "Closed After Hours", desc: "Inquiries build up overnight and over weekends with zero response.", accent: "#ef4444" },
                { icon: "refresh-cw-outline", stat: "Repetitive Fatigue", desc: "Human agents spend 80% of their day answering the same 5 questions.", accent: "#ef4444" },
                { icon: "flame-outline", stat: "Burnout & Turnover", desc: "Overwhelmed support reps experience high stress and high turnover.", accent: "#ef4444" },
                { icon: "chart-down-outline", stat: "Skyrocketing Costs", desc: "Scaling support requires hiring, training, and managing massive teams.", accent: "#ef4444" }
              ]).map(b => (
                <div key={b.stat} className={styles.hoverCard} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    backgroundColor: `${b.accent}15`, border: `1px solid ${b.accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <GlowIcon name={b.icon} size={22} color={b.accent} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.35rem 0' }}>{b.stat}</h3>
                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Alternating Showcase Image Container (Fixed height to prevent container jump) */}
            <div style={{
              width: '100%',
              height: 'clamp(360px, 42vw, 490px)',
              position: 'relative',
              overflow: 'hidden',
              margin: 0,
              padding: 0,
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'scale(0.98)' : 'scale(1)',
              transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <img 
                src={carouselIndex === 0 ? "/amira-happy.png" : "/amira-confused.png"} 
                alt={carouselIndex === 0 ? "What happens when your support runs on Amira - Amira Happy Customer" : "What happens when you support WITHOUT Amira - Amira Confused Customer"} 
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top center' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 9 — HOW IT WORKS ──────────────────────────────────────────── */}
      <section className={styles.section} style={{ background: '#ffffff' }}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow} style={{ color: '#0f172a', fontWeight: 800 }}>SETUP PROCESS</span>
            <h2 className={styles.sectionTitle}>From setup to support in minutes.</h2>
          </div>

          <div className={styles.stepsRow}>
            {[
              { num: "01", title: "Create Your Agent", desc: "Tell Amira about your business, your customers, and how you want your AI agent to work." },
              { num: "02", title: "Connect Your Tools", desc: "Connect the platforms and systems your AI agent needs to access." },
              { num: "03", title: "Choose Your Channels", desc: "Deploy your agent across voice, chat, email, WhatsApp, and more." },
              { num: "04", title: "Go Live", desc: "Your AI agent starts handling customer conversations around the clock." }
            ].map((step, i) => (
              <div key={step.num} className={styles.stepCard}>
                {i < 3 && <div className={styles.stepConnector} />}
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDesc}>{step.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="/dashboard/v3/outreach" className={styles.btnPrimary} style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.85rem 1.75rem' }}>
              Create Your AI Agent
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 10 — DIFFERENTIATOR ──────────────────────────────────────── */}
      <section className={styles.section} style={{ background: '#ffffff' }}>
        <div className={styles.inner} style={{ maxWidth: '960px', textAlign: 'center' }}>

          {/* Single Merged Container with #1b5a92 Background (No Left/Right/Bottom Padding for Image) */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            paddingTop: '3.5rem',
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            maxWidth: '960px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '0 2.5rem', marginBottom: '2.5rem' }}>
              <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>THE AMIRA DIFFERENCE</span>
              <h2 className={styles.sectionTitle} style={{ color: '#ffffff', marginTop: '0.5rem' }}>
                Stop hiring for every conversation.
              </h2>
              <p className={styles.sectionSub} style={{ color: 'rgba(255, 255, 255, 0.85)', margin: '0.75rem auto 2.5rem auto', maxWidth: '720px' }}>
                Traditional support requires more people every time your customer base grows. Amira gives you an AI workforce that can scale with your business.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { icon: "chart-up-outline", title: "More conversations." },
                { icon: "clock-outline", title: "More availability." },
                { icon: "shield-outline", title: "More consistency." },
                { icon: "zap-outline", title: "Less repetitive work." }
              ].map(item => (
                <div key={item.title} className={styles.hoverCard} style={{
                  padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '14px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#10b98115', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GlowIcon name={item.icon} size={20} color="#10b981" />
                  </div>
                  <span style={{ fontSize: '14.5px', fontWeight: 750, color: '#1b5a92', textAlign: 'left' }}>
                    {item.title}
                  </span>
                </div>
              ))}
              </div>
            </div>

            {/* Amirascale Showcase Image (Flush to left, right & bottom edges) */}
            <div style={{ width: '100%', margin: 0, padding: 0, lineHeight: 0 }}>
              <ScrollReveal direction="up" distance={90} duration={1.0}>
                <img 
                  src="/amirascale.png" 
                  alt="Stop hiring for every conversation - Amira Scale" 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 11 — USE CASES ────────────────────────────────────────────── */}
      <section className={styles.section} id="usecases" style={{ background: '#ffffff' }}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow} style={{ color: '#0f172a', fontWeight: 800 }}>USE CASES</span>
            <h2 className={styles.sectionTitle}>Built for the conversations your business has every day.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: "Customer Support", desc: "Answer questions and resolve common customer issues instantly." },
              { title: "Sales & Prospecting", desc: "Qualify leads, answer product questions, and follow up with prospects." },
              { title: "Customer Onboarding", desc: "Collect information, process documents, and guide customers through setup." },
              { title: "Technical Support", desc: "Help customers troubleshoot issues and provide first-line technical assistance." },
              { title: "Appointment & Booking Support", desc: "Handle inquiries, confirmations, reminders, and scheduling conversations." },
              { title: "Customer Feedback", desc: "Collect feedback and understand what your customers are saying." }
            ].map(uc => (
              <div key={uc.title} style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                border: '1px solid var(--border-subtle)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 750, color: '#1b5a92', margin: 0 }}>{uc.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.5rem' }}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 12 — SECURITY / TRUST ────────────────────────────────────── */}
      <section className={styles.section} style={{ background: '#ffffff' }}>
        <div className={styles.inner} style={{ maxWidth: '960px', textAlign: 'center' }}>

          {/* Single Merged Container with #1b5a92 Background (No Left/Right/Bottom Padding for Image) */}
          <div style={{
            background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
            borderRadius: '24px',
            paddingTop: '3.5rem',
            boxShadow: '0 20px 60px rgba(27, 90, 146, 0.3)',
            maxWidth: '960px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '0 2.5rem', marginBottom: '2.5rem' }}>
              <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>SECURITY & COMPLIANCE</span>
              <h2 className={styles.sectionTitle} style={{ color: '#ffffff', marginTop: '0.5rem' }}>
                AI support you can trust.
              </h2>
              <p className={styles.sectionSub} style={{ color: 'rgba(255, 255, 255, 0.85)', margin: '0.75rem auto 2rem auto', maxWidth: '720px' }}>
                Your customers are trusting you with their questions, information, and conversations. Amira is built to help businesses deliver reliable, consistent customer experiences while keeping your support operation organized and under control.
              </p>

              <div style={{
                padding: '1.5rem 2.25rem', backgroundColor: '#ffffff', borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'inline-flex', alignItems: 'center', gap: '0.85rem'
              }}>
                <GlowIcon name="shield-outline" size={24} color="#1b5a92" />
                <p style={{ fontSize: '19px', fontWeight: 800, color: '#1b5a92', margin: 0 }}>
                  Your customers. <span style={{ color: '#10b981' }}>Your data.</span> Your AI workforce.
                </p>
              </div>
            </div>

            {/* Amiratrust Showcase Image (Flush to left, right & bottom edges) */}
            <div style={{ width: '100%', margin: 0, padding: 0, lineHeight: 0 }}>
              <ScrollReveal direction="up" distance={90} duration={1.0}>
                <img 
                  src="/amira-trust.png" 
                  alt="AI support you can trust - Amira Trust & Security" 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection} style={{ background: '#1b5a92 url(/amira-background.png) center/cover no-repeat', color: '#ffffff', padding: '6rem 1.5rem 0 1.5rem', overflow: 'hidden' }}>
        <div className={styles.ctaInner} style={{ maxWidth: '920px', textAlign: 'center', margin: '0 auto' }}>
          <span className={styles.eyebrow} style={{ color: '#10b981', fontWeight: 800 }}>YOUR CUSTOMERS ARE WAITING</span>
          <h2 className={styles.ctaTitle} style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)', color: '#ffffff', marginTop: '0.5rem' }}>
            Put your customer support on autopilot.
          </h2>
          <p className={styles.ctaSub} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', lineHeight: 1.6, margin: '1rem 0 2rem 0' }}>
            Don't make them wait for an answer. Deploy an AI customer support agent that works <strong>24/7, across every channel, and at the speed your customers expect.</strong>
          </p>

          <p style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginBottom: '2rem' }}>
            Focus on what matters. Let AI handle the rest.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <a href="/dashboard/v3/outreach" className={styles.btnPrimary} style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.95rem 2rem', fontSize: '16.5px' }}>
              Get Started
              <ArrowRight size={18} />
            </a>
            <a href="/login" className={styles.btnSecondary} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)', padding: '0.95rem 2rem', fontSize: '16.5px' }}>
              Talk to Us
            </a>
          </div>

          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: '3rem' }}>
            No complicated setup. No massive support team required.
          </p>

          {/* Autopilot Image Showcase at the bottom of the section */}
          <div style={{ width: '100%', margin: '0 auto', textAlign: 'center', lineHeight: 0 }}>
            <ScrollReveal direction="up" distance={80} duration={0.9}>
              <img 
                src="/amira-auto-2.png" 
                alt="Put your customer support on autopilot - Amira AI" 
                style={{ 
                  width: '90%', 
                  maxWidth: '520px', 
                  maxHeight: '360px',
                  height: 'auto', 
                  display: 'block', 
                  margin: '0 auto',
                  borderRadius: '16px 16px 0 0',
                  objectFit: 'contain'
                }} 
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogoRow}>
              <img src="/amira-logo-footer.svg" alt="Amira AI" style={{ height: '26px', width: 'auto' }} />
            </div>
            <p className={styles.footerDesc}>Amira AI — Your AI Customer Support Workforce. 24/7 support across calls, chats, emails, and tickets.</p>
          </div>
          {[
            { heading: "Product", links: ["Capabilities", "Multi-Channel", "Integrations", "Use Cases", "Benefits"] },
            { heading: "Company", links: ["About", "Security", "Contact", "Privacy"] },
            { heading: "Support", links: ["Documentation", "Community", "Status"] },
          ].map(col => (
            <div key={col.heading} className={styles.footerCol}>
              <h4 className={styles.footerColHead}>{col.heading}</h4>
              <ul className={styles.footerColLinks}>
                {col.links.map(l => <li key={l}><a href="#" className={styles.footerLink}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <span className={styles.footerCopy}>© 2026 Amira Technologies Inc. All rights reserved.</span>
          <div className={styles.footerSocials}>
            <a href="#" className={styles.footerLink}>Twitter</a>
            <a href="#" className={styles.footerLink}>LinkedIn</a>
            <a href="#" className={styles.footerLink}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
