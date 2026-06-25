"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import { useLocalPricing } from "@/hooks/useLocalPricing";
import { 
  Droplet, 
  Wind, 
  Zap, 
  Truck, 
  Key, 
  Calendar, 
  CreditCard, 
  PhoneCall, 
  Check, 
  X 
} from "lucide-react";

function LocalPrice({ basePriceUsd }: { basePriceUsd: number }) {
  const { price, isLoading } = useLocalPricing(basePriceUsd);
  if (isLoading) return <>{`$${basePriceUsd}`}</>;
  return <>{price}</>;
}

function MeshWaveCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Grid parameters
    const cols = 40;
    const rows = 15;
    const spacingX = width / (cols - 1);
    const spacingY = height / (rows - 1);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw a mesh of points
      const points: { x: number; y: number }[][] = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
          const baseX = c * spacingX;
          const baseY = r * spacingY;

          const nx = (baseX / width) * 2 - 1;
          const ny = (baseY / height); // 0 (back) to 1 (front)

          const wave1 = Math.sin(nx * 4 + time + ny * 3) * 20;
          const wave2 = Math.cos(ny * 5 - time * 1.5 + nx * 2) * 12;
          const heightOffset = (wave1 + wave2) * ny; // fade out wave amplitude at the back

          const perspectiveY = baseY + heightOffset;

          points[r][c] = { x: baseX, y: perspectiveY };
        }
      }

      // Draw lines
      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          if (c === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        const alpha = 0.05 + 0.18 * (r / (rows - 1));
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.stroke();
      }

      // Vertical lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = points[r][c];
          if (r === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        const alpha = 0.05 + 0.12 * (c / (cols - 1));
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.stroke();
      }

      // Intersection glow dots
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 3) {
          const p = points[r][c];
          const alpha = 0.1 + 0.3 * (r / (rows - 1)) * Math.sin(time + c);
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      time += 0.015;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.meshCanvasContainer}>
      <canvas ref={canvasRef} className={styles.meshCanvas} />
    </div>
  );
}

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState<"monthly" | "annually">("monthly");
  const [currentLang, setCurrentLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Call simulation states
  const [demoScenario, setDemoScenario] = useState<"hvac" | "plumbing">("hvac");
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

  const hvacDialogue = [
    { time: 2, sender: "user", text: "Hi, my AC has stopped working completely and it's 95 degrees outside. Can you get a technician out here today?" },
    { time: 8, sender: "ai", text: "Oh, that sounds incredibly uncomfortable! I can absolutely help schedule a technician for you. Let me check our team's schedule for today." },
    { time: 14, sender: "system", text: "[System Check] Querying Housecall Pro calendar for next available HVAC tech..." },
    { time: 18, sender: "ai", text: "I have an emergency slot available with our tech, Marcus, between 2 PM and 4 PM today. Would that time slot work for you?" },
    { time: 25, sender: "user", text: "Yes, that's perfect. Please book it." },
    { time: 28, sender: "ai", text: "Great! I have locked in that time. Since this is an emergency dispatch, there is a fifty dollar dispatch fee to secure the booking. I am sending a secure payment link to your mobile number now." },
    { time: 36, sender: "system", text: "[System Check] Generating Stripe payment link & SMS dispatch notification to Marcus..." },
    { time: 40, sender: "ai", text: "I've just sent that over. Marcus is fully briefed and is heading your way. Is there anything else you need help with?" },
    { time: 46, sender: "user", text: "No, that's it. Thanks a lot!" },
    { time: 49, sender: "ai", text: "You're welcome! Stay cool, and Marcus will see you shortly." }
  ];

  const plumbingDialogue = [
    { time: 2, sender: "user", text: "Hey, my kitchen sink is backing up and flooding the floor. I need someone immediately." },
    { time: 8, sender: "ai", text: "I understand this is an emergency. Let's get someone out to help. I am looking up our emergency plumber schedule right now." },
    { time: 14, sender: "system", text: "[System Check] Checking plumbing dispatch routes & calendar availability..." },
    { time: 18, sender: "ai", text: "Our emergency plumber, David, is nearby and can be at your location in forty-five minutes. Would you like me to dispatch him?" },
    { time: 25, sender: "user", text: "Yes, please send him right away!" },
    { time: 28, sender: "ai", text: "Done! I've dispatched David and sent the job details to his phone. I'm also emailing you a booking confirmation right now." },
    { time: 35, sender: "system", text: "[System Check] Creating ticket in Jobber & triggering Gmail confirmation message..." },
    { time: 39, sender: "ai", text: "All set. David will call you when he's five minutes away. Please keep the main water valve shut if possible." },
    { time: 46, sender: "user", text: "Alright, will do. Thank you." },
    { time: 49, sender: "ai", text: "You're very welcome. Help is on the way!" }
  ];

  const dialogue = demoScenario === "hvac" ? hvacDialogue : plumbingDialogue;
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

  const handleSelectScenario = (scenario: "hvac" | "plumbing") => {
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
            <li className={styles.navLinkWrapper}>
              <span className={styles.navLink}>Solutions ▼</span>
              <div className={styles.megaMenu}>
                <div className={styles.megaMenuColumn}>
                  <div className={styles.megaMenuTitle}>Services</div>
                  
                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <Droplet className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>Emergency Plumbing</div>
                      <div className={styles.megaMenuItemDesc}>Qualify and dispatch plumbers for urgent leaks.</div>
                    </div>
                  </a>
                  
                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <Wind className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>HVAC Repair</div>
                      <div className={styles.megaMenuItemDesc}>Schedule techs, triage heat and AC calls 24/7.</div>
                    </div>
                  </a>
                  
                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <Zap className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>Electrical</div>
                      <div className={styles.megaMenuItemDesc}>Route calls, book inspections, alert electricians.</div>
                    </div>
                  </a>

                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <Truck className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>Towing</div>
                      <div className={styles.megaMenuItemDesc}>Coordinate dispatch and road support.</div>
                    </div>
                  </a>

                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <Key className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>Locksmith</div>
                      <div className={styles.megaMenuItemDesc}>Handle lockouts and schedule security installs.</div>
                    </div>
                  </a>
                </div>

                <div className={styles.megaMenuColumn}>
                  <div className={styles.megaMenuTitle}>Workflows</div>

                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <Calendar className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>Google Calendar</div>
                      <div className={styles.megaMenuItemDesc}>Sync bookings and check technician availability.</div>
                    </div>
                  </a>

                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <CreditCard className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>Stripe Payments</div>
                      <div className={styles.megaMenuItemDesc}>Collect deposit or dispatch fee during the call.</div>
                    </div>
                  </a>

                  <a href="/login?redirect=/dashboard/ai-agent" className={styles.megaMenuItem}>
                    <PhoneCall className={styles.megaMenuIcon} />
                    <div className={styles.megaMenuText}>
                      <div className={styles.megaMenuItemName}>Twilio SMS</div>
                      <div className={styles.megaMenuItemDesc}>Instantly notify technicians with dispatch details.</div>
                    </div>
                  </a>
                </div>
              </div>
            </li>
            <li className={styles.navLinkWrapper}><a href="#problem" className={styles.navLink}>Repetitive Calls</a></li>
            <li className={styles.navLinkWrapper}><a href="#workflow" className={styles.navLink}>How Amira Works</a></li>
            <li className={styles.navLinkWrapper}><a href="#integrations" className={styles.navLink}>Integrations</a></li>
            <li className={styles.navLinkWrapper}><a href="#interactive-demo" className={styles.navLink}>Listen to Call</a></li>
            <li className={styles.navLinkWrapper}><a href="#pricing" className={styles.navLink}>Pricing</a></li>
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
            <div className={styles.mobileSubMenuTitle}>Services</div>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>Emergency Plumbing</a>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>HVAC Repair</a>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>Electrical</a>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>Towing</a>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>Locksmith</a>
            
            <div className={styles.mobileSubMenuTitle}>Workflows</div>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>Google Calendar</a>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>Stripe Payments</a>
            <a href="/login?redirect=/dashboard/ai-agent" onClick={() => setMobileMenuOpen(false)}>Twilio SMS</a>
            
            <hr />
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
            <span className={styles.heroBadgeHighlight}>AI Operations Dispatcher</span>
            <span className={styles.heroBadgeText}>Book Jobs & Dispatch Techs 24/7</span>
          </div>

          <h1 className={styles.heroTitle}>
            Stop Missing Inbound Leads and Dispatch Calls
          </h1>

          <p className={styles.heroSubtitle}>
            Amira is the 24/7 AI dispatcher for trade and field service businesses. She answers calls, qualifies emergencies, schedules jobs on your calendar, and processes dispatch fees—instantly.
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
            Built for Plumbing, HVAC, Electrical, and Field Service businesses looking to save missed revenue.
          </div>

          {/* VISUAL WORKFLOW CONTAINER */}
          <div className={styles.workflowContainer} id="workflow">
            <div className={styles.workflowHeader}>
              <div className={styles.headerDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <div className={styles.headerTitle}>AI Dispatch &amp; Scheduling Flow</div>
              <div className={styles.headerStatus}>
                <span className={styles.pulseIndicator} />
                Active Workflow
              </div>
            </div>

            <div className={styles.workflowSteps}>
              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepTitle}>Customer Calls</div>
                <p className={styles.stepText}>Customer rings your line with an emergency plumbing issue or service request.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepTitle}>Amira Answers</div>
                <p className={styles.stepText}>Answers instantly, greeting them warmly as your trade dispatcher.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepTitle}>Checks Schedule</div>
                <p className={styles.stepText}>Queries Google Calendar or Jobber in real-time to find open technician slots.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepTitle}>Books &amp; Charges</div>
                <p className={styles.stepText}>Secures the booking, collects dispatch deposit via Stripe, and logs ticket details.</p>
              </div>

              <div className={styles.workflowArrow}>➔</div>

              <div className={styles.workflowStep}>
                <div className={styles.stepNum}>5</div>
                <div className={styles.stepTitle}>Alerts Technician</div>
                <p className={styles.stepText}>Instantly sends the job notes, address, and client details to the technician via Twilio.</p>
              </div>
            </div>
          </div>
        </div>
        <MeshWaveCanvas />
      </header>

      {/* PROBLEM SECTION */}
      <section className={styles.problemSection} id="problem">
        <div className={styles.sectionHeaderCentered}>
          <span className={styles.sectionTag}>The Pain Point</span>
          <h2 className={styles.sectionTitle}>Missed Calls Mean Lost Revenue for Your Trade Business</h2>
          <p className={styles.sectionSubtitle}>
            When you are out on a job, crawling under crawlspaces, or closed after hours, missing a call means the customer simply calls your competitor.
          </p>
        </div>

        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <div className={styles.problemCardHeader}>
              <span className={styles.industryTag}>Plumbing &amp; Drainage Services</span>
            </div>
            <ul className={styles.problemList}>
              <li>
                <X className={styles.bulletXIcon} />
                <div>
                  <strong>"I have a major leak in my kitchen."</strong>
                  <p>Triaging emergency flooding and immediately dispatching an on-call tech.</p>
                </div>
              </li>
              <li>
                <X className={styles.bulletXIcon} />
                <div>
                  <strong>"When can someone come clear my drain?"</strong>
                  <p>Checking live tech schedules and booking scheduling slots.</p>
                </div>
              </li>
              <li>
                <X className={styles.bulletXIcon} />
                <div>
                  <strong>"What is your emergency dispatch call-out fee?"</strong>
                  <p>Informing customers and pre-authorizing booking deposits.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.problemCard}>
            <div className={styles.problemCardHeader}>
              <span className={styles.industryTag}>HVAC &amp; Electrical Services</span>
            </div>
            <ul className={styles.problemList}>
              <li>
                <X className={styles.bulletXIcon} />
                <div>
                  <strong>"My heater stopped working and it is freezing outside."</strong>
                  <p>Identifying emergency criteria and selecting local technicians.</p>
                </div>
              </li>
              <li>
                <X className={styles.bulletXIcon} />
                <div>
                  <strong>"I need an estimate on a new AC installation."</strong>
                  <p>Booking consultations and matching leads to sales techs.</p>
                </div>
              </li>
              <li>
                <X className={styles.bulletXIcon} />
                <div>
                  <strong>"Are you available for a safety inspection tomorrow?"</strong>
                  <p>Cross-referencing open electrician slots and confirming slots.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>35%+</div>
            <div className={styles.metricTitle}>Calls Missed After Hours</div>
            <p className={styles.metricDesc}>Over a third of trade business opportunities are lost to voicemail or missed calls.</p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>$150+</div>
            <div className={styles.metricTitle}>Average Lost Job Value</div>
            <p className={styles.metricDesc}>Every missed booking is money directly pocketed by a competing contractor.</p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>82%</div>
            <div className={styles.metricTitle}>Immediate Booking Rate</div>
            <p className={styles.metricDesc}>Customers book immediately when answered by a live, friendly agent.</p>
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
              className={`${styles.scenarioTab} ${demoScenario === "hvac" ? styles.scenarioTabActive : ""}`}
              onClick={() => handleSelectScenario("hvac")}
            >
              🔥 HVAC Emergency Dispatch
            </button>
            <button 
              className={`${styles.scenarioTab} ${demoScenario === "plumbing" ? styles.scenarioTabActive : ""}`}
              onClick={() => handleSelectScenario("plumbing")}
            >
              🚰 Plumbing Scheduling
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
              <li><Check className={styles.planFeatureIcon} /> 500 call minutes included</li>
              <li><Check className={styles.planFeatureIcon} /> 1 custom AI phone line</li>
              <li><Check className={styles.planFeatureIcon} /> Knowledge base training (up to 5MB)</li>
              <li><Check className={styles.planFeatureIcon} /> Basic dashboard logs &amp; analytics</li>
              <li><Check className={styles.planFeatureIcon} /> Webhooks &amp; email support</li>
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
              <li><Check className={styles.planFeatureIcon} /> 3,000 call minutes included</li>
              <li><Check className={styles.planFeatureIcon} /> 5 custom AI phone lines</li>
              <li><Check className={styles.planFeatureIcon} /> Unlimited document training space</li>
              <li><Check className={styles.planFeatureIcon} /> Smart human handoff &amp; escalation</li>
              <li><Check className={styles.planFeatureIcon} /> Advanced dashboard analytics &amp; CRM</li>
              <li><Check className={styles.planFeatureIcon} /> Priority customer support</li>
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
              <li><Check className={styles.planFeatureIcon} /> Unlimited custom call minutes</li>
              <li><Check className={styles.planFeatureIcon} /> Dedicated infrastructure (SLA guaranteed)</li>
              <li><Check className={styles.planFeatureIcon} /> Custom voice model fine-tuning</li>
              <li><Check className={styles.planFeatureIcon} /> Advanced API gateways &amp; webhooks</li>
              <li><Check className={styles.planFeatureIcon} /> HIPAA &amp; enterprise compliance</li>
              <li><Check className={styles.planFeatureIcon} /> Dedicated account manager &amp; 24/7 support</li>
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
            <h2 className={styles.sectionTitle} style={{ marginTop: '0.75rem' }}>Deploy a Pre-Trained Operations Agent in Seconds</h2>
            <p className={styles.sectionSubtitle}>Select a layout pre-configured with the database queries and escalation rules for your exact operations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '🚰', name: 'Emergency Plumbing Dispatcher', tag: 'Plumbing', desc: 'Qualifies emergency leaks, processes call-out fees via Stripe, and dispatches plumbers instantly.', stat: '80% dispatch deflection' },
              { icon: '🔥', name: 'HVAC Repair Scheduler', tag: 'HVAC', desc: 'Checks active technician calendars, triages heating/AC outages, and logs calendar bookings.', stat: '90% scheduling accuracy' },
              { icon: '⚡', name: 'Electrical Dispatcher', tag: 'Electrical', desc: 'Identifies emergency criteria, pre-authorizes dispatch deposits, and schedules electricians.', stat: '24/7 emergency coverage' },
              { icon: '🚚', name: 'Tow Truck Coordinator', tag: 'Towing', desc: 'Collects vehicle details and breakdown coordinates, booking towing dispatches on active routes.', stat: 'Under 4 min dispatch time' },
              { icon: '🔑', name: 'Emergency Locksmith Dispatcher', tag: 'Locksmith', desc: 'Qualifies residential/vehicle lockouts and schedules nearest technician with direct notification.', stat: '95% caller satisfaction' },
              { icon: '🧹', name: 'Cleaning Services Intake', tag: 'Cleaning', desc: 'Handles regular and deep clean job bookings, collects addresses, and confirms appointments.', stat: '70% reduction in admin cost' },
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
          🔒 <strong>No Lock-in:</strong> Cancel anytime. If Amira doesn't capture missed dispatch leads and book more trade jobs in 30 days, we'll refund you in full.
        </p>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className={styles.footerCtaBanner}>
        <div className={styles.footerCtaContainer}>
          <div className={styles.footerCtaLeft}>
            <h2 className={styles.footerCtaTitle}>Ready to stop missing high-value dispatch calls?</h2>
            <p className={styles.footerCtaDesc}>
              Join hundreds of field service managers using Amira to book emergency dispatches, automate schedulers, and capture every lead.
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
              The AI dispatching platform that schedules trade service calls, charges booking deposits, and dispatches technicians 24/7.
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
