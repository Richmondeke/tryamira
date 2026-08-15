'use client';

import React, { useState } from 'react';
import { GlowIcon } from '@/components/ui/GlowIcon';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function V3AnalyticsPage() {
  const { isDemoMode } = useDemoMode();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'voice' | 'chat' | 'whatsapp'>('all');

  const metrics = [
    {
      title: 'Total Conversations',
      value: isDemoMode ? '2,489' : '0',
      change: '+18.4% vs last period',
      isPositive: true,
      icon: 'message-square-outline',
      accent: '#10b981'
    },
    {
      title: 'Resolution Rate',
      value: isDemoMode ? '94.8%' : '0.0%',
      change: '+4.2% automated resolution',
      isPositive: true,
      icon: 'checkmark-circle-outline',
      accent: '#10b981'
    },
    {
      title: 'Avg Call Duration',
      value: isDemoMode ? '2m 14s' : '0m 0s',
      change: '-18s response time',
      isPositive: true,
      icon: 'clock-outline',
      accent: '#3b82f6'
    },
    {
      title: 'Customer CSAT Score',
      value: isDemoMode ? '4.9 / 5.0' : '0.0',
      change: 'Based on 1,840 ratings',
      isPositive: true,
      icon: 'star-outline',
      accent: '#f59e0b'
    },
    {
      title: 'Total Cost Saved',
      value: isDemoMode ? '$14,820' : '$0',
      change: '~184 human hours saved',
      isPositive: true,
      icon: 'credit-card-outline',
      accent: '#8b5cf6'
    }
  ];

  const topics = [
    { name: 'Order & Shipping Status', count: '842 inquiries', percentage: 34, color: '#10b981' },
    { name: 'Product & Pricing Inquiry', count: '512 inquiries', percentage: 21, color: '#3b82f6' },
    { name: 'Account & Password Reset', count: '390 inquiries', percentage: 16, color: '#8b5cf6' },
    { name: 'Technical Troubleshooting', count: '298 inquiries', percentage: 12, color: '#f59e0b' },
    { name: 'Billing & Refund Requests', count: '247 inquiries', percentage: 10, color: '#ec4899' },
    { name: 'Other Custom Workflows', count: '200 inquiries', percentage: 7, color: '#64748b' }
  ];

  const agentLeaderboard = [
    { name: 'Amira Support Pro', calls: '1,240 calls', csat: '4.95', resolution: '96.2%', status: 'Active' },
    { name: 'Sales Qualifier AI', calls: '780 calls', csat: '4.88', resolution: '92.4%', status: 'Active' },
    { name: 'Technical Specialist AI', calls: '469 calls', csat: '4.91', resolution: '94.0%', status: 'Active' }
  ];

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Analytics & Call Intelligence</h1>
            <span style={{ fontSize: '11px', fontWeight: 750, padding: '3px 10px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#10b981', border: '1px solid #10b98130' }}>
              Real-time Insights
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Monitor call volume trends, customer sentiment, agent resolution rates, and ROI metrics.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Channel selector */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle, #f1f5f9)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            {[
              { id: 'all', label: 'All Channels' },
              { id: 'voice', label: 'Voice' },
              { id: 'chat', label: 'Webchat' },
              { id: 'whatsapp', label: 'WhatsApp' }
            ].map(ch => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id as any)}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '12px',
                  fontWeight: selectedChannel === ch.id ? 750 : 500,
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedChannel === ch.id ? '#ffffff' : 'transparent',
                  color: selectedChannel === ch.id ? '#0f172a' : '#64748b',
                  boxShadow: selectedChannel === ch.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Time range selector */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle, #f1f5f9)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            {[
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: '90d', label: 'Last 90 Days' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '12px',
                  fontWeight: timeRange === t.id ? 750 : 500,
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: timeRange === t.id ? '#ffffff' : 'transparent',
                  color: timeRange === t.id ? '#0f172a' : '#64748b',
                  boxShadow: timeRange === t.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Export Report */}
          <button
            onClick={() => alert("Downloading Analytics Report (PDF)...")}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 750,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <GlowIcon name="export-outline" size={14} color="#ffffff" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ── KPI METRICS CARDS ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {metrics.map(m => (
          <div key={m.title} style={{
            backgroundColor: 'var(--bg-card, #ffffff)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.title}</span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                backgroundColor: `${m.accent}15`, border: `1px solid ${m.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <GlowIcon name={m.icon} size={18} color={m.accent} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 650, color: m.isPositive ? '#10b981' : '#ef4444', marginTop: '0.25rem' }}>
                {m.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS & INTENT BREAKDOWN ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        
        {/* Call Volume Trend Graph Box */}
        <div style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>Conversation Volume Trends</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>Daily volume over the past 7 days</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 750, color: '#10b981', backgroundColor: '#f0fdf4', padding: '0.25rem 0.65rem', borderRadius: '99px', border: '1px solid #bbf7d0' }}>
              ● Live Sync
            </span>
          </div>

          {/* Bar Graph Simulation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1rem', borderBottom: '1px solid var(--border-subtle)', gap: '0.75rem' }}>
            {[
              { day: 'Mon', count: 320, height: '65%' },
              { day: 'Tue', count: 410, height: '82%' },
              { day: 'Wed', count: 380, height: '76%' },
              { day: 'Thu', count: 490, height: '98%' },
              { day: 'Fri', count: 440, height: '88%' },
              { day: 'Sat', count: 210, height: '42%' },
              { day: 'Sun', count: 239, height: '48%' }
            ].map(bar => (
              <div key={bar.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{isDemoMode ? bar.count : 0}</span>
                <div style={{
                  width: '100%',
                  maxWidth: '32px',
                  height: isDemoMode ? bar.height : '4px',
                  backgroundColor: '#10b981',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }} />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>{bar.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            <span>Peak Hour: <strong>2:00 PM - 4:00 PM EST</strong></span>
            <span>Avg Response Time: <strong>1.2 sec</strong></span>
          </div>
        </div>

        {/* Customer Intent & Topic Distribution */}
        <div style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 750, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>Top Customer Topics & Intents</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>Automated classification of customer inquiries</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topics.map(t => (
              <div key={t.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 650, color: 'var(--text-primary)' }}>
                  <span>{t.name}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{isDemoMode ? t.count : '0 inquiries'} ({isDemoMode ? `${t.percentage}%` : '0%'})</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle, #f1f5f9)', overflow: 'hidden' }}>
                  <div style={{
                    width: isDemoMode ? `${t.percentage}%` : '0%',
                    height: '100%',
                    backgroundColor: t.color,
                    borderRadius: '99px',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── AGENT PERFORMANCE LEADERBOARD ────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>Active AI Agent Performance</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>Individual workforce productivity metrics</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>AI Agent</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Calls</th>
                <th style={{ padding: '0.75rem 1rem' }}>CSAT Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Resolution Rate</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {agentLeaderboard.map((ag, i) => (
                <tr key={ag.name} style={{ borderBottom: i < agentLeaderboard.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 750, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img src="/amira-head.png" alt="Amira Agent" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                      <span>{ag.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{isDemoMode ? ag.calls : '0 calls'}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#f59e0b', fontWeight: 750 }}>⭐ {isDemoMode ? ag.csat : '0.0'}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#10b981', fontWeight: 750 }}>{isDemoMode ? ag.resolution : '0.0%'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 750, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#f0fdf4', color: '#047857', border: '1px solid #bbf7d0' }}>
                      ● {ag.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
