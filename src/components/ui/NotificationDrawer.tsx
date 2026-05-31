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

const TYPE_META: Record<string, { icon: string; color: string }> = {
  call_completed: { icon: '📞', color: '#10b981' },
  call_failed:    { icon: '❌', color: '#ef4444' },
  lead_captured:  { icon: '🎯', color: '#6366f1' },
  form_submission:{ icon: '📋', color: '#f59e0b' },
  agent_updated:  { icon: '🤖', color: '#3b82f6' },
  integration_connected: { icon: '🔗', color: '#8b5cf6' },
  campaign_started:  { icon: '🚀', color: '#ec4899' },
  campaign_completed:{ icon: '✅', color: '#10b981' },
  team_invite:    { icon: '👥', color: '#f97316' },
  default:        { icon: '🔔', color: '#64748b' },
};

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
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    if (!workspaceId) { setLoading(false); return; }
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(50);
      setNotifications(data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (!open || !workspaceId) return;
    fetchNotifications();

    // Supabase Realtime subscription for live updates
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
    if (!workspaceId) return;
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('workspace_id', workspaceId)
      .eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
            zIndex: 999,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '380px',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid var(--stripe-border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--stripe-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--stripe-navy)' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '8px',
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '999px',
                }}>
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: '12px', color: '#6366f1', fontWeight: 500,
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
                color: 'var(--stripe-muted)', padding: '4px',
                borderRadius: '4px', display: 'flex', alignItems: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--stripe-muted)', fontSize: '13px' }}>
              Loading notifications…
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔔</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--stripe-navy)', marginBottom: '0.5rem' }}>
                All caught up!
              </div>
              <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', margin: 0 }}>
                Events like call completions, form submissions, and lead captures will appear here in real time.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.default;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      padding: '1rem 1.5rem',
                      borderBottom: '1px solid var(--stripe-border)',
                      display: 'flex',
                      gap: '0.875rem',
                      cursor: 'pointer',
                      backgroundColor: n.read ? '#ffffff' : '#fafbff',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = n.read ? '#ffffff' : '#fafbff')}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      backgroundColor: `${meta.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', flexShrink: 0,
                    }}>
                      {meta.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: n.read ? 400 : 600,
                        color: 'var(--stripe-navy)', marginBottom: '3px',
                      }}>
                        {n.title}
                      </div>
                      {n.body && (
                        <div style={{
                          fontSize: '12px', color: 'var(--stripe-body)',
                          marginBottom: '4px', lineHeight: 1.4,
                        }}>
                          {n.body}
                        </div>
                      )}
                      <div style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>
                        {timeAgo(n.created_at)}
                      </div>
                    </div>
                    {!n.read && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: '#6366f1', flexShrink: 0, marginTop: '4px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
