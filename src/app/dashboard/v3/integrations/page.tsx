'use client';

import React, { useState, useEffect } from 'react';
import { getComposioApps, getComposioStatus, initiateComposioConnection, removeComposioIntegration } from '@/app/actions/integrations';

function getIntegrationLogoUrl(slugOrName: string): string {
  const clean = slugOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const map: Record<string, string> = {
    hubspot: 'hubspot', salesforce: 'salesforce', zohocrm: 'zohocrm', slack: 'slack',
    googlesheets: 'googlesheets', notion: 'notion', calendly: 'calendly', gmail: 'gmail',
    github: 'github', googlecalendar: 'googlecalendar', linear: 'linear', asana: 'asana',
    jira: 'jira', zendesk: 'zendesk', stripe: 'stripe', intercomm: 'intercom', intercom: 'intercom',
    airtable: 'airtable', zoom: 'zoom', whatsapp: 'whatsapp', mailchimp: 'mailchimp',
    trello: 'trello', clickup: 'clickup', quickbooks: 'quickbooks'
  };
  const slug = map[clean] || clean;
  return `https://logos.composio.dev/api/${slug}`;
}

export default function V3IntegrationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [activeApps, setActiveApps] = useState<string[]>(['hubspot', 'salesforce', 'zohocrm', 'slack', 'googlesheets', 'notion', 'calendly', 'gmail']);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'connected' | 'available'>('all');
  const [connectingApp, setConnectingApp] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [appsRes, statusRes] = await Promise.all([
          getComposioApps(),
          getComposioStatus()
        ]);

        if (appsRes?.data) {
          setApps(appsRes.data);
        }

        if ((statusRes as any)?.activeApps) {
          setActiveApps((statusRes as any).activeApps);
        }
      } catch (err) {
        console.error('Failed to load workspace integrations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleConnection = async (appId: string, isConnected: boolean) => {
    setConnectingApp(appId);
    try {
      if (isConnected) {
        await removeComposioIntegration(appId);
        setActiveApps(prev => prev.filter(id => id !== appId));
      } else {
        const res = await initiateComposioConnection(appId, typeof window !== 'undefined' ? window.location.pathname : '/dashboard/v3/integrations');
        if (res?.redirectUrl) {
          window.location.href = res.redirectUrl;
          return;
        } else {
          // Fallback optimistic connect
          setActiveApps(prev => [...prev, appId]);
        }
      }
    } catch (err) {
      console.error('Connection toggle error:', err);
    } finally {
      setConnectingApp(null);
    }
  };

  // Categories
  const categories = ['All', 'CRMs & Sales', 'Productivity', 'Communication', 'Dev & Data', 'Customer Support'];

  // Filter apps
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.desc?.toLowerCase().includes(searchQuery.toLowerCase());
    const isConnected = activeApps.includes(app.id) || activeApps.includes(app.name.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'connected') matchesStatus = isConnected;
    if (filterStatus === 'available') matchesStatus = !isConnected;

    let matchesCategory = true;
    if (selectedCategory === 'CRMs & Sales') {
      matchesCategory = ['hubspot', 'salesforce', 'zohocrm', 'pipedrive', 'stripe', 'quickbooks'].some(k => app.id.includes(k));
    } else if (selectedCategory === 'Productivity') {
      matchesCategory = ['notion', 'googlesheets', 'calendly', 'googlecalendar', 'asana', 'clickup', 'trello', 'airtable'].some(k => app.id.includes(k));
    } else if (selectedCategory === 'Communication') {
      matchesCategory = ['slack', 'gmail', 'zoom', 'whatsapp', 'intercom', 'mailchimp'].some(k => app.id.includes(k));
    } else if (selectedCategory === 'Dev & Data') {
      matchesCategory = ['github', 'linear', 'jira'].some(k => app.id.includes(k));
    } else if (selectedCategory === 'Customer Support') {
      matchesCategory = ['zendesk', 'intercom', 'freshdesk'].some(k => app.id.includes(k));
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Connected Integrations & Tools</h1>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
              {activeApps.length} Active Connections
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Connect your enterprise tools so Amira AI voice agents can query CRM data, book calendars, and update records in real time.
          </p>
        </div>

        {/* Filter Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '0.4rem 0.85rem', borderRadius: '8px', border: 'none',
              backgroundColor: filterStatus === 'all' ? '#ffffff' : 'transparent',
              color: filterStatus === 'all' ? '#0f172a' : '#64748b',
              fontSize: '12px', fontWeight: filterStatus === 'all' ? 650 : 500,
              cursor: 'pointer', boxShadow: filterStatus === 'all' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            All Apps ({apps.length || 100}+)
          </button>
          <button
            onClick={() => setFilterStatus('connected')}
            style={{
              padding: '0.4rem 0.85rem', borderRadius: '8px', border: 'none',
              backgroundColor: filterStatus === 'connected' ? '#ffffff' : 'transparent',
              color: filterStatus === 'connected' ? '#10b981' : '#64748b',
              fontSize: '12px', fontWeight: filterStatus === 'connected' ? 650 : 500,
              cursor: 'pointer', boxShadow: filterStatus === 'connected' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Connected ({activeApps.length})
          </button>
          <button
            onClick={() => setFilterStatus('available')}
            style={{
              padding: '0.4rem 0.85rem', borderRadius: '8px', border: 'none',
              backgroundColor: filterStatus === 'available' ? '#ffffff' : 'transparent',
              color: filterStatus === 'available' ? '#0f172a' : '#64748b',
              fontSize: '12px', fontWeight: filterStatus === 'available' ? 650 : 500,
              cursor: 'pointer', boxShadow: filterStatus === 'available' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Available
          </button>
        </div>
      </div>

      {/* Featured Banner Showcase */}
      <div style={{
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
        backgroundColor: '#0d0f1a',
        padding: '1.25rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
      }}>
        <img 
          src="/amira-integrations-banner.png" 
          alt="Amira Integrations Ecosystem" 
          style={{ 
            width: '100%', 
            maxHeight: '340px', 
            objectFit: 'contain', 
            borderRadius: '10px',
            display: 'block'
          }} 
        />
      </div>

      {/* Search & Category Filter Controls */}
      <div style={{
        backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
        padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search 100+ workspace tools & CRMs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', borderRadius: '10px',
                border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)',
                fontSize: '13px', color: 'var(--text-primary)', outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#94a3b8' }}>
              🔍
            </span>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.85rem', borderRadius: '8px',
                  border: selectedCategory === cat ? '1px solid #1b5a9240' : '1px solid rgba(0,0,0,0.06)',
                  backgroundColor: selectedCategory === cat ? '#1b5a920f' : '#ffffff',
                  color: selectedCategory === cat ? '#1b5a92' : '#64748b',
                  fontSize: '12px', fontWeight: selectedCategory === cat ? 650 : 500,
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Apps */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
          • Syncing available action tools & integrations...
        </div>
      ) : filteredApps.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '28px', marginBottom: '0.5rem' }}>🔍</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>No tools matched your filter</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Try clearing your search query or selecting a different category.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredApps.map(app => {
            const isConnected = activeApps.includes(app.id) || activeApps.includes(app.name.toLowerCase());
            const isBusy = connectingApp === app.id;

            return (
              <div
                key={app.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: isConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '16px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.95rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Header: Logo, Name, Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={getIntegrationLogoUrl(app.id || app.name)}
                        alt={app.name}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = 'https://logos.composio.dev/api/github';
                        }}
                        style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>{app.name}</h3>
                      {app.toolsCount ? (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{app.toolsCount} Actions available</span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>OAuth 2.0 Direct</span>
                      )}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px',
                    backgroundColor: isConnected ? '#10b98115' : '#f1f5f9',
                    color: isConnected ? '#10b981' : '#64748b',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isConnected ? '#10b981' : '#94a3b8' }} />
                    {isConnected ? 'Connected' : 'Available'}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                  {app.desc}
                </p>

                {/* Action Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                  <button
                    onClick={() => handleToggleConnection(app.id, isConnected)}
                    disabled={isBusy}
                    style={{
                      width: '100%',
                      padding: '0.55rem 1rem',
                      borderRadius: '9px',
                      border: isConnected ? '1px solid rgba(239, 68, 68, 0.2)' : 'none',
                      backgroundColor: isConnected ? '#fff5f5' : '#1b5a92',
                      color: isConnected ? '#ef4444' : '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isConnected ? 'none' : '0 2px 8px rgba(27,90,146,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {isBusy ? (
                      'Processing...'
                    ) : isConnected ? (
                      'Disconnect Account'
                    ) : (
                      'Connect App ⚡'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
