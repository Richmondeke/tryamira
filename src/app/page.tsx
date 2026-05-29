"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState<"monthly" | "annually">("monthly");

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#CCCCCC", fontFamily: "var(--font-poppins), sans-serif" }}>
      {/* GLOW BACKGROUND EFFECT */}
      <div className={styles.heroGlow} />

      {/* NAVIGATION */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <img src="/images/amira-logo.png" alt="Amira Logo" className={styles.navLogoImg} />
          <span className={styles.navLogoText}>Amira</span>
        </Link>
        
        <ul className={styles.navLinks}>
          <li><a href="#features" className={styles.navLink}>Features</a></li>
          <li><a href="#how-it-works" className={styles.navLink}>How It Works</a></li>
          <li><a href="#demo" className={styles.navLink}>Interactive Demo</a></li>
          <li><a href="#pricing" className={styles.navLink}>Pricing</a></li>
          <li><a href="#testimonials" className={styles.navLink}>Testimonials</a></li>
        </ul>

        <div className={styles.navActions}>
          <Link href="/login" className={styles.navSignIn}>Sign In</Link>
          <Link href="/signup" className={styles.navCta}>Start Free</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeNew}>New</span>
          <span className={styles.heroBadgeText}>Amira voice model v2.1 is now live</span>
        </div>

        <h1 className={styles.heroTitle}>
          <span className={styles.heroTitleGradient}>Your A.I Powered</span>
          <br />
          <span style={{ color: "#0052CC" }}>Call Center</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Amira does the work of 1,000 Call Center Agents, answering calls like a real human. Fully automated, 24/7 inbound & outbound voice operations at a fraction of the cost.
        </p>

        <div className={styles.heroCtas}>
          <a href="#demo" className={styles.heroCtaPrimary}>
            Try Amira Live
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <Link href="/signup" className={styles.heroCtaSecondary}>
            Get Started Free
          </Link>
        </div>

        {/* Dashboard Preview Image Container */}
        <div className={styles.heroImage}>
          <div className={styles.heroImageInner}>
            <img src="/images/dashboard-preview.png" alt="Amira CRM Dashboard Layout" />
          </div>
        </div>
      </section>

      {/* TRUSTED BY LOGOS */}
      <section className={styles.trusted}>
        <p className={styles.trustedLabel}>Trusted by top innovative teams worldwide</p>
        <div className={styles.trustedLogos}>
          <span className={styles.trustedLogo}>TechStars</span>
          <span className={styles.trustedLogo}>Y-Combinator</span>
          <span className={styles.trustedLogo}>Zenith Inc.</span>
          <span className={styles.trustedLogo}>Apex Group</span>
          <span className={styles.trustedLogo}>ScaleFlow</span>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>Average CSAT Rating</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>&lt;$0.10</div>
            <div className={styles.statLabel}>Cost Per Call Minute</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Inbound/Outbound Availability</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>0s</div>
            <div className={styles.statLabel}>Customer Hold Time</div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresHeader}>
          <span className={styles.sectionTag}>Core Capabilities</span>
          <h2 className={styles.sectionTitle}>Everything You Need to Scale Support</h2>
          <p className={styles.sectionSubtitle}>
            Supercharge your telecommunications and customer service. Amira combines human clarity with AI power.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📞</div>
            <h3 className={styles.featureTitle}>Human-like Conversations</h3>
            <p className={styles.featureDesc}>
              Advanced text-to-speech synthesis and latency management make Amira indistinguishable from a seasoned human operator.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧠</div>
            <h3 className={styles.featureTitle}>Instant Knowledge Access</h3>
            <p className={styles.featureDesc}>
              Upload your company documents, PDFs, or site FAQs. Amira masters all your parameters and business voice instantly.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Sub-500ms Response Times</h3>
            <p className={styles.featureDesc}>
              Ultra-fast processing architectures remove awkward AI pauses, guaranteeing high-velocity, fluent conversations.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Unified CRM Sync</h3>
            <p className={styles.featureDesc}>
              Every call transcription, summary, and client sentiment analysis maps directly into your CRM database dashboard.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3 className={styles.featureTitle}>Smart Human Escalation</h3>
            <p className={styles.featureDesc}>
              When a complex call requires manual override, Amira gracefully transfers the line along with the live logs.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3 className={styles.featureTitle}>Unlimited Scaling</h3>
            <p className={styles.featureDesc}>
              Say goodbye to hiring queues. Handle 10,000 phone calls simultaneously without losing an ounce of quality.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.howItWorksHeader}>
          <span className={styles.sectionTag}>Easy Setup</span>
          <h2 className={styles.sectionTitle}>Get Started in Under 5 Minutes</h2>
          <p className={styles.sectionSubtitle}>
            No code templates. No engineering overhead. Just define your scope and let Amira handle the rest.
          </p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Train Your Agent</h3>
              <p className={styles.stepDesc}>
                Define Amira's prompt instructions and upload documents. Feed her with custom business guidelines so she knows exactly what to pitch or troubleshoot.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Connect Your Phone System</h3>
              <p className={styles.stepDesc}>
                Instantly provision premium local or international telephone lines, or securely bridge your existing business numbers to Amira.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Go Live & Automate</h3>
              <p className={styles.stepDesc}>
                Watch Amira make/receive calls, answer queries, capture details, and populate your dashboard. Set custom rules for automated outbound text notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CALL SHOWCASE SECTION */}
      <section id="demo" className={styles.showcase}>
        <div className={styles.showcaseHeader}>
          <span className={styles.sectionTag}>Live Playground</span>
          <h2 className={styles.sectionTitle}>Talk to Amira Right Now</h2>
          <p className={styles.sectionSubtitle}>
            Give her a quick call or request an outbound line. Experience firsthand the revolutionary latency and human-grade voice response model.
          </p>
        </div>
        <div className={styles.showcaseImage} style={{ background: "#111", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px" }}>
          <iframe 
            src="https://amira-call-demo.vercel.app/" 
            style={{ width: "100%", height: "600px", border: "none", borderRadius: "16px", background: "#0d0d0d" }} 
            title="Amira Interactive Call Demo Playground"
            allow="microphone"
          />
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.pricingHeader}>
          <span className={styles.sectionTag}>Transparent Plans</span>
          <h2 className={styles.sectionTitle}>Scale at Your Own Pace</h2>
          <p className={styles.sectionSubtitle}>
            Choose a plan that matches your current call volume. Start with absolute flexibility and upgrade anytime.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {/* STARTER */}
          <div className={styles.pricingCard}>
            <h3 className={styles.pricingPlanName}>Starter</h3>
            <p className={styles.pricingPlanDesc}>Perfect for solo operators and small projects testing out AI voice support.</p>
            <div className={styles.pricingPrice}>
              $49<span className={styles.pricingPriceUnit}>/mo</span>
            </div>
            <p className={styles.pricingPeriod}>Billed monthly</p>
            
            <ul className={styles.pricingFeatures}>
              <li className={styles.pricingFeature}>500 call minutes included</li>
              <li className={styles.pricingFeature}>1 custom AI phone line</li>
              <li className={styles.pricingFeature}>Knowledge base training (up to 5MB)</li>
              <li className={styles.pricingFeature}>Basic dashboard logs & analytics</li>
              <li className={styles.pricingFeature}>Webhooks & email support</li>
            </ul>

            <Link href="/signup" className={`${styles.pricingCta} ${styles.pricingCtaOutline}`}>
              Start Starter Free
            </Link>
          </div>

          {/* PROFESSIONAL */}
          <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
            <div className={styles.pricingPopularBadge}>Most Popular</div>
            <h3 className={styles.pricingPlanName}>Professional</h3>
            <p className={styles.pricingPlanDesc}>Ideal for growing organizations automating medium to high support volume.</p>
            <div className={styles.pricingPrice}>
              $199<span className={styles.pricingPriceUnit}>/mo</span>
            </div>
            <p className={styles.pricingPeriod}>Billed monthly</p>
            
            <ul className={styles.pricingFeatures}>
              <li className={styles.pricingFeature}>3,000 call minutes included</li>
              <li className={styles.pricingFeature}>5 custom AI phone lines</li>
              <li className={styles.pricingFeature}>Unlimited document training space</li>
              <li className={styles.pricingFeature}>Smart human handoff & escalation</li>
              <li className={styles.pricingFeature}>Advanced dashboard analytics & CRM integrations</li>
              <li className={styles.pricingFeature}>Priority customer support</li>
            </ul>

            <Link href="/signup" className={`${styles.pricingCta} ${styles.pricingCtaPrimary}`}>
              Go Professional
            </Link>
          </div>

          {/* ENTERPRISE */}
          <div className={styles.pricingCard}>
            <h3 className={styles.pricingPlanName}>Enterprise</h3>
            <p className={styles.pricingPlanDesc}>Built for high-scale call centers requiring advanced reliability and security.</p>
            <div className={styles.pricingPrice}>
              Custom
            </div>
            <p className={styles.pricingPeriod}>Tailored options available</p>
            
            <ul className={styles.pricingFeatures}>
              <li className={styles.pricingFeature}>Unlimited custom call minutes</li>
              <li className={styles.pricingFeature}>Dedicated infrastructure (SLA guaranteed)</li>
              <li className={styles.pricingFeature}>Custom voice model fine-tuning</li>
              <li className={styles.pricingFeature}>Advanced API gateways & webhook configs</li>
              <li className={styles.pricingFeature}>HIPAA & enterprise compliance</li>
              <li className={styles.pricingFeature}>Dedicated account manager & 24/7 phone support</li>
            </ul>

            <Link href="/signup" className={`${styles.pricingCta} ${styles.pricingCtaOutline}`}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.testimonialsHeader}>
          <span className={styles.sectionTag}>Testimonials</span>
          <h2 className={styles.sectionTitle}>Validated by Leading Teams</h2>
          <p className={styles.sectionSubtitle}>
            Hear from industry leaders who retired traditional answering machines and scaled with Amira.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialText}>
              "Amira took over our after-hours customer service line. We went from losing 40% of our evening inquiries to capturing and resolving every single phone call. Our revenue grew 35% in just two months!"
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>SJ</div>
              <div>
                <h4 className={styles.testimonialName}>Sarah Jenkins</h4>
                <p className={styles.testimonialRole}>Operations Lead, ScaleFlow</p>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialText}>
              "Answering outbound calls is exhausting. With Amira, we deployed an outbound agent that qualifies 500 leads per day. The voice quality is so perfect that most customers don't even realize she's an AI."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>MK</div>
              <div>
                <h4 className={styles.testimonialName}>Marcus Kincaid</h4>
                <p className={styles.testimonialRole}>VP of Sales, Zenith Inc.</p>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialText}>
              "Setting up Amira took less than 15 minutes. It integrates perfectly with our internal systems, updating customer tickets in Zendesk and Slack instantly. Highly recommended."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>DR</div>
              <div>
                <h4 className={styles.testimonialName}>Daniel Ryan</h4>
                <p className={styles.testimonialRole}>Co-Founder, Apex Group</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerGlow} />
        <div className={styles.ctaBannerContent}>
          <h2 className={styles.ctaBannerTitle}>Ready to Automate Your Support?</h2>
          <p className={styles.ctaBannerDesc}>
            Join thousands of modern businesses saving time, scaling phone channels, and driving high-converting outbound operations with Amira.
          </p>
          <Link href="/signup" className={styles.navCta} style={{ display: "inline-block", fontSize: "1rem", padding: "0.875rem 2rem" }}>
            Get Started Free Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerBrandName}>
              <img src="/images/amira-logo.png" alt="Amira Footer Logo" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
              Amira
            </div>
            <p className={styles.footerBrandDesc}>
              The premium A.I-powered call center that scales customer support, qualifiers outbound campaigns, and automates revenue on autopilot.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><a href="#demo">Live Demo</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Contact Support</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">DPA & GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.footerCopy}>&copy; {new Date().getFullYear()} Amira Technologies Inc. All rights reserved.</span>
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
