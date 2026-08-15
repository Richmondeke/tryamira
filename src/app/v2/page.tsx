"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { AmiraLogo } from "@/components/ui/AmiraLogo";
import {
  ArrowRight, Check, ChevronDown, Star, X,
  Zap, Shield, Brain, Clock, Play, ChevronRight,
} from "lucide-react";

// ─── AMIRA SPARKLE ICON ──────────────────────────────────────────────────────
function AmiraIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="#1b5a92" />
      <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

// ─── WORKFLOW CARD DATA ───────────────────────────────────────────────────────
type WorkflowState = "Planning" | "Executing" | "Needs Decision" | "Completed";

const WORKFLOW_STATES: WorkflowState[] = ["Planning", "Executing", "Needs Decision", "Completed"];

const workflowCards = [
  { id: 1, icon: "🤝", title: "Onboard a customer", dept: "Customer Success", color: "#10b981", steps: ["Create CRM record", "Send welcome email", "Create Notion project", "Invite to Slack", "Schedule kickoff"] },
  { id: 2, icon: "📋", title: "Prepare board meeting", dept: "Executive", color: "#1b5a92", steps: ["Pull KPI data", "Update investor deck", "Summarize highlights", "Draft agenda", "Schedule meeting"] },
  { id: 3, icon: "🧑‍💼", title: "Hire a candidate", dept: "HR", color: "#f59e0b", steps: ["Post job to channels", "Screen applicants", "Schedule interviews", "Collect feedback", "Send offer"] },
  { id: 4, icon: "💳", title: "Approve payment", dept: "Finance", color: "#ef4444", steps: ["Verify invoice", "Check contract", "Confirm budget", "Review history", "Approve payment"] },
  { id: 5, icon: "🚀", title: "Launch a feature", dept: "Engineering", color: "#3b82f6", steps: ["Run tests", "Write release notes", "Deploy to staging", "Notify team", "Ship to production"] },
  { id: 6, icon: "📊", title: "Generate weekly report", dept: "Executive", color: "#10b981", steps: ["Pull metrics", "Summarize pipeline", "Flag risks", "Write insights", "Send to team"] },
  { id: 7, icon: "🔄", title: "Renew a customer", dept: "Customer Success", color: "#10b981", steps: ["Pull usage data", "Review health score", "Draft renewal email", "Attach proposal", "Send & track"] },
  { id: 8, icon: "📅", title: "Plan an event", dept: "Operations", color: "#f97316", steps: ["Create agenda", "Invite attendees", "Book venue/link", "Send reminders", "Follow up"] },
  { id: 9, icon: "💰", title: "Run payroll", dept: "Finance", color: "#ef4444", steps: ["Collect timesheets", "Check deductions", "Verify totals", "Generate payslips", "Process payment"] },
  { id: 10, icon: "📝", title: "Review a contract", dept: "Legal", color: "#1b5a92", steps: ["Extract key clauses", "Check policy match", "Flag risks", "Get legal sign-off", "Countersign"] },
  { id: 11, icon: "🔥", title: "Handle an incident", dept: "Engineering", color: "#ef4444", steps: ["Triage severity", "Alert on-call", "Start incident log", "Coordinate response", "Write post-mortem"] },
  { id: 12, icon: "📬", title: "Sales follow-up", dept: "Sales", color: "#f59e0b", steps: ["Pull prospect data", "Draft personalized email", "Attach case study", "Schedule send", "Log in CRM"] },
];

// ─── ANIMATED WORKFLOW CARD ───────────────────────────────────────────────────
function WorkflowCard({ card, initialStateIndex }: { card: typeof workflowCards[0]; initialStateIndex: number }) {
  const [stateIdx, setStateIdx] = useState(initialStateIndex % 4);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx(prev => {
        if (prev < card.steps.length - 1) return prev + 1;
        setStateIdx(s => (s + 1) % 4);
        return 0;
      });
    }, 1200 + initialStateIndex * 200);
    return () => clearInterval(interval);
  }, [card.steps.length, initialStateIndex]);

  const state = WORKFLOW_STATES[stateIdx];
  const stateColors: Record<WorkflowState, string> = {
    "Planning": "#1b5a92",
    "Executing": "#f59e0b",
    "Needs Decision": "#ef4444",
    "Completed": "#10b981",
  };
  const stateColor = stateColors[state];

  return (
    <div className={styles.wfCard} style={{ borderTopColor: card.color }}>
      <div className={styles.wfCardTop}>
        <div className={styles.wfCardIcon}>{card.icon}</div>
        <div className={styles.wfCardMeta}>
          <div className={styles.wfCardTitle}>{card.title}</div>
          <div className={styles.wfCardDept}>{card.dept}</div>
        </div>
        <div
          className={styles.wfStateBadge}
          style={{ background: stateColor + "18", color: stateColor, borderColor: stateColor + "40" }}
        >
          {state === "Completed" && <Check size={10} />}
          {state === "Needs Decision" && <span className={styles.wfStatePulse} style={{ background: stateColor }} />}
          {state === "Planning" && <span className={styles.wfStateSpinner} style={{ borderTopColor: stateColor }} />}
          {state === "Executing" && <Zap size={10} />}
          {state}
        </div>
      </div>

      {/* progress bar */}
      <div className={styles.wfProgress}>
        <div
          className={styles.wfProgressFill}
          style={{
            width: `${Math.round(((stepIdx + 1) / card.steps.length) * 100)}%`,
            background: stateColor,
          }}
        />
      </div>

      {/* current step */}
      <div className={styles.wfSteps}>
        {card.steps.map((step, i) => (
          <div key={step} className={`${styles.wfStep} ${i < stepIdx ? styles.wfStepDone : i === stepIdx ? styles.wfStepActive : styles.wfStepPending}`}>
            <div className={styles.wfStepDot} style={i < stepIdx ? { background: card.color } : i === stepIdx ? { background: card.color, boxShadow: `0 0 0 3px ${card.color}30` } : {}}>
              {i < stepIdx && <Check size={8} />}
            </div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD MOCKUP (HERO) ──────────────────────────────────────────────────
function HeroDashboard() {
  return (
    <div className={styles.dashShell}>
      <div className={styles.dashSidebar}>
        {["Home","Today","Decisions","Projects","Knowledge","Integrations"].map((item, i) => (
          <div key={item} className={`${styles.dashSidebarItem} ${i === 0 ? styles.dashSidebarActive : ""}`}>
            <span className={styles.dashSidebarDot} />
            {item}
            {item === "Decisions" && <span className={styles.dashSidebarBadge}>3</span>}
          </div>
        ))}
      </div>
      <div className={styles.dashMain}>
        {/* Morning greeting */}
        <div className={styles.dashGreeting}>
          <AmiraIcon size={18} />
          <div>
            <div className={styles.dashGreetingTitle}>Good morning, Richmond.</div>
            <div className={styles.dashGreetingSub}>I've completed 22 tasks. I need your judgment on 3 decisions.</div>
          </div>
        </div>

        {/* Stat row */}
        <div className={styles.dashStats}>
          {[
            { val: "23", label: "Completed", color: "#10b981" },
            { val: "3", label: "Decisions", color: "#1b5a92" },
            { val: "1", label: "Urgent", color: "#ef4444" },
            { val: "4", label: "In progress", color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className={styles.dashStat} style={{ borderColor: s.color + "30" }}>
              <span className={styles.dashStatVal} style={{ color: s.color }}>{s.val}</span>
              <span className={styles.dashStatLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Decision card */}
        <div className={styles.dashDecisionLabel}>Your decisions</div>
        <div className={styles.dashDecision}>
          <div className={styles.dashDecisionHeader}>
            <span className={styles.dashDecisionTitle}>Review contract — Acme Corp</span>
            <span className={styles.dashDecisionTag} style={{ background: "#ef444418", color: "#ef4444" }}>Urgent</span>
          </div>
          <div className={styles.dashDecisionRow}><span>Value</span><strong>$140K ARR</strong></div>
          <div className={styles.dashDecisionRow}><span>Risk</span><strong style={{ color: "#10b981" }}>Low</strong></div>
          <div className={styles.dashDecisionRec}>
            <div className={styles.dashDecisionRecLabel}>
              <AmiraIcon size={12} />
              Recommendation
            </div>
            <div className={styles.dashDecisionRecText}>Approve. Matches legal policy. No unusual clauses. <strong style={{ color: "#1b5a92" }}>96% confidence.</strong></div>
          </div>
          <div className={styles.dashDecisionActions}>
            <button className={styles.dashApprove}><Check size={11} /> Approve</button>
            <button className={styles.dashReject}><X size={11} /> Reject</button>
          </div>
        </div>

        {/* Command bar */}
        <div className={styles.dashCmd}>
          <AmiraIcon size={13} />
          <span>What needs to happen?</span>
        </div>
      </div>
    </div>
  );
}

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────
const comparisons = [
  { category: "Chatbots (ChatGPT, Claude)", features: ["Answers questions", "Generates text", "Remembers nothing", "Can't take action", "No integrations"] },
  { category: "Note Takers (Notion AI)", features: ["Organises notes", "Summarises docs", "No execution", "No integrations", "No decisions"] },
  { category: "Workflow Builders (Zapier)", features: ["Runs automations", "You build the flow", "Rigid & brittle", "No reasoning", "No context"] },
  { category: "Project Managers (Linear)", features: ["Tracks tasks", "Shows status", "You do the work", "No AI judgment", "No execution"] },
];

const amiraFeatures = ["Plans & executes outcomes", "Remembers context", "Takes real action", "3200+ integrations", "Escalates only for judgment"];

// ─── PRICING ──────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Individual",
    price: "$29",
    period: "/month",
    desc: "For founders and knowledge workers who need an AI operator.",
    features: ["1 user", "Unlimited commands", "10 integrations", "Personal memory", "Basic approvals"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Team",
    price: "$199",
    period: "/month",
    desc: "For growing teams who want shared context and collaborative decisions.",
    features: ["Up to 10 users", "Shared knowledge", "Approvals & decisions", "Projects & analytics", "Priority support"],
    cta: "Get early access",
    highlight: true,
  },
  {
    name: "Business",
    price: "$799",
    period: "/month",
    desc: "For organisations that need advanced permissions and compliance.",
    features: ["Unlimited users", "Advanced permissions", "Audit logs", "API access", "SSO"],
    cta: "Get early access",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Private deployment, dedicated success, and custom integrations.",
    features: ["Private deployment", "Dedicated success", "Custom integrations", "Compliance", "SLA"],
    cta: "Contact sales",
    highlight: false,
  },
];

// ─── TRUST LOGOS ──────────────────────────────────────────────────────────────
const trustLogos = ["Notion", "Slack", "HubSpot", "Stripe", "GitHub", "Linear", "Salesforce", "Zoom"];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  { quote: "Amira is like having a world-class Chief of Staff for our entire team.", name: "Sarah L.", role: "CEO, Rayn" },
  { quote: "It just handles the clutter. I get time back every single day.", name: "Michael T.", role: "Head of Ops, Superace" },
  { quote: "Finally. AI that actually takes action across our tools.", name: "Jessica W.", role: "COO, Verb" },
];

// ═════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [activeComparison, setActiveComparison] = useState(0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className={styles.page}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <a href="/" className={styles.navLogo}>
            <img src="/amira-logo-dark.svg" alt="Amira" style={{ height: '26px', width: 'auto' }} />
          </a>

          <ul className={styles.navLinks}>
            {[
              { label: "Product", href: "#product" },
              { label: "Workflows", href: "#workflows" },
              { label: "Integrations", href: "#integrations" },
              { label: "Pricing", href: "#pricing" },
            ].map(l => (
              <li key={l.label}>
                <a href={l.href} className={styles.navLink}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <a href="/login" className={styles.navLogin}>Log in</a>
            <a href="/dashboard" className={styles.navCta}>Get early access</a>
          </div>

          <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </button>
        </div>

        {mobileOpen && (
          <div className={styles.mobileMenu}>
            {["Product","Workflows","Integrations","Pricing"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className={styles.mobileMenuLink} onClick={() => setMobileOpen(false)}>{l}</a>
            ))}
            <hr className={styles.mobileDivider} />
            <a href="/login" className={styles.mobileMenuLink}>Log in</a>
            <a href="/dashboard" className={styles.mobileMenuCta}>Get early access</a>
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
            <div className={styles.heroBadge}>
              <img src="/robot-mascot.png" alt="Amira Mascot" style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
              <span>Version 2.0 — Now in Early Access</span>
            </div>

            <h1 className={styles.heroH1}>
              Your AI Operator<br />
              for <span className={styles.heroAccent}>Work.</span>
            </h1>

            <p className={styles.heroSub}>
              Amira quietly coordinates your work across every tool you use—so you can focus on the{" "}
              <span className={styles.heroSubEm}>decisions that matter.</span>
            </p>

            <div className={styles.heroCtas}>
              <a href="/dashboard" className={styles.btnPrimary}>
                Get early access
                <ArrowRight size={16} />
              </a>
              <button className={styles.btnSecondary}>
                <Play size={13} />
                Watch 30s demo
              </button>
            </div>

            <div className={styles.heroTrust}>
              <span className={styles.heroTrustLabel}>Works with 1000+ tools</span>
              <div className={styles.heroTrustLogos}>
                {["N","S","G","H","⚡","Li"].map((t, i) => (
                  <div key={i} className={styles.heroTrustLogo}>{t}</div>
                ))}
                <span className={styles.heroTrustMore}>+ more</span>
              </div>
            </div>
          </div>

          {/* right — dashboard */}
          <div className={styles.heroRight}>
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* ── TRUST LOGOS ──────────────────────────────────────────────────────── */}
      <section className={styles.trustSection}>
        <p className={styles.trustLabel}>Trusted by modern teams at</p>
        <div className={styles.trustRow}>
          {trustLogos.map(l => <span key={l} className={styles.trustLogo}>{l}</span>)}
        </div>
      </section>

      {/* ── WHAT AMIRA IS / ISN'T ─────────────────────────────────────────── */}
      <section className={styles.section} style={{ background: "var(--surface-subtle)" }}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>PRODUCT POSITIONING</span>
            <h2 className={styles.sectionTitle}>Not another chatbot.</h2>
            <p className={styles.sectionSub}>Amira is built on a fundamentally different premise: delegate outcomes, not tasks.</p>
          </div>

          <div className={styles.positioningGrid}>
            {/* What Amira IS */}
            <div className={styles.positioningCard} style={{ borderColor: "rgba(27,90,146,0.2)", background: "#f5f3ff" }}>
              <div className={styles.posCardLabel} style={{ color: "#1b5a92" }}>✓ What Amira is</div>
              {[
                { icon: "🧠", text: "Plans work end-to-end" },
                { icon: "⚡", text: "Executes across your tools" },
                { icon: "🔗", text: "Coordinates tool-to-tool" },
                { icon: "🎯", text: "Protects your focus" },
                { icon: "🛡️", text: "Escalates only when your judgment is needed" },
              ].map(item => (
                <div key={item.text} className={styles.posItem}>
                  <span className={styles.posItemIcon}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* What Amira ISN'T */}
            <div className={styles.positioningCard} style={{ borderColor: "rgba(0,0,0,0.06)", background: "#f8f9fc" }}>
              <div className={styles.posCardLabel} style={{ color: "#9299ab" }}>✕ What Amira isn't</div>
              {[
                "Another chatbot",
                "Another note taker",
                "Another workflow builder",
                "Another automation platform",
                "Another project manager",
              ].map(item => (
                <div key={item} className={styles.posItemNot}>
                  <X size={13} style={{ color: "#d1d5db", flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW GALLERY ──────────────────────────────────────────────────── */}
      <section className={styles.section} id="workflows">
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>WORKFLOWS THAT JUST WORK</span>
            <h2 className={styles.sectionTitle}>Outcomes, not tasks.</h2>
            <p className={styles.sectionSub}>Amira executes complete workflows across your tools — planning, executing, and only asking for your judgment when it matters.</p>
          </div>

          <div className={styles.wfGrid}>
            {workflowCards.map((card, i) => (
              <WorkflowCard key={card.id} card={card} initialStateIndex={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MORNING VISION ───────────────────────────────────────────────────── */}
      <section className={styles.visionSection}>
        <div className={styles.visionBg} aria-hidden="true">
          <div className={styles.visionGlow} />
        </div>
        <div className={styles.visionInner}>
          <div className={styles.visionEyebrow}>THE LONG-TERM VISION</div>
          <h2 className={styles.visionTitle}>They barely notice it.</h2>
          <p className={styles.visionSub}>The end state isn't that people spend all day inside Amira.</p>

          <div className={styles.visionCard}>
            <div className={styles.visionCardHeader}>
              <AmiraIcon size={16} />
              <span>Amira</span>
              <span className={styles.visionCardTime}>7:02 AM</span>
            </div>
            <div className={styles.visionMsg}>
              Good morning.
            </div>
            <div className={styles.visionMsg}>
              I&apos;ve completed <strong style={{ color: "#10b981" }}>12 pieces of work</strong> overnight.
            </div>
            <div className={styles.visionMsg}>
              I need your judgment on <strong style={{ color: "#1b5a92" }}>2 decisions.</strong>
            </div>
            <div className={styles.visionMsg} style={{ opacity: 0.7 }}>
              Everything else is under control.
            </div>
          </div>

          <p className={styles.visionFootnote}>
            Not another AI chat interface. Not another dashboard.<br />
            <strong>An operating layer for modern work.</strong>
          </p>
        </div>
      </section>

      {/* ── HOW AMIRA WORKS ──────────────────────────────────────────────────── */}
      <section className={styles.section} id="integrations">
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>HOW AMIRA WORKS</span>
            <h2 className={styles.sectionTitle}>Simple for you. Powerful underneath.</h2>
          </div>

          <div className={styles.stepsRow}>
            {[
              { num: "01", icon: "💬", title: "Tell Amira the outcome", desc: "Type what needs to happen in plain language. \"Prepare board meeting.\" \"Hire a designer.\" \"Renew this customer.\"" },
              { num: "02", icon: "🧠", title: "Amira plans & reasons", desc: "The Planner breaks it into steps. Memory pulls relevant context. Reasoning selects the right tools and approach." },
              { num: "03", icon: "⚡", title: "Execution happens", desc: "Amira executes across your connected tools — Slack, Notion, HubSpot, GitHub, Stripe and 1000+ more." },
              { num: "04", icon: "🎯", title: "You decide what matters", desc: "Amira only surfaces your judgment when it's truly needed. Review, approve, or reject. Everything else? Handled." },
            ].map((step, i) => (
              <div key={step.num} className={styles.stepCard}>
                {i < 3 && <div className={styles.stepConnector} />}
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDesc}>{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Integration logos */}
          <div className={styles.integrationsRow}>
            <p className={styles.integrationsLabel}>Connects to your entire stack</p>
            <div className={styles.integrationsList}>
              {["Slack","Google Workspace","Microsoft 365","Notion","HubSpot","GitHub","Linear","Jira","Stripe","QuickBooks","Zoom","Salesforce","1000+ Integrations"].map(t => (
                <span key={t} className={styles.integrationTag}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DECISION CARD SHOWCASE ────────────────────────────────────────────── */}
      <section className={styles.section} style={{ background: "var(--surface-subtle)" }}>
        <div className={styles.inner}>
          <div className={styles.decisionShowcase}>
            <div className={styles.decisionShowcaseLeft}>
              <span className={styles.eyebrow}>YOUR DECISIONS SCREEN</span>
              <h2 className={styles.sectionTitle} style={{ textAlign: "left" }}>Every decision, with full context.</h2>
              <p className={styles.sectionSub} style={{ textAlign: "left" }}>
                Amira doesn't send notifications. It builds you a decisions queue — every item with context, risk, recommendation, and confidence score.
              </p>
              <div className={styles.decisionFeatureList}>
                {["Title & context", "AI recommendation", "Confidence score", "Risk & business impact", "Supporting documents", "Ask Amira anything"].map(f => (
                  <div key={f} className={styles.decisionFeatureItem}>
                    <Check size={14} style={{ color: "#1b5a92", flexShrink: 0 }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.decisionShowcaseRight}>
              {/* Decision card mockup */}
              <div className={styles.decisionCardMockup}>
                <div className={styles.dcmHeader}>
                  <span className={styles.dcmTitle}>Review Contract</span>
                  <span className={styles.dcmUrgent}>Needs Decision</span>
                </div>
                <div className={styles.dcmRows}>
                  <div className={styles.dcmRow}><span>Customer</span><strong>Acme Corp</strong></div>
                  <div className={styles.dcmRow}><span>Value</span><strong style={{ color: "#10b981" }}>$140K ARR</strong></div>
                  <div className={styles.dcmRow}><span>Risk</span><strong style={{ color: "#10b981" }}>Low</strong></div>
                  <div className={styles.dcmRow}><span>Approver</span><strong>Richmond (you)</strong></div>
                </div>
                <div className={styles.dcmRec}>
                  <div className={styles.dcmRecHeader}>
                    <AmiraIcon size={13} />
                    <span>Recommendation</span>
                    <span className={styles.dcmConf}>96% confidence</span>
                  </div>
                  <p>Approve. Matches legal policy. No unusual clauses. Payment terms are standard 30-day net.</p>
                </div>
                <div className={styles.dcmAsk}>
                  <AmiraIcon size={12} />
                  <span>Ask Amira anything about this contract...</span>
                </div>
                <div className={styles.dcmActions}>
                  <button className={styles.dcmApprove}><Check size={13} /> Approve</button>
                  <button className={styles.dcmReject}><X size={13} /> Reject</button>
                  <button className={styles.dcmDefer}>Defer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>HOW WE COMPARE</span>
            <h2 className={styles.sectionTitle}>Built different, by design.</h2>
            <p className={styles.sectionSub}>Every other tool asks you to do more. Amira does the work.</p>
          </div>

          <div className={styles.compareTable}>
            <div className={styles.compareHeader}>
              <div className={styles.compareHeaderCell} />
              {amiraFeatures.map(f => (
                <div key={f} className={styles.compareHeaderCell} style={{ color: "#1b5a92", fontWeight: 700, fontSize: 12 }}>{f}</div>
              ))}
            </div>

            {/* Amira row */}
            <div className={`${styles.compareRow} ${styles.compareRowAmira}`}>
              <div className={styles.compareCell}>
                <div className={styles.compareProductName}>
                  <AmiraIcon size={16} />
                  <strong>Amira</strong>
                </div>
              </div>
              {amiraFeatures.map(f => (
                <div key={f} className={styles.compareCell}>
                  <div className={styles.compareTick} style={{ background: "#1b5a9220", color: "#1b5a92" }}>
                    <Check size={13} />
                  </div>
                </div>
              ))}
            </div>

            {comparisons.map((comp, ci) => (
              <div key={comp.category} className={styles.compareRow}>
                <div className={styles.compareCell}>
                  <span className={styles.compareCategory}>{comp.category}</span>
                </div>
                {comp.features.map((feat, fi) => {
                  const hasIt = amiraFeatures[fi] && !feat.startsWith("No ") && !feat.startsWith("You ");
                  return (
                    <div key={fi} className={styles.compareCell}>
                      <div className={`${styles.compareTick} ${hasIt ? styles.compareTickYes : styles.compareTickNo}`}>
                        {hasIt ? <Check size={11} /> : <X size={11} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section className={styles.section} id="pricing" style={{ background: "var(--surface-subtle)" }}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>PRICING</span>
            <h2 className={styles.sectionTitle}>Start free. Scale when ready.</h2>
            <p className={styles.sectionSub}>Every plan includes unlimited commands and a 14-day free trial.</p>
          </div>

          <div className={styles.pricingGrid}>
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${plan.highlight ? styles.pricingCardHighlight : ""}`}
              >
                {plan.highlight && <div className={styles.pricingBadge}>Most popular</div>}
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  <span className={styles.planPriceVal}>{plan.price}</span>
                  {plan.period && <span className={styles.planPricePeriod}>{plan.period}</span>}
                </div>
                <p className={styles.planDesc}>{plan.desc}</p>
                <ul className={styles.planFeatures}>
                  {plan.features.map(f => (
                    <li key={f} className={styles.planFeatureItem}>
                      <Check size={13} style={{ color: plan.highlight ? "#ffffff" : "#1b5a92", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="/dashboard" className={`${styles.planCta} ${plan.highlight ? styles.planCtaHighlight : styles.planCtaOutline}`}>
                  {plan.cta} <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Loved by teams who get things done</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map(t => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" stroke="none" />
                  ))}
                </div>
                <p className={styles.testimonialQuote}>{t.quote}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.name[0]}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} aria-hidden="true" />
        <div className={styles.ctaInner}>
          <div className={styles.ctaEyebrow}>
            <AmiraIcon size={16} />
            <span>Early access — limited spots</span>
          </div>
          <h2 className={styles.ctaTitle}>Be the first to run on Amira.</h2>
          <p className={styles.ctaSub}>Join founders, operators, and teams who are replacing manual work with outcomes.</p>
          <form
            className={styles.ctaForm}
            onSubmit={e => { e.preventDefault(); window.location.href = "/dashboard"; }}
          >
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.ctaInput}
              required
            />
            <button type="submit" className={styles.ctaSubmitBtn}>
              Get early access <ArrowRight size={15} />
            </button>
          </form>
          <p className={styles.ctaNote}>No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogoRow}>
              <img src="/amira-logo-footer.svg" alt="Amira" style={{ height: '26px', width: 'auto' }} />
            </div>
            <p className={styles.footerDesc}>Your AI Operator for Work. Delegate outcomes, not tasks.</p>
          </div>
          {[
            { heading: "Product", links: ["Workflows", "Integrations", "Pricing", "Changelog", "Roadmap"] },
            { heading: "Company", links: ["About", "Blog", "Careers", "Security", "Contact"] },
            { heading: "Resources", links: ["Documentation", "Community", "Templates", "Status"] },
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
