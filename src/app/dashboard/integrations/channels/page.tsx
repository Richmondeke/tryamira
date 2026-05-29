'use client';

import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';

export default function ChannelsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const channels = [
    { name: 'Instagram DM', status: 'Connected', icon: '📱' },
    { name: 'WhatsApp Business', status: 'Not Connected', icon: '💬' },
    { name: 'Facebook Messenger', status: 'Not Connected', icon: '🔵' },
    { name: 'SMS (Twilio)', status: 'Not Connected', icon: '📱' }
  ];

  const handleConnectClick = (channelName: string) => {
    setConnectingChannel(channelName);
    setShowModal(true);
  };

  const performConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowModal(false);
      setToast(`${connectingChannel} connected successfully!`);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(false)} title={`Connect ${connectingChannel}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '12px', fontWeight: 500 }}>Connecting securely...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '12px', marginTop: '0.5rem' }}>Please wait while we establish the OAuth connection.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '12px', marginBottom: '1rem' }}>
              You will be redirected to authenticate with {connectingChannel}. Amira will request permission to read and reply to messages on your behalf.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={performConnection} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Authenticate</button>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Social Channels</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Connect your messaging platforms to the AI agent.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {channels.map((channel, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {channel.icon}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{channel.name}</div>
                <div style={{ fontSize: '12px', color: channel.status === 'Connected' ? 'var(--stripe-success-text)' : 'var(--stripe-muted)' }}>{channel.status}</div>
              </div>
            </div>
            {channel.status === 'Connected' ? (
              <button style={{ backgroundColor: '#ffffff', color: '#d92d20', border: '1px solid #d92d20', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Disconnect</button>
            ) : (
              <button onClick={() => handleConnectClick(channel.name)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Connect</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
