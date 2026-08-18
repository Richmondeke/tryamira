'use client';

import React, { useState, useEffect } from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import GlowIcon from '@/components/GlowIcon';

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created_at: string;
  status: 'active' | 'revoked';
}

export default function V3SettingsPage() {
  const { isDemoMode } = useDemoMode();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key_1',
      name: 'Production API Key',
      key: 'amira_live_sec_991823a01f899c',
      created_at: '2026-08-16',
      status: 'active'
    }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreatedModal, setShowCreatedModal] = useState<string | null>(null);

  const generateApiKey = () => {
    const keyName = newKeyName.trim() || 'New Amira API Key';
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fullKey = `amira_live_sec_${randomHex}`;
    
    const newEntry: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: keyName,
      key: fullKey,
      created_at: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setApiKeys(prev => [newEntry, ...prev]);
    setNewKeyName('');
    setShowCreatedModal(fullKey);
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
  };

  const copyToClipboard = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>API Keys & Developer Settings</h1>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#10b981' }}>API Gateway v1</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Manage API credentials for <code>https://api.heyamira.com/v1</code>. Use secret keys to authenticate REST requests for voice agents, call dispatching, and knowledge base uploads.
          </p>
        </div>
      </div>

      {/* New API Key Generator Card */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Generate Secret API Key</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          Secret keys give full administrative access to your workspace's AI voice agents and telephony endpoints. Keep them secure.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '560px' }}>
          <input
            type="text"
            placeholder="e.g. Production Webhook Server, Mobile App Key"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            style={{
              flex: 1, padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13.5px', outline: 'none'
            }}
          />
          <button
            onClick={generateApiKey}
            style={{
              backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.65rem 1.25rem',
              fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}
          >
            <GlowIcon name="plus-outline" size={16} color="#ffffff" />
            <span>Generate Key</span>
          </button>
        </div>

        {/* Newly Created Key Modal Display */}
        {showCreatedModal && (
          <div style={{ marginTop: '1.25rem', backgroundColor: '#10b98110', border: '1px solid #10b98140', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#047857', marginBottom: '0.35rem' }}>✓ Secret API Key Generated Successfully</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <code style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', backgroundColor: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #10b98130', flex: 1 }}>
                {showCreatedModal}
              </code>
              <button
                onClick={() => copyToClipboard(showCreatedModal)}
                style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.85rem', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                {copiedKey === showCreatedModal ? '✓ Copied!' : 'Copy Key'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#047857', margin: '0.5rem 0 0 0' }}>Please copy this key now. Pass it in headers as <code>Authorization: Bearer {showCreatedModal}</code>.</p>
          </div>
        )}
      </div>

      {/* Active API Keys Table */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Workspace API Credentials</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Key Label</th>
                <th style={{ padding: '0.75rem 1rem' }}>API Secret Key</th>
                <th style={{ padding: '0.75rem 1rem' }}>Created Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                    {item.key.slice(0, 16)}****************
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{item.created_at}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px',
                      backgroundColor: item.status === 'active' ? '#10b98115' : '#ef444415',
                      color: item.status === 'active' ? '#10b981' : '#ef4444'
                    }}>
                      {item.status === 'active' ? '● Active' : '○ Revoked'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => copyToClipboard(item.key)}
                        style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {copiedKey === item.key ? '✓ Copied' : 'Copy'}
                      </button>
                      {item.status === 'active' && (
                        <button
                          onClick={() => revokeApiKey(item.id)}
                          style={{ backgroundColor: 'transparent', border: '1px solid #ef444440', color: '#ef4444', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amira Base Endpoint Specification */}
      <div style={{ backgroundColor: '#1b5a9210', border: '1px solid #1b5a9230', borderRadius: '16px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>🌐 Production API Endpoint Specification</h4>
        <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          All requests must be sent over HTTPS to the primary Amira API Gateway:
          <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1b5a92', backgroundColor: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px', margin: '0.5rem 0 0.75rem 0', border: '1px solid #1b5a9230', width: 'fit-content' }}>
            https://api.heyamira.com/v1
          </div>
          Authenticate every request by adding your API Secret Key to the HTTP Authorization header:
          <pre style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '0.85rem', borderRadius: '8px', fontSize: '12.5px', margin: '0.5rem 0 0 0', fontFamily: 'monospace' }}>
            {`Authorization: Bearer amira_live_sec_...`}
          </pre>
        </div>
      </div>

    </div>
  );
}
