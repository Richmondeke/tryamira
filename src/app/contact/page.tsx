'use client';

import { useState } from 'react';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '', type: 'Sales Inquiry' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteNavbar />

      <section style={{ backgroundColor: '#1b5a92', color: '#ffffff', padding: '7.5rem 1.5rem 4.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, margin: '0 0 1rem 0' }}>Get in Touch with Amira AI</h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            Have questions about enterprise custom AI agent deployments, telephony pricing, or voice integrations? We're here to help.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '3.5rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Contact Form */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Message Sent!</h3>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
                  Thank you for reaching out. An Amira specialist will get back to you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Send Us a Message</h3>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Inquiry Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', outline: 'none' }}
                  >
                    <option>Sales & Enterprise Plan Inquiry</option>
                    <option>Technical & Telephony Support</option>
                    <option>Partnership & Channel Integrations</option>
                    <option>Press & Analyst Relations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Company Name</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>How can we help?</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your call volume, channels, or custom AI agent requirements..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, border: 'none', fontSize: '15px', cursor: 'pointer' }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Offices & Direct Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1b5a92', margin: '0 0 1rem 0' }}>Global Office Hubs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 750, color: '#0d0f1a', fontSize: '15px' }}>📍 San Francisco (HQ)</div>
                  <div style={{ fontSize: '13.5px', color: '#64748b', marginTop: '0.2rem' }}>500 Howard Street, Suite 400<br />San Francisco, CA 94105</div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 750, color: '#0d0f1a', fontSize: '15px' }}>📍 London Hub</div>
                  <div style={{ fontSize: '13.5px', color: '#64748b', marginTop: '0.2rem' }}>30 St Mary Axe, Floor 18<br />London, EC3A 8EP, United Kingdom</div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1b5a92', margin: '0 0 1rem 0' }}>Direct Contacts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '14px', color: '#475569' }}>
                <div><strong>Sales:</strong> sales@heyamira.com</div>
                <div><strong>Support:</strong> support@heyamira.com</div>
                <div><strong>Security & Privacy:</strong> security@heyamira.com</div>
                <div><strong>Phone Support:</strong> +1 (415) 263-3600</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
