'use client';

import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';

export default function ChannelsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [channels, setChannels] = useState([
    { name: 'Instagram DM', status: 'Connected', icon: '📱' },
    { name: 'WhatsApp Business', status: 'Not Connected', icon: '💬' },
    { name: 'Facebook Messenger', status: 'Not Connected', icon: '🔵' },
    { name: 'SMS (Twilio)', status: 'Not Connected', icon: '📱' }
  ]);

  const handleCardClick = (channel: any) => {
    if (channel.status !== 'Connected') {
      setConnectingChannel(channel.name);
      setShowModal(true);
    }
  };

  const handleDisconnect = (e: React.MouseEvent, channelName: string) => {
    e.stopPropagation();
    setChannels(prev => prev.map(c => c.name === channelName ? { ...c, status: 'Not Connected' } : c));
    setToast(`${channelName} disconnected.`);
  };

  const performConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowModal(false);
      setChannels(prev => prev.map(c => c.name === connectingChannel ? { ...c, status: 'Connected' } : c));
      setToast(`${connectingChannel} connected successfully!`);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(false)} title={`Connect ${connectingChannel}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '14px', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>Connecting securely...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '13px', marginTop: '0.5rem', fontFeatureSettings: '"ss01"' }}>Please wait while we establish the OAuth connection.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.5, fontFeatureSettings: '"ss01"' }}>
              You will be redirected to authenticate with <strong>{connectingChannel}</strong>. Amira will request permission to read and reply to messages on your behalf to enable the AI agent.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>Cancel</button>
              <button onClick={performConnection} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>Authenticate</button>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 400, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontFeatureSettings: '"ss01"' }}>Social Channels</h2>
        <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0, fontFeatureSettings: '"ss01"' }}>Connect your messaging platforms to the AI agent.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {channels.map((channel, i) => {
          const isConnected = channel.status === 'Connected';
          return (
            <div 
              key={i} 
              onClick={() => handleCardClick(channel)}
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--stripe-border)', 
                borderRadius: '6px', 
                padding: '1.25rem', 
                boxShadow: 'var(--stripe-shadow-ambient)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: isConnected ? 'default' : 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseOver={(e) => { if (!isConnected) e.currentTarget.style.boxShadow = '0 8px 24px rgba(50,50,93,0.1)'; }}
              onMouseOut={(e) => { if (!isConnected) e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {channel.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>{channel.name}</div>
                  <div style={{ fontSize: '12px', color: isConnected ? 'var(--stripe-body)' : '#9ca3af', marginTop: '2px', fontFeatureSettings: '"ss01"' }}>{channel.status}</div>
                </div>
              </div>
              {isConnected && (
                <button 
                  onClick={(e) => handleDisconnect(e, channel.name)} 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#d92d20', 
                    border: '1px solid #d92d20', 
                    borderRadius: '4px', 
                    padding: '0.35rem 0.75rem', 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    fontFeatureSettings: '"ss01"'
                  }}>
                  Disconnect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
