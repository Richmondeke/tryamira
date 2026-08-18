'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  metadata?: Record<string, any>;
  read: boolean;
  created_at: string;
}

const TYPE_META: Record<string, { icon: string; color: string; label: string }> = {
  call_completed: { icon: '📞', color: '#10b981', label: 'Call' },
  call_failed:    { icon: '❌', color: '#ef4444', label: 'Alert' },
  lead_captured:  { icon: '🎯', color: '#4caf50', label: 'Lead' },
  form_submission:{ icon: '📋', color: '#f59e0b', label: 'Form' },
  agent_updated:  { icon: '🤖', color: '#3b82f6', label: 'Agent' },
  integration_connected: { icon: '🔗', color: '#10b981', label: 'Integration' },
  campaign_started:  { icon: '🚀', color: '#ec4899', label: 'Campaign' },
  campaign_completed:{ icon: '✅', color: '#10b981', label: 'Campaign' },
  team_invite:    { icon: '👥', color: '#f97316', label: 'Team' },
  default:        { icon: '🔔', color: '#1b5a92', label: 'System' },
};

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'call_completed',
    title: 'AI Voice Call Resolved',
    body: 'Inbound customer inquiry from +1 (555) 234-8901 successfully resolved by Amira Agent (Duration: 2m 14s).',
    read: false,
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'lead_captured',
    title: 'New Lead Captured via Webchat',
    body: 'Alex Morgan submitted contact details for Enterprise AI Support evaluation.',
    read: false,
    created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'integration_connected',
    title: 'HubSpot Integration Live',
    body: 'CRM sync connected 450 contacts to Amira Knowledge Base.',
    read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    type: 'agent_updated',
    title: 'Amira Voice Agent V3 Deployed',
    body: 'Amira voice engine updated with 12 custom knowledge base documents.',
    read: true,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    type: 'form_submission',
    title: 'Support Intake Form Submitted',
    body: 'Technical support request #1092 logged into queue for review.',
    read: true,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  }
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  workspaceId?: string;
}

export default function NotificationDrawer({ open, onClose, workspaceId }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'calls'>('all');
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const [showTestBanner, setShowTestBanner] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  const handleEnablePush = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setPushStatus(perm);
      if (perm === 'granted') {
        try {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const reg = await navigator.serviceWorker.ready;
            reg.showNotification('🔔 Amira Notifications Active', {
              body: 'You will now receive instant desktop and mobile alerts for inbound calls and leads.',
              icon: '/icon.png'
            });
          } else {
            new Notification('🔔 Amira Notifications Active', {
              body: 'You will now receive instant desktop and mobile alerts for inbound calls and leads.',
              icon: '/icon.png'
            });
          }
        } catch (e) {
          console.warn('Push error:', e);
        }
      }
    }
  };

  const playNotificationSound = () => {
    try {
      if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        }
      }
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  const handleTriggerTestAlert = async () => {
    playNotificationSound();
    setShowTestBanner(true);
    setTimeout(() => setShowTestBanner(false), 5000);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        // Try Service Worker registration first (standard for Chrome/PWA)
        if ('serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            if (reg && reg.showNotification) {
              await reg.showNotification('🚀 Live Alert from Amira', {
                body: 'Customer call connected via +1 (415) 555-0198 (Sales Closer Agent).',
                icon: '/icon.png',
                badge: '/icon.png',
                tag: 'amira-test-alert'
              });
              return;
            }
          } catch (swErr) {
            console.warn('SW showNotification error, falling back to new Notification:', swErr);
          }
        }

        // Direct Browser Notification API fallback
        try {
          const notif = new Notification('🚀 Live Alert from Amira', {
            body: 'Customer call connected via +1 (415) 555-0198 (Sales Closer Agent).',
            icon: '/icon.png',
            badge: '/icon.png',
            tag: 'amira-test-alert'
          });
          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        } catch (err) {
          console.warn('Direct notification error:', err);
        }
      } else {
        handleEnablePush();
      }
    }
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      if (workspaceId) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          setNotifications(data);
          setLoading(false);
          return;
        }
      }
      setNotifications(DEFAULT_NOTIFICATIONS);
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (!open) return;
    fetchNotifications();

    if (!workspaceId) return;

    // Realtime Supabase subscription
    const channel = supabase
      .channel(`notifications:${workspaceId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `workspace_id=eq.${workspaceId}`,
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [open, workspaceId, fetchNotifications]);

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (!workspaceId) return;
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('workspace_id', workspaceId)
        .eq('read', false);
    } catch (e) {
      console.warn('Backend markAllRead error:', e);
    }
  };

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (!workspaceId) return;
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    } catch (e) {
      console.warn('Backend markRead error:', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'unread') return !n.read;
    if (filterTab === 'calls') return n.type.includes('call');
    return true;
  });

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.35)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Right Sidebar Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '420px',
        maxWidth: '100vw',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid var(--border-subtle, #e2e8f0)',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.12)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1b5a92' }}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
              }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: '12.5px', color: '#10b981', fontWeight: 700,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', padding: '6px',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Close panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
          backgroundColor: '#f8fafc'
        }}>
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'calls', label: 'Calls' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: filterTab === tab.id ? 700 : 500,
                border: 'none',
                backgroundColor: filterTab === tab.id ? '#1b5a92' : 'transparent',
                color: filterTab === tab.id ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Browser / Phone Push Alert Banner */}
        <div style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: pushStatus === 'granted' ? '#ecfdf5' : '#1b5a920f',
          borderBottom: pushStatus === 'granted' ? '1px solid #10b98125' : '1px solid #1b5a9225',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '15px' }}>{pushStatus === 'granted' ? '🟢' : '📱'}</span>
            <div style={{ fontSize: '11.5px', color: pushStatus === 'granted' ? '#047857' : '#1b5a92', fontWeight: 600, lineHeight: 1.3 }}>
              {pushStatus === 'granted' ? 'Desktop & Mobile Alerts Active' : 'Enable Instant Push & Phone Alerts'}
            </div>
          </div>
          <button
            type="button"
            onClick={pushStatus === 'granted' ? handleTriggerTestAlert : handleEnablePush}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: pushStatus === 'granted' ? '#10b981' : '#1b5a92',
              color: '#ffffff',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {pushStatus === 'granted' ? '🔔 Test Pop-up Alert' : 'Allow Alerts'}
          </button>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
              Loading notifications…
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
              <div style={{ fontSize: '15px', fontWeight: 750, color: '#1b5a92', marginBottom: '0.5rem' }}>
                All caught up!
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Real-time events like voice calls, form submissions, and integration updates will appear here automatically.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredNotifications.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.default;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      padding: '1.15rem 1.5rem',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      gap: '1rem',
                      cursor: 'pointer',
                      backgroundColor: n.read ? '#ffffff' : '#f0fdf4',
                      transition: 'background 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = n.read ? '#ffffff' : '#f0fdf4')}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      backgroundColor: `${meta.color}18`,
                      border: `1px solid ${meta.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0,
                    }}>
                      {meta.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '13.5px', fontWeight: n.read ? 650 : 800,
                          color: '#0f172a',
                        }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }}>
                          {timeAgo(n.created_at)}
                        </span>
                      </div>
                      {n.body && (
                        <div style={{
                          fontSize: '12.5px', color: '#475569',
                          marginBottom: '6px', lineHeight: 1.45,
                        }}>
                          {n.body}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '1px 7px', borderRadius: '4px', backgroundColor: `${meta.color}15`, color: meta.color }}>
                          {meta.label}
                        </span>
                      </div>
                    </div>
                    {!n.read && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: '#10b981', flexShrink: 0, marginTop: '6px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating In-App Live Alert Card */}
      {showTestBanner && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100000,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          maxWidth: '380px',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#1b5a92',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img src="/amira-head.png" alt="Amira" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
              🚀 Live Alert from Amira
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>
              Customer call connected via +1 (415) 555-0198 (Sales Closer Agent).
            </div>
          </div>
          <button
            onClick={() => setShowTestBanner(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px', padding: '2px' }}
          >
            ✕
          </button>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
